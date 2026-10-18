// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { classifyLink, findHeadingBySlug, githubSlug, headingSlugs } from '../../webview/links';

describe('classifyLink', () => {
    it('treats #fragments as in-document anchors', () => {
        expect(classifyLink('#Getting-Started')).toEqual({ kind: 'fragment', slug: 'getting-started' });
        expect(classifyLink('#user-content-install')).toEqual({ kind: 'fragment', slug: 'install' });
        expect(classifyLink('#caf%C3%A9')).toEqual({ kind: 'fragment', slug: 'café' });
    });

    it('sorts web, relative and blocked links', () => {
        expect(classifyLink('https://github.com')).toEqual({ kind: 'external' });
        expect(classifyLink('mailto:a@b.c')).toEqual({ kind: 'external' });
        expect(classifyLink('docs/guide.md')).toEqual({ kind: 'relative' });
        expect(classifyLink('javascript:alert(1)')).toEqual({ kind: 'blocked' });
        expect(classifyLink('command:workbench.action.terminal.new')).toEqual({ kind: 'blocked' });
        expect(classifyLink('')).toEqual({ kind: 'blocked' });
    });
});

describe('github heading slugs', () => {
    it('matches github-slugger', () => {
        expect(githubSlug('Hello World!')).toBe('hello-world');
        expect(githubSlug('Features (v0.1)')).toBe('features-v01');
        expect(githubSlug('CI/CD')).toBe('cicd');
        expect(githubSlug('snake_case & more')).toBe('snake_case--more');
        expect(githubSlug('Über café')).toBe('über-café');
    });

    it('de-duplicates repeated headings', () => {
        expect(headingSlugs(['Usage', 'Usage', 'Usage-1', 'Usage'])).toEqual(['usage', 'usage-1', 'usage-1-1', 'usage-2']);
    });

    it('finds the heading element ignoring hidden source markers', () => {
        const root = document.createElement('div');
        root.innerHTML = '<h1 class="md-heading"><span class="md-marker">#&nbsp;</span>Intro</h1>'
            + '<h2 class="md-heading"><span class="md-marker">## </span>Getting <strong>Started</strong></h2>';

        expect(findHeadingBySlug(root, 'getting-started')?.localName).toBe('h2');
        expect(findHeadingBySlug(root, 'missing')).toBeUndefined();
    });
});
