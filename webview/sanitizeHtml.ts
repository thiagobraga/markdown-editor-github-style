/**
 * GitHub-flavoured raw HTML sanitizer.
 *
 * github.com renders the raw HTML inside a README through an allowlist
 * (html-pipeline's SanitizationFilter): layout tags such as `<p align>`,
 * `<picture>`, `<details>` and `<kbd>` survive, while scripts, styles, event
 * handlers, classes and inline `style` are dropped. This is a port of that
 * allowlist, so the editor renders the same subset GitHub does.
 *
 * Parsing goes through an inert `<template>` (no script runs, no image loads)
 * and the output is rebuilt element by element, so nothing but allowlisted
 * tags and attributes reaches the live document.
 */

import type { Theme } from './theme';

const ALLOWED_TAGS = new Set([
    'a', 'abbr', 'b', 'bdo', 'blockquote', 'br', 'caption', 'cite', 'code',
    'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'figcaption',
    'figure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'img', 'ins',
    'kbd', 'li', 'mark', 'ol', 'p', 'picture', 'pre', 'q', 'rp', 'rt', 'ruby',
    's', 'samp', 'small', 'source', 'span', 'strike', 'strong', 'sub',
    'summary', 'sup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'time',
    'tr', 'tt', 'ul', 'var', 'video', 'wbr',
]);

/** Dropped together with everything inside them. */
const DROPPED_TAGS = new Set([
    'button', 'embed', 'form', 'frame', 'frameset', 'iframe', 'input', 'link',
    'math', 'meta', 'noscript', 'object', 'script', 'select', 'style', 'svg',
    'template', 'textarea', 'title',
]);

const GLOBAL_ATTRIBUTES = new Set([
    'abbr', 'align', 'alt', 'border', 'cellpadding', 'cellspacing', 'colspan',
    'datetime', 'dir', 'headers', 'height', 'hspace', 'lang', 'nowrap',
    'rowspan', 'scope', 'start', 'title', 'valign', 'vspace', 'width',
]);

const TAG_ATTRIBUTES: Readonly<Record<string, ReadonlySet<string>>> = {
    a: new Set(['href']),
    details: new Set(['open']),
    img: new Set(['src', 'srcset', 'loading']),
    li: new Set(['value']),
    ol: new Set(['reversed', 'type']),
    source: new Set(['srcset', 'media', 'type', 'sizes']),
    video: new Set(['src', 'controls', 'loop', 'muted', 'poster', 'playsinline']),
};

const URL_ATTRIBUTES = new Set(['href', 'src', 'poster']);

const SCHEME = /^([a-z][a-z0-9+.-]*):/i;

/**
 * Whether `url` may be kept on a rendered element: relative URLs (resolved
 * against the document's `<base>`), fragments, and web/mail links. Images may
 * also inline `data:image/*`.
 */
export function isSafeUrl(url: string, allowDataImage = false): boolean {
    // Browsers ignore embedded whitespace/control characters in the scheme
    // (`java\nscript:`); strip them before looking at it.
    // eslint-disable-next-line no-control-regex
    const compact = url.replace(/[\u0000- ]/g, '');
    const scheme = SCHEME.exec(compact)?.[1]?.toLowerCase();
    if (scheme === undefined) {
        return true;
    }
    if (scheme === 'http' || scheme === 'https' || scheme === 'mailto') {
        return true;
    }
    return allowDataImage && scheme === 'data' && /^data:image\/(?!svg)/i.test(compact);
}

function isSafeSrcset(srcset: string): boolean {
    return srcset.split(',').every(candidate => isSafeUrl(candidate.trim().split(/\s+/)[0] ?? ''));
}

const DARK_SCHEME = /prefers-color-scheme\s*:\s*dark/i;
const LIGHT_SCHEME = /prefers-color-scheme\s*:\s*light/i;

/**
 * A README's `<picture>` chooses its source with `prefers-color-scheme`, as on
 * GitHub. The webview's media query reflects the OS, not the editor's theme, so
 * the choice is made here instead: sources for the active theme become
 * unconditional and sources for the other one are dropped.
 */
function adaptSourceMedia(media: string | null, theme: Theme): string | null | false {
    if (media === null) {
        return null;
    }
    const [own, other] = theme === 'dark' ? [DARK_SCHEME, LIGHT_SCHEME] : [LIGHT_SCHEME, DARK_SCHEME];
    if (other.test(media)) {
        return false;
    }
    if (own.test(media)) {
        return null;
    }
    return media;
}

export interface SanitizeOptions {
    /** Theme the rendering is shown in; decides `<picture>` sources. Defaults to light. */
    readonly theme?: Theme;
    /**
     * Keep `class` attributes naming the engine's own `md-*` classes (and this
     * extension's `gh-*` ones). Used when re-rendering engine markup (bold,
     * code, links…) mixed with inline HTML, so the theme still styles it.
     */
    readonly keepEngineClasses?: boolean;
}

