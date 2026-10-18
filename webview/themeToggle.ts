/**
 * Extra buttons next to the engine's edit/read-only toggle: one cycles the
 * color theme (auto → light → dark), the other opens the markdown source.
 */

import type { ThemePreference } from './theme';

const ICONS: Readonly<Record<ThemePreference, string>> = {
    // Half-filled circle.
    auto: '<path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 1.5v11a5.5 5.5 0 0 1 0-11Z"/>',
    // Octicons "sun".
    light: '<path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-1.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM8 0a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V.75A.75.75 0 0 1 8 0Zm0 13a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 8 13ZM2.343 2.343a.75.75 0 0 1 1.061 0l1.06 1.061a.751.751 0 0 1-1.06 1.06l-1.061-1.06a.75.75 0 0 1 0-1.061Zm9.193 9.193a.75.75 0 0 1 1.06 0l1.061 1.06a.75.75 0 0 1-1.06 1.061l-1.061-1.06a.75.75 0 0 1 0-1.061ZM16 8a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 16 8ZM3 8a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 3 8Zm10.657-5.657a.75.75 0 0 1 0 1.061l-1.061 1.06a.751.751 0 0 1-1.06-1.06l1.06-1.061a.75.75 0 0 1 1.061 0Zm-9.193 9.193a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 0 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0Z"/>',
    // Octicons "moon".
    dark: '<path d="M9.598 1.591a.749.749 0 0 1 .785-.175 7.001 7.001 0 1 1-8.967 8.967.75.75 0 0 1 .961-.96 5.5 5.5 0 0 0 7.046-7.046.75.75 0 0 1 .175-.786Zm1.616 1.945a7 7 0 0 1-7.678 7.678 5.499 5.499 0 1 0 7.678-7.678Z"/>',
};

const LABELS: Readonly<Record<ThemePreference, string>> = {
    auto: 'Theme: follow VS Code (click for light)',
    light: 'Theme: light (click for dark)',
    dark: 'Theme: dark (click for VS Code theme)',
};

const HOST_SELECTOR = '.md-readonly-toggle-host';

/**
 * Keeps `button` inside the engine's sticky toggle host, so it tracks the
 * edit/read-only pill exactly (same overlay, same inset). The engine may
 * re-create the host, so the button is re-attached when it goes missing.
 */
function mountInHost(root: HTMLElement, button: HTMLButtonElement): void {
    let scheduled = false;
    const attach = (): void => {
        scheduled = false;
        const host = root.querySelector(HOST_SELECTOR);
        if (host && button.parentElement !== host) {
            host.appendChild(button);
        }
    };
    attach();
    new MutationObserver(() => {
        if (!scheduled && button.parentElement?.isConnected !== true) {
            scheduled = true;
            requestAnimationFrame(attach);
        }
    }).observe(root, { childList: true, subtree: true });
}

export function createThemeToggle(
    root: HTMLElement,
    initial: ThemePreference,
    onCycle: () => ThemePreference,
): { readonly element: HTMLButtonElement; update(preference: ThemePreference): void } {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gh-theme-toggle';

    const update = (preference: ThemePreference): void => {
        button.innerHTML = `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">${ICONS[preference]}</svg>`;
        button.title = LABELS[preference];
        button.setAttribute('aria-label', LABELS[preference]);
    };
    update(initial);
    button.addEventListener('click', () => update(onCycle()));

    mountInHost(root, button);
    return { element: button, update };
}

/** Octicons "code" (`<>`). */
const CODE_ICON = '<path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"/>';

export function createSourceButton(root: HTMLElement, onClick: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'gh-theme-toggle gh-source-button';
    button.innerHTML = `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">${CODE_ICON}</svg>`;
    button.title = 'View source (open the markdown file beside)';
    button.setAttribute('aria-label', button.title);
    button.addEventListener('click', onClick);
    mountInHost(root, button);
    return button;
}
