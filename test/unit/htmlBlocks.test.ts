// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { EditorModel, EditorView, StringValue } from '@vscode/markdown-editor';
import {
    ALERT_CLASS,
    COLLAPSED_CLASS,
    EMPTY_CLASS,
    HtmlBlockRenderer,
    INLINE_HIDDEN_CLASS,
    RENDERED_CLASS,
    detailsBalance,
    isHtmlBlockSource,
} from '../../webview/htmlBlocks';

/** Mutation observers deliver asynchronously in happy-dom. */
const settle = (): Promise<void> => new Promise(resolve => setTimeout(resolve, 0));

const roots: HTMLElement[] = [];

afterEach(() => {
    for (const root of roots.splice(0)) {
        root.remove();
    }
});

function escape(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** The engine's markup for an unhandled (raw HTML) block. */
function unhandledBlock(source: string, active = false): string {
    return `<div class="md-block md-unhandled-block"><pre class="md-code-block md-unhandled-scroll${active ? ' md-block-active' : ''}"><code>${escape(source)}</code></pre></div>`;
}

function mount(html: string, options: { readonly?: boolean } = {}) {
    const root = document.createElement('div');
    root.innerHTML = html;
    document.body.appendChild(root);
    roots.push(root);
    const model = new EditorModel();
    model.sourceText.set(new StringValue(''), undefined);
    model.readonlyMode.set(options.readonly === true, undefined);
    const opened: string[] = [];
    const view = { focus(): void { /* noop */ } } as unknown as EditorView;
    const renderer = new HtmlBlockRenderer(root, model, view, { onOpenLink: url => opened.push(url) });
    return { root, model, renderer, opened };
}

describe('html block sources', () => {
    it('recognizes HTML blocks but leaves comments to the engine', () => {
        expect(isHtmlBlockSource('<p align="center">\n  <img src="x.png">\n</p>')).toBe(true);
        expect(isHtmlBlockSource('  </details>')).toBe(true);
        expect(isHtmlBlockSource('<!-- note -->')).toBe(false);
        expect(isHtmlBlockSource('$$\nx\n$$')).toBe(false);
    });

    it('counts <details> nesting', () => {
        expect(detailsBalance('<details>\n<summary>More</summary>')).toBe(1);
        expect(detailsBalance('<details open><summary>x</summary>y</details>')).toBe(0);
        expect(detailsBalance('</details>')).toBe(-1);
        expect(detailsBalance('<detailsx>')).toBe(0);
    });
});

describe('HtmlBlockRenderer', () => {
    it('renders an inactive HTML block in place of its source', () => {
        const { root } = mount(unhandledBlock('<p align="center"><img src="logo.png" alt="Logo"></p>'));

        const block = root.querySelector('.md-unhandled-block')!;
        expect(block.classList.contains(RENDERED_CLASS)).toBe(true);
        expect(block.querySelector('.gh-html-render')!.innerHTML).toBe('<p align="center"><img src="logo.png" alt="Logo"></p>');
    });

    it('shows the source again while the caret is in the block', async () => {
        const { root } = mount(unhandledBlock('<h1 align="center">Title</h1>'));
        const block = root.querySelector('.md-unhandled-block')!;

        block.querySelector('pre')!.classList.add('md-block-active');
        await settle();
        expect(block.classList.contains(RENDERED_CLASS)).toBe(false);

        block.querySelector('pre')!.classList.remove('md-block-active');
        await settle();
        expect(block.classList.contains(RENDERED_CLASS)).toBe(true);
    });

    it('keeps rendering while read-only, even for the active block', async () => {
        const { root, model } = mount(unhandledBlock('<h1>Title</h1>', true), { readonly: true });
        const block = root.querySelector('.md-unhandled-block')!;
        expect(block.classList.contains(RENDERED_CLASS)).toBe(true);

        model.readonlyMode.set(false, undefined);
        expect(block.classList.contains(RENDERED_CLASS)).toBe(false);
    });

    it('re-renders when the source changes', async () => {
        const { root } = mount(unhandledBlock('<b>one</b>'));
        root.querySelector('code')!.textContent = '<b>two</b>';
        await settle();

        expect(root.querySelector('.gh-html-render')!.innerHTML).toBe('<b>two</b>');
    });

    it('hides blocks that render to nothing, such as a lone </details>', () => {
        const { root } = mount(unhandledBlock('</details>'));
        expect(root.querySelector('.md-unhandled-block')!.classList.contains(EMPTY_CLASS)).toBe(true);
    });

    it('leaves non-HTML unhandled blocks alone', () => {
        const { root } = mount(unhandledBlock('::: custom container'));
        const block = root.querySelector('.md-unhandled-block')!;
        expect(block.classList.contains(RENDERED_CLASS)).toBe(false);
        expect(block.querySelector('.gh-html-render')).toBeNull();
    });

    it('routes link clicks in the rendering through onOpenLink with the raw href', () => {
        const { root, opened } = mount(unhandledBlock('<a href="docs/guide.md">Guide</a>'));
        root.querySelector<HTMLAnchorElement>('.gh-html-render a')!.click();

        expect(opened).toEqual(['docs/guide.md']);
    });

    it('collapses the markdown body of a closed <details> until it is opened', async () => {
        const { root } = mount(
            unhandledBlock('<details>\n<summary>More</summary>')
            + '<p class="md-block md-paragraph md-markers-hidden">Hidden body</p>'
            + unhandledBlock('</details>')
            + '<p class="md-block md-paragraph md-markers-hidden">After</p>',
        );
        const [body, after] = Array.from(root.querySelectorAll('p.md-paragraph'));
        expect(body!.classList.contains(COLLAPSED_CLASS)).toBe(true);
        expect(after!.classList.contains(COLLAPSED_CLASS)).toBe(false);

        const details = root.querySelector('details')!;
        details.open = true;
        details.dispatchEvent(new Event('toggle'));
        await settle();
        expect(body!.classList.contains(COLLAPSED_CLASS)).toBe(false);
    });
});

describe('inline HTML in paragraphs', () => {
    const paragraph = (active = false) =>
        `<p class="md-block md-paragraph md-markers-hidden${active ? ' md-block-active' : ''}">Press `
        + '<span class="md-glue md-glue-hidden">&lt;kbd&gt;</span>Ctrl<span class="md-glue md-glue-hidden">&lt;/kbd&gt;</span></p>';

    it('stands a rendered twin in for an inactive paragraph', () => {
        const { root } = mount(paragraph());
        const source = root.querySelector('p:not(.gh-inline-render)')!;
        const twin = source.nextElementSibling!;

        expect(source.classList.contains(INLINE_HIDDEN_CLASS)).toBe(true);
        expect(twin.classList.contains('gh-inline-render')).toBe(true);
        expect(twin.classList.contains('md-paragraph')).toBe(true);
        expect(twin.innerHTML).toBe('Press <kbd>Ctrl</kbd>');
    });

    it('shows the source paragraph while it is being edited', () => {
        const { root } = mount(paragraph(true));
        expect(root.querySelector('p')!.classList.contains(INLINE_HIDDEN_CLASS)).toBe(false);
        expect(root.querySelector('.gh-inline-render')).toBeNull();
    });

    it('puts the twin back when the engine drops it', async () => {
        const { root } = mount(paragraph());
        root.querySelector('.gh-inline-render')!.remove();
        await settle();

        expect(root.querySelectorAll('.gh-inline-render')).toHaveLength(1);
    });

    it('leaves paragraphs without inline HTML untouched', () => {
        const { root } = mount('<p class="md-block md-paragraph md-markers-hidden">Plain<span class="md-glue md-glue-hidden">\n</span>text</p>');
        expect(root.querySelector('.gh-inline-render')).toBeNull();
    });
});

describe('alerts', () => {
    const quote = (marker: string, active = false) =>
        `<blockquote class="md-block md-blockquote md-markers-hidden${active ? ' md-block-active' : ''}">`
        + '<span class="md-marker">&gt; </span>'
        + `<p class="md-block md-paragraph">${marker}<span class="md-glue">\n</span><span class="md-marker">&gt; </span>Body.</p>`
        + '</blockquote>';

    it('styles a [!WARNING] blockquote as a GitHub alert', () => {
        const { root } = mount(quote('[!WARNING]'));
        const blockquote = root.querySelector('blockquote')!;

        expect(blockquote.classList.contains(ALERT_CLASS)).toBe(true);
        expect(blockquote.classList.contains(`${ALERT_CLASS}-warning`)).toBe(true);
        expect(blockquote.querySelector('.gh-inline-render')!.innerHTML)
            .toBe('<span class="gh-alert-title gh-alert-title-warning">Warning</span>Body.');
    });

    it('shows the raw marker while the alert is being edited', () => {
        const { root } = mount(quote('[!NOTE]', true));
        expect(root.querySelector('blockquote')!.classList.contains(ALERT_CLASS)).toBe(false);
        expect(root.querySelector('.gh-inline-render')).toBeNull();
    });

    it('ignores ordinary blockquotes', () => {
        const { root } = mount(quote('Just a quote'));
        expect(root.querySelector('blockquote')!.classList.contains(ALERT_CLASS)).toBe(false);
    });
});
