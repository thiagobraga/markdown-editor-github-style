/**
 * Markdown Editor Github Style — webview bootstrap.
 *
 * Builds the same editor component VS Code's built-in markdown editor uses
 * (`@vscode/markdown-editor`), but mounts it with the package's own
 * `github-markdown-theme` instead of the VS Code default theme.
 *
 * Protocol (extension host <-> webview):
 *   host -> webview: { type: 'content', content }
 *   webview -> host:
 *     { type: 'edit', start, endExclusive, text }
 *     { type: 'undo' } / { type: 'redo' }
 *     { type: 'openLink', href }
 *     { type: 'setReadonly', readonly }
 *     { type: 'setTheme', theme: 'auto' | 'light' | 'dark' }
 *     { type: 'openSource' }
 */

import {
    EditorController,
    EditorModel,
    EditorView,
    Selection,
    StringValue,
} from '@vscode/markdown-editor';
import { autorun } from '@vscode/observables';
import 'katex/dist/katex.min.css';
import '@vscode/markdown-editor/editor.css';
import '@vscode/markdown-editor/themes/github.css';
/* Pins the package theme to the markdown styles github.com ships today. */
import './github-light.css';
/* Primer dark values, active under `<html data-gh-theme="dark">` (see theme.ts). */
import './github-dark.css';
import './canvas.css';
import { computeTextEdit } from './computeTextEdit';
import { HtmlBlockRenderer } from './htmlBlocks';
import { classifyLink, findHeadingBySlug } from './links';
import { isThemePreference, ThemeController, type ThemePreference } from './theme';
import { createSourceButton, createThemeToggle } from './themeToggle';

interface VsCodeApi {
    postMessage(message: unknown): void;
    getState(): unknown;
    setState(state: unknown): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

interface InitialState {
    readonly content: string;
    readonly documentVersion: number;
    readonly readonly: boolean;
    readonly theme: ThemePreference;
}

interface PersistedViewState {
    scrollTop?: number;
    selection?: { anchor: number; active: number };
}

function readInitialState(): InitialState {
    const element = document.querySelector<HTMLMetaElement>('meta[name="github-style-markdown-editor-initial-state"]');
    if (!element) {
        throw new Error('Markdown editor initial state was not found.');
    }
    element.remove();
    const value: unknown = JSON.parse(decodeURIComponent(element.content));
    const candidate = value as Partial<InitialState>;
    if (typeof candidate?.content !== 'string') {
        throw new Error('Markdown editor initial state is invalid.');
    }
    return {
        content: candidate.content,
        documentVersion: candidate.documentVersion ?? 0,
        readonly: candidate.readonly === true,
        theme: isThemePreference(candidate.theme) ? candidate.theme : 'auto',
    };
}

class GithubStyleEditor {
    readonly model = new EditorModel();
    readonly #vscode = acquireVsCodeApi();
    #isUpdatingFromHost = false;
    #previousText: string;

