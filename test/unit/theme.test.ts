// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { themeOf } from '../../webview/theme';

function classes(...names: string[]): DOMTokenList {
    const element = document.createElement('body');
    element.classList.add(...names);
    return element.classList;
}

describe('themeOf', () => {
    it('maps VS Code theme kinds', () => {
        expect(themeOf(classes('vscode-light'))).toBe('light');
        expect(themeOf(classes('vscode-dark'))).toBe('dark');
        expect(themeOf(classes('vscode-high-contrast'))).toBe('dark');
        expect(themeOf(classes('vscode-high-contrast', 'vscode-high-contrast-light'))).toBe('light');
    });

    it('defaults to light', () => {
        expect(themeOf(classes())).toBe('light');
    });
});
