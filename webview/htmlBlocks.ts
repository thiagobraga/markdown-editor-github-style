/**
 * Renders raw HTML the way github.com does.
 *
 * The engine leaves raw HTML as source:
 *
 *  - an HTML *block* (`<p align="center"><img …></p>`) becomes an "unhandled"
 *    block, always shown as source in a dashed warning box;
 *  - inline HTML inside a paragraph or heading (`<kbd>Ctrl</kbd>`) becomes
 *    hidden glue, so the tags vanish but still take up room and `<kbd>`,
 *    `<sub>`, `<br>`… have no effect.
 *
 * This layers a sanitized rendering (see `sanitizeHtml.ts`) on top. While a
 * block is inactive — or the editor is read-only — its engine element is
 * hidden and the rendering stands in for it. Moving the caret into the block
 * (clicking the rendering, or arrowing in) reveals the source for editing,
 * just like any other block.
 *
 * GitHub alerts (`> [!NOTE]`) get the same treatment: the blockquote is
 * tagged with its alert kind and its first paragraph is re-rendered with the
 * icon + title row in place of the literal marker.
 *
 * A `<details>` whose markdown body spans several blocks (the usual README
 * idiom, with blank lines around the body) collapses those blocks while it is
 * closed, as on GitHub.
 *
 * Renderings live next to the engine's DOM: inside the unhandled-block wrapper
 * (whose `<pre>` is the only part the engine reconciles) or, for inline runs,
 * as the next sibling of the paragraph/heading. When the engine re-renders and
 * drops one, the mutation observer puts it back before the next paint.
 */

import { EditorModel, EditorView, Selection, ViewNode, findNodeOffsetById } from '@vscode/markdown-editor';
import { autorun } from '@vscode/observables';
import { alertKind, renderAlertParagraph, type AlertKind } from './alerts';
import { inlineRunToHtml, isInlineHtmlTag, sanitizeHtml } from './sanitizeHtml';
import type { Theme } from './theme';

export const RENDERED_CLASS = 'gh-html-block';
export const RENDER_CLASS = 'gh-html-render';
export const INLINE_HIDDEN_CLASS = 'gh-inline-html';
export const INLINE_RENDER_CLASS = 'gh-inline-render';
export const EMPTY_CLASS = 'gh-html-empty';
export const COLLAPSED_CLASS = 'gh-details-collapsed';
export const ALERT_CLASS = 'gh-alert';

/** HTML blocks start with a tag (`<p`, `</div`, `<!DOCTYPE`…); comments are handled by the engine. */
export function isHtmlBlockSource(source: string): boolean {
    const trimmed = source.trimStart();
    return /^<[a-z/!]/i.test(trimmed) && !trimmed.startsWith('<!--');
}

/** Net `<details>` nesting a block opens (positive) or closes (negative). */
export function detailsBalance(source: string): number {
    const opens = source.match(/<details[\s>]/gi)?.length ?? 0;
    const closes = source.match(/<\/details\s*>/gi)?.length ?? 0;
    return opens - closes;
}

export interface HtmlBlockRendererOptions {
    readonly onOpenLink: (url: string) => void;
    /** Initial theme (default light); change it later with `setTheme`. */
    readonly theme?: Theme;
}

const INLINE_RUN_SELECTOR = '.md-paragraph, .md-heading';

export class HtmlBlockRenderer {
    readonly #root: HTMLElement;
    readonly #model: EditorModel;
    readonly #view: EditorView;
    readonly #options: HtmlBlockRendererOptions;
    readonly #renderedSource = new WeakMap<HTMLElement, string>();
    /** Inline run → its rendering, and back. */
    readonly #inlineRenders = new WeakMap<HTMLElement, HTMLElement>();
    readonly #inlineOwners = new WeakMap<HTMLElement, HTMLElement>();
    /** Theme each rendering was built for; a theme switch rebuilds them. */
    readonly #renderedTheme = new WeakMap<HTMLElement, Theme>();
    #theme: Theme;