function engineClasses(value: string): string {
    return value.split(/\s+/).filter(name => /^(?:md|gh)-[a-z0-9-]+$/i.test(name)).join(' ');
}

function copyAttributes(from: Element, to: Element, tag: string, options: SanitizeOptions): boolean {
    const tagAttributes = TAG_ATTRIBUTES[tag];
    for (const { name, value } of Array.from(from.attributes)) {
        const attribute = name.toLowerCase();
        if (attribute === 'class') {
            const classes = options.keepEngineClasses ? engineClasses(value) : '';
            if (classes) {
                to.setAttribute('class', classes);
            }
            continue;
        }
        if (attribute === 'id' || attribute === 'name') {
            // GitHub namespaces author ids so they cannot clash with the page's own.
            to.setAttribute(attribute, value.startsWith('user-content-') ? value : `user-content-${value}`);
            continue;
        }
        if (!GLOBAL_ATTRIBUTES.has(attribute) && !tagAttributes?.has(attribute) && !attribute.startsWith('aria-')) {
            continue;
        }
        if (URL_ATTRIBUTES.has(attribute) && !isSafeUrl(value, tag === 'img' && attribute === 'src')) {
            continue;
        }
        if (attribute === 'srcset' && !isSafeSrcset(value)) {
            continue;
        }
        if (tag === 'source' && attribute === 'media') {
            const media = adaptSourceMedia(value, options.theme ?? 'light');
            if (media === false) {
                return false;
            }
            if (media !== null) {
                to.setAttribute('media', media);
            }
            continue;
        }
        to.setAttribute(attribute, value);
    }
    return true;
}

function sanitizeChildren(from: ParentNode, to: Node, doc: Document, options: SanitizeOptions): void {
    for (const child of Array.from(from.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
            to.appendChild(doc.createTextNode(child.textContent ?? ''));
            continue;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) {
            continue; // comments, processing instructions
        }
        const element = child as Element;
        const tag = element.localName;
        if (DROPPED_TAGS.has(tag)) {
            continue;
        }
        if (!ALLOWED_TAGS.has(tag)) {
            // Unknown wrappers (`<center>`, `<font>`, custom tags) keep their content.
            sanitizeChildren(element, to, doc, options);
            continue;
        }
        const clean = doc.createElement(tag);
        if (!copyAttributes(element, clean, tag, options)) {
            continue;
        }
        sanitizeChildren(element, clean, doc, options);
        to.appendChild(clean);
    }
}

export function sanitizeHtml(source: string, doc: Document = document, options: SanitizeOptions = {}): DocumentFragment {
    const template = doc.createElement('template');
    template.innerHTML = source;
    const fragment = doc.createDocumentFragment();
    sanitizeChildren(template.content, fragment, doc, options);
    return fragment;
}

/** Matches one inline HTML tag, e.g. `<kbd>`, `</sub>`, `<br/>`, `<img src="…">`. */
const INLINE_TAG = /^<\/?[a-z][a-z0-9-]*(?:\s[^<>]*)?\/?>$/i;

export function isInlineHtmlTag(text: string): boolean {
    return INLINE_TAG.test(text);
}

const VOID_ELEMENTS = new Set(['br', 'hr', 'img', 'input', 'source', 'wbr']);

function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttribute(text: string): string {
    return escapeHtml(text).replace(/"/g, '&quot;');
}

/**
 * Serializes the engine's rendering of an inline run (a paragraph or heading)
 * back to HTML, with its hidden source markers (`**`, `` ` ``…) dropped and the
 * raw inline HTML tags it carries as glue re-emitted as real markup — so
 * `Press <kbd>Ctrl</kbd>` comes out as `Press <kbd>Ctrl</kbd>` instead of
 * `Press Ctrl` with invisible gaps. Feed the result to {@link sanitizeHtml}.
 */
export function inlineRunToHtml(element: Element): string {
    let html = '';
    for (const child of Array.from(element.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
            html += escapeHtml(child.textContent ?? '');
            continue;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) {
            continue;
        }
        const node = child as Element;
        if (node.classList.contains('md-marker')) {
            continue;
        }
        const text = node.textContent ?? '';
        if (node.classList.contains('md-glue')) {
            html += isInlineHtmlTag(text) ? text : escapeHtml(text);
            continue;
        }
        const attributes = Array.from(node.attributes)
            .map(({ name, value }) => ` ${name}="${escapeAttribute(value)}"`)
            .join('');
        html += VOID_ELEMENTS.has(node.localName)
            ? `<${node.localName}${attributes}>`
            : `<${node.localName}${attributes}>${inlineRunToHtml(node)}</${node.localName}>`;
    }
    return html;
}