    constructor(host: HTMLElement, initial: InitialState) {
        this.#previousText = initial.content;
        this.model.sourceText.set(new StringValue(initial.content), undefined);
        this.model.readonlyMode.set(initial.readonly, undefined);

        const view = new EditorView(this.model, {
            classNames: ['github-markdown-theme'],
            presentation: initial.readonly ? 'reading' : 'editing',
            onOpenLink: (url: string) => this.#openLink(host, url),
            onToggleCheckbox: (item, checked) => {
                this.model.setTaskCheckboxChecked(item, checked);
            },
        });
        // Undo/redo chords go to the provider's per-document history (see
        // src/documentHistory.ts); the DOM editor keeps no local stack. The
        // default keyboard profile handles every editor chord locally — the
        // engine's VS Code profiles would forward undo to the workbench's
        // native TextDocument stack instead.
        new EditorController(this.model, view, {
            historyStrategy: {
                undo: () => this.#vscode.postMessage({ type: 'undo' }),
                redo: () => this.#vscode.postMessage({ type: 'redo' }),
            },
        });

        host.appendChild(view.element);

        // GitHub renders raw HTML blocks (centered logos, <picture>, <details>…);
        // the engine leaves them as unhandled source.
        const themeController = new ThemeController(initial.theme, next => htmlBlocks.setTheme(next));
        const htmlBlocks = new HtmlBlockRenderer(view.element, this.model, view, {
            onOpenLink: url => this.#openLink(host, url),
            theme: themeController.theme,
        });
        createSourceButton(view.element, () => this.#vscode.postMessage({ type: 'openSource' }));
        createThemeToggle(view.element, initial.theme, () => {
            const preference = themeController.nextPreference();
            themeController.setPreference(preference);
            this.#vscode.postMessage({ type: 'setTheme', theme: preference });
            return preference;
        });

        const saved = this.#getViewState();
        if (saved.selection) {
            const max = initial.content.length;
            this.model.selection.set(
                new Selection(Math.min(saved.selection.anchor, max), Math.min(saved.selection.active, max)),
                undefined,
            );
        }

        // --- host -> webview -------------------------------------------------
        window.addEventListener('message', (event: MessageEvent) => {
            const message = event.data as { type?: string; content?: unknown };
            if (message?.type !== 'content' || typeof message.content !== 'string') {
                return;
            }
            this.#isUpdatingFromHost = true;
            try {
                // Maps the selection through the change instead of resetting it.
                this.model.replaceSourceText(new StringValue(message.content));
            } finally {
                this.#isUpdatingFromHost = false;
            }
            this.#previousText = message.content;
        });

        // --- webview -> host -------------------------------------------------
        autorun(reader => {
            const text = reader.readObservable(this.model.sourceText).value;
            if (this.#isUpdatingFromHost) {
                return;
            }
            const edit = computeTextEdit(this.#previousText, text);
            if (edit) {
                this.#vscode.postMessage({ type: 'edit', ...edit });
            }
            this.#previousText = text;
        });

        // The edit/read-only toggle flips `readonlyMode`; mirror it into the
        // presentation and remember it as the default for the next editor. The
        // initial value is skipped so opening an editor never re-writes it.
        let firstReadonly = true;
        autorun(reader => {
            const readonly = reader.readObservable(this.model.readonlyMode);
            this.model.presentation.set(readonly ? 'reading' : 'editing', undefined);
            if (!firstReadonly) {
                this.#vscode.postMessage({ type: 'setReadonly', readonly });
            }
            firstReadonly = false;
        });

        autorun(reader => {
            const selection = reader.readObservable(this.model.selection);
            this.#patchViewState({ selection: selection ? { anchor: selection.anchor, active: selection.active } : undefined });
        });

        // Persist scroll position across webview reloads.
        this.#restoreScroll(host, saved.scrollTop);
        let scrollSaveScheduled = false;
        host.addEventListener('scroll', () => {
            if (scrollSaveScheduled) {
                return;
            }
            scrollSaveScheduled = true;
            requestAnimationFrame(() => {
                scrollSaveScheduled = false;
                this.#patchViewState({ scrollTop: host.scrollTop });
            });
        }, { passive: true });
        window.addEventListener('pagehide', () => {
            // Flush synchronously; a frame-throttled save may not have run yet.
            this.#patchViewState({ scrollTop: host.scrollTop });
        });
    }

    #openLink(host: HTMLElement, url: string): void {
        const link = classifyLink(url);
        if (link.kind === 'fragment') {
            findHeadingBySlug(host, link.slug)?.scrollIntoView({ block: 'start' });
            return;
        }
        if (link.kind !== 'blocked') {
            this.#vscode.postMessage({ type: 'openLink', href: url });
        }
    }

    #getViewState(): PersistedViewState {
        return (this.#vscode.getState() as PersistedViewState | undefined) ?? {};
    }

    #patchViewState(patch: PersistedViewState): void {
        this.#vscode.setState({ ...this.#getViewState(), ...patch });
    }

    #restoreScroll(host: HTMLElement, scrollTop: number | undefined): void {
        if (typeof scrollTop !== 'number' || scrollTop <= 0) {
            return;
        }
        // Content height settles over a few frames (async parse, images), so
        // re-apply until it sticks.
        let tries = 0;
        const apply = (): void => {
            host.scrollTop = scrollTop;
            if (++tries < 6 && Math.abs(host.scrollTop - scrollTop) > 1) {
                requestAnimationFrame(apply);
            }
        };
        requestAnimationFrame(apply);
    }
}

new GithubStyleEditor(document.getElementById('editor')!, readInitialState());