    constructor(root: HTMLElement, model: EditorModel, view: EditorView, options: HtmlBlockRendererOptions) {
        this.#root = root;
        this.#model = model;
        this.#view = view;
        this.#options = options;
        this.#theme = options.theme ?? 'light';

        // Mutation callbacks run before the next paint, so the raw source never
        // flashes. Syncing is idempotent: the records our own changes produce
        // trigger one more pass that changes nothing.
        new MutationObserver(records => {
            if (records.some(record => !this.#isOwnMutation(record))) {
                this.sync();
            }
        }).observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeOldValue: true, attributeFilter: ['class'] });

        autorun(reader => {
            reader.readObservable(model.readonlyMode);
            this.sync();
        });
    }

    setTheme(theme: Theme): void {
        if (theme !== this.#theme) {
            this.#theme = theme;
            this.sync();
        }
    }

    sync(): void {
        const readonly = this.#model.readonlyMode.get();
        for (const block of Array.from(this.#root.querySelectorAll<HTMLElement>('.md-unhandled-block'))) {
            this.#syncBlock(block, readonly);
        }
        for (const quote of Array.from(this.#root.querySelectorAll<HTMLElement>('.md-blockquote'))) {
            this.#syncAlert(quote, readonly);
        }
        for (const run of Array.from(this.#root.querySelectorAll<HTMLElement>(INLINE_RUN_SELECTOR))) {
            if (!run.classList.contains(INLINE_RENDER_CLASS)) {
                this.#syncInlineRun(run, readonly);
            }
        }
        // Drop renderings whose inline run was re-created or removed by the engine.
        for (const rendering of Array.from(this.#root.querySelectorAll<HTMLElement>(`.${INLINE_RENDER_CLASS}`))) {
            const owner = this.#inlineOwners.get(rendering);
            if (!owner || !owner.isConnected || owner.nextElementSibling !== rendering || !owner.classList.contains(INLINE_HIDDEN_CLASS)) {
                rendering.remove();
            }
        }
        this.#syncDetails();
    }

    #isOwnMutation(record: MutationRecord): boolean {
        if (this.#isInsideRendering(record.target)) {
            return true;
        }
        // Inserting a rendering is a child-list change on its parent. Removals
        // always count: the engine drops renderings when it re-renders (our own
        // orphan cleanup just costs one idempotent pass).
        const added = Array.from(record.addedNodes);
        if (record.type === 'childList' && record.removedNodes.length === 0 && added.length > 0
            && added.every(node => node instanceof HTMLElement && node.classList.contains(RENDER_CLASS))) {
            return true;
        }
        if (record.type === 'attributes') {
            // Our own class toggles; the engine's (`md-block-active`…) still count.
            const element = record.target as Element;
            const before = new Set((record.oldValue ?? '').split(/\s+/));
            const after = new Set(Array.from(element.classList));
            const changed = [...before, ...after].filter(name => before.has(name) !== after.has(name) && name !== '');
            return changed.length > 0 && changed.every(name => name.startsWith('gh-'));
        }
        return false;
    }

    #isInsideRendering(node: Node): boolean {
        const element = node instanceof Element ? node : node.parentElement;
        return (element?.closest(`.${RENDER_CLASS}`) ?? null) !== null;
    }

    /** Whether the caret is in `element`'s block (nested runs share their container's state). */
    #isActive(element: Element): boolean {
        return element.closest('.md-block-active') !== null || element.querySelector(':scope > .md-block-active') !== null;
    }

    // --- HTML blocks ----------------------------------------------------------

    #syncBlock(block: HTMLElement, readonly: boolean): void {
        const pre = block.querySelector<HTMLElement>(':scope > pre');
        const source = pre?.textContent ?? '';
        if (!isHtmlBlockSource(source) || (this.#isActive(block) && !readonly)) {
            toggleClass(block, RENDERED_CLASS, false);
            toggleClass(block, EMPTY_CLASS, false);
            return;
        }
        let rendering = block.querySelector<HTMLElement>(`:scope > .${RENDER_CLASS}`);
        if (!rendering) {
            rendering = this.#createRendering('div', block);
            block.appendChild(rendering);
        }
        if (this.#renderedSource.get(rendering) !== source || this.#renderedTheme.get(rendering) !== this.#theme) {
            rendering.replaceChildren(sanitizeHtml(source, document, { theme: this.#theme }));
            this.#renderedSource.set(rendering, source);
            this.#renderedTheme.set(rendering, this.#theme);
        }
        toggleClass(block, RENDERED_CLASS, true);
        // A block of nothing but closing tags (`</details>`) renders to nothing.
        toggleClass(block, EMPTY_CLASS, !rendering.hasChildNodes() || (rendering.textContent?.trim() === '' && !rendering.querySelector('img, video, hr, br, picture')));
    }

    // --- inline HTML ----------------------------------------------------------

    // --- alerts -------------------------------------------------------------

    /** The alert `quote` declares, while it is shown rendered (inactive or read-only). */
    #alertOf(quote: Element, readonly: boolean): AlertKind | undefined {
        if (this.#isActive(quote) && !readonly) {
            return undefined;
        }
        const first = quote.querySelector(':scope > .md-paragraph');
        return first ? alertKind(visibleText(first)) : undefined;
    }

    #syncAlert(quote: HTMLElement, readonly: boolean): void {
        const kind = this.#alertOf(quote, readonly);
        toggleClass(quote, ALERT_CLASS, kind !== undefined);
        for (const other of ['note', 'tip', 'important', 'warning', 'caution'] as const) {
            toggleClass(quote, `${ALERT_CLASS}-${other}`, other === kind);
        }
    }

    // --- inline HTML ----------------------------------------------------------

    #syncInlineRun(run: HTMLElement, readonly: boolean): void {
        const parent = run.parentElement;
        const alert = parent?.classList.contains('md-blockquote') && parent.querySelector(':scope > .md-paragraph') === run
            ? this.#alertOf(parent, readonly)
            : undefined;
        const hasInlineHtml = Array.from(run.querySelectorAll(':scope .md-glue'))
            .some(glue => isInlineHtmlTag(glue.textContent ?? ''));
        if ((!hasInlineHtml && !alert) || (this.#isActive(run) && !readonly)) {
            toggleClass(run, INLINE_HIDDEN_CLASS, false);
            return;
        }
        const html = alert ? renderAlertParagraph(alert, inlineRunToHtml(run)) : inlineRunToHtml(run);
        let rendering = this.#inlineRenders.get(run);
        if (!rendering) {
            rendering = this.#createRendering(run.localName, run);
            this.#inlineRenders.set(run, rendering);
            this.#inlineOwners.set(rendering, run);
        }
        // Same tag and engine classes as the run, so the theme styles it alike.
        const className = `${engineClassNames(run)} ${RENDER_CLASS} ${INLINE_RENDER_CLASS}`;
        if (rendering.className !== className) {
            rendering.className = className;
        }
        if (this.#renderedSource.get(rendering) !== html || this.#renderedTheme.get(rendering) !== this.#theme) {
            rendering.replaceChildren(sanitizeHtml(html, document, { keepEngineClasses: true, theme: this.#theme }));
            this.#renderedSource.set(rendering, html);
            this.#renderedTheme.set(rendering, this.#theme);
        }
        if (run.nextElementSibling !== rendering) {
            run.after(rendering);
        }
        toggleClass(run, INLINE_HIDDEN_CLASS, true);
    }

    // --- <details> spanning blocks ------------------------------------------

    #syncDetails(): void {
        const collapsed = new Set<Element>();
        for (const block of Array.from(this.#root.querySelectorAll<HTMLElement>(`.md-unhandled-block.${RENDERED_CLASS}`))) {
            const source = this.#renderedSource.get(block.querySelector<HTMLElement>(`:scope > .${RENDER_CLASS}`)!) ?? '';
            if (detailsBalance(source) <= 0) {
                continue;
            }
            const details = Array.from(block.querySelectorAll('details')).pop();
            if (!details || details.open) {
                continue;
            }
            // Collapse following siblings up to the block that closes the details.
            let depth = detailsBalance(source);
            for (let sibling = block.nextElementSibling; sibling && depth > 0; sibling = sibling.nextElementSibling) {
                if (sibling.classList.contains(RENDER_CLASS)) {
                    collapsed.add(sibling);
                    continue;
                }
                const siblingSource = sibling.classList.contains('md-unhandled-block')
                    ? sibling.querySelector(':scope > pre')?.textContent ?? ''
                    : '';
                depth += detailsBalance(siblingSource);
                if (depth > 0 && !this.#isActive(sibling)) {
                    collapsed.add(sibling);
                }
            }
        }
        for (const element of Array.from(this.#root.querySelectorAll(`.${COLLAPSED_CLASS}`))) {
            if (!collapsed.has(element)) {
                element.classList.remove(COLLAPSED_CLASS);
            }
        }
        for (const element of collapsed) {
            toggleClass(element, COLLAPSED_CLASS, true);
        }
    }

    // --- interaction ----------------------------------------------------------

    #createRendering(tag: string, owner: HTMLElement): HTMLElement {
        const rendering = document.createElement(tag);
        rendering.className = RENDER_CLASS;
        rendering.contentEditable = 'false';
        // Keep the engine's own pointer handling (hit-testing source text) off
        // the rendering: it has no source text to map.
        rendering.addEventListener('pointerdown', event => {
            event.stopPropagation();
            const target = event.target instanceof Element ? event.target : null;
            if (event.button !== 0 || this.#model.readonlyMode.get() || target?.closest('a[href], summary, video') || event.ctrlKey || event.metaKey) {
                return;
            }
            event.preventDefault();
            this.#placeCaretIn(this.#inlineOwners.get(rendering) ?? owner);
        });
        rendering.addEventListener('click', event => {
            const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
            if (!anchor) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            this.#options.onOpenLink(anchor.getAttribute('href') ?? '');
        });
        // `toggle` does not bubble; listen in the capture phase.
        rendering.addEventListener('toggle', () => this.sync(), true);
        return rendering;
    }

    /** Puts the caret at the start of the block's source, which activates it. */
    #placeCaretIn(block: HTMLElement): void {
        const node = ViewNode.forDom(block);
        if (!node) {
            return;
        }
        const offset = findNodeOffsetById(this.#model.document.get(), node.ast);
        if (offset === undefined) {
            return;
        }
        const leadingTrivia = (node.ast as { leadingTrivia?: { length: number } }).leadingTrivia?.length ?? 0;
        this.#model.selectionSource.set('user', undefined);
        this.#model.selection.set(new Selection(offset + leadingTrivia, offset + leadingTrivia), undefined);
        this.#view.focus();
    }
}

function toggleClass(element: Element, name: string, on: boolean): void {
    // Only touch the DOM on a real change, so syncing stays quiescent.
    if (element.classList.contains(name) !== on) {
        element.classList.toggle(name, on);
    }
}

/** Text as rendered: without the engine's hidden source markers (`> `, `**`…). */
function visibleText(element: Element): string {
    const clone = element.cloneNode(true) as Element;
    for (const marker of Array.from(clone.querySelectorAll('.md-marker'))) {
        marker.remove();
    }
    return clone.textContent ?? '';
}

function engineClassNames(element: Element): string {
    return Array.from(element.classList).filter(name => !name.startsWith('gh-')).join(' ');
}
