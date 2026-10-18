// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { inlineRunToHtml, isInlineHtmlTag, isSafeUrl, sanitizeHtml } from '../../webview/sanitizeHtml';

function render(source: string, options?: Parameters<typeof sanitizeHtml>[2]): string {
    const host = document.createElement('div');
    host.appendChild(sanitizeHtml(source, document, options));
    return host.innerHTML;
}

describe('sanitizeHtml', () => {
    it('keeps the layout markup READMEs use', () => {
        expect(render('<p align="center"><img src="logo.png" alt="Logo" width="320"></p>'))
            .toBe('<p align="center"><img src="logo.png" alt="Logo" width="320"></p>');
        expect(render('<h1 align="center">Title</h1>')).toBe('<h1 align="center">Title</h1>');
        expect(render('<details open><summary>More</summary>Body</details>'))
            .toBe('<details open=""><summary>More</summary>Body</details>');
        expect(render('Press <kbd>Ctrl</kbd>, H<sub>2</sub>O')).toBe('Press <kbd>Ctrl</kbd>, H<sub>2</sub>O');
    });

    it('drops scripts, styles and embedded documents with their content', () => {
        expect(render('<p>ok</p><script>alert(1)</script><style>p{}</style><iframe src="x"></iframe>'))
            .toBe('<p>ok</p>');
        expect(render('<p>before</p><svg><script>alert(1)</script></svg>')).toBe('<p>before</p>');
    });

    it('unwraps unknown tags but keeps their text', () => {
        expect(render('<center>Centered <b>bold</b></center>')).toBe('Centered <b>bold</b>');
        expect(render('<font color="red">red</font>')).toBe('red');
    });

    it('strips event handlers, inline styles and classes', () => {
        expect(render('<img src="a.png" onerror="alert(1)" style="width:1px" class="x">'))
            .toBe('<img src="a.png">');
        expect(render('<div onclick="x()" align="right">r</div>')).toBe('<div align="right">r</div>');
    });

    it('removes dangerous urls but keeps relative, web and mail links', () => {
        expect(render('<a href="javascript:alert(1)">x</a>')).toBe('<a>x</a>');
        expect(render('<a href="java\nscript:alert(1)">x</a>')).toBe('<a>x</a>');
        expect(render('<a href="docs/guide.md">g</a>')).toBe('<a href="docs/guide.md">g</a>');
        expect(render('<a href="#install">i</a>')).toBe('<a href="#install">i</a>');
        expect(render('<a href="https://github.com">gh</a>')).toBe('<a href="https://github.com">gh</a>');
        expect(render('<a href="mailto:a@b.c">m</a>')).toBe('<a href="mailto:a@b.c">m</a>');
        expect(render('<img src="data:image/svg+xml,<svg/>">')).toBe('<img>');
        expect(render('<img src="data:image/png;base64,AAAA">')).toBe('<img src="data:image/png;base64,AAAA">');
        expect(render('<a href="data:text/html,x">d</a>')).toBe('<a>d</a>');
    });

    it('drops srcset candidates lists containing an unsafe url', () => {
        expect(render('<img srcset="a.png 1x, javascript:x 2x">')).toBe('<img>');
        expect(render('<img srcset="a.png 1x, b.png 2x">')).toBe('<img srcset="a.png 1x, b.png 2x">');
    });

    it('namespaces author ids like GitHub', () => {
        expect(render('<a id="top" name="anchor">t</a>')).toBe('<a id="user-content-top" name="user-content-anchor">t</a>');
    });

    it('picks the dark-theme source of a <picture> in a dark editor', () => {
        const html = render(
            '<picture>'
            + '<source media="(prefers-color-scheme: dark)" srcset="dark.png">'
            + '<source media="(prefers-color-scheme: light)" srcset="light.png">'
            + '<img src="fallback.png">'
            + '</picture>',
            { theme: 'dark' },
        );
        expect(html).toBe('<picture><source srcset="dark.png"><img src="fallback.png"></picture>');
    });

    it('picks the light-theme source of a <picture>, whatever the OS color scheme', () => {
        const html = render(
            '<picture>'
            + '<source media="(prefers-color-scheme: dark)" srcset="dark.png">'
            + '<source media="(prefers-color-scheme: light)" srcset="light.png">'
            + '<img src="fallback.png">'
            + '</picture>',
        );
        expect(html).toBe('<picture><source srcset="light.png"><img src="fallback.png"></picture>');
    });

    it('keeps other media queries on sources', () => {
        expect(render('<picture><source media="(min-width: 600px)" srcset="wide.png"><img src="n.png"></picture>'))
            .toBe('<picture><source media="(min-width: 600px)" srcset="wide.png"><img src="n.png"></picture>');
    });

    it('keeps only engine classes when asked to', () => {
        expect(render('<code class="md-inline-code evil">x</code>', { keepEngineClasses: true }))
            .toBe('<code class="md-inline-code">x</code>');
        expect(render('<code class="md-inline-code">x</code>')).toBe('<code>x</code>');
    });

    it('never runs inline handlers while parsing', () => {
        const globals = globalThis as { __pwned?: boolean };
        render('<img src="x" onerror="globalThis.__pwned = true">');
        expect(globals.__pwned).toBeUndefined();
    });
});

describe('isSafeUrl', () => {
    it.each([
        ['relative/path.png', true],
        ['#anchor', true],
        ['https://x.y', true],
        ['HTTP://X.Y', true],
        ['mailto:a@b', true],
        ['javascript:x', false],
        [' JavaScript:x', false],
        ['vbscript:x', false],
        ['file:///etc/passwd', false],
        ['command:workbench.action.reloadWindow', false],
    ])('%s -> %s', (url, safe) => {
        expect(isSafeUrl(url)).toBe(safe);
    });
});

describe('inline HTML', () => {
    it('recognizes single inline tags', () => {
        expect(isInlineHtmlTag('<kbd>')).toBe(true);
        expect(isInlineHtmlTag('</kbd>')).toBe(true);
        expect(isInlineHtmlTag('<br/>')).toBe(true);
        expect(isInlineHtmlTag('<img src="a.png" width="20">')).toBe(true);
        expect(isInlineHtmlTag('\n')).toBe(false);
        expect(isInlineHtmlTag('a < b > c')).toBe(false);
        expect(isInlineHtmlTag('<kbd>x</kbd>')).toBe(false);
    });

    it('re-emits glue tags as markup and drops hidden markers', () => {
        const paragraph = document.createElement('p');
        paragraph.innerHTML = 'Press <span class="md-glue md-glue-hidden">&lt;kbd&gt;</span>Ctrl'
            + '<span class="md-glue md-glue-hidden">&lt;/kbd&gt;</span> or '
            + '<strong><span class="md-marker">**</span>bold<span class="md-marker">**</span></strong>'
            + '<span class="md-glue md-glue-hidden">\n</span>a &lt; b'
            + '<img src="x.png" alt="x">';

        expect(inlineRunToHtml(paragraph)).toBe('Press <kbd>Ctrl</kbd> or <strong>bold</strong>\na &lt; b<img src="x.png" alt="x">');
    });
});
