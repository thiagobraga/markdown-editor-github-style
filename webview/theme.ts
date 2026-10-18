/**
 * Color theme of the editor.
 *
 * The user picks `auto` (follow the VS Code workbench), `light` or `dark`. For
 * `auto`, VS Code stamps the theme kind on `<body>` (`vscode-light`,
 * `vscode-dark`, `vscode-high-contrast`, `vscode-high-contrast-light`). The
 * effective theme is mirrored onto `<html>` as `data-gh-theme`, which
 * `github-dark.css` keys off, and handed to the raw HTML renderer so a
 * README's `<picture>` picks the matching source.
 */

export type Theme = 'light' | 'dark';
export type ThemePreference = 'auto' | Theme;

export const THEME_PREFERENCES: readonly ThemePreference[] = ['auto', 'light', 'dark'];

export function isThemePreference(value: unknown): value is ThemePreference {
    return THEME_PREFERENCES.includes(value as ThemePreference);
}

export function themeOf(classes: DOMTokenList): Theme {
    if (classes.contains('vscode-dark')) {
        return 'dark';
    }
    return classes.contains('vscode-high-contrast') && !classes.contains('vscode-high-contrast-light') ? 'dark' : 'light';
}

export class ThemeController {
    #preference: ThemePreference;
    #theme: Theme;

    /** Applies the initial theme; `onChange` fires whenever the effective theme changes. */
    constructor(preference: ThemePreference, private readonly onChange: (theme: Theme) => void) {
        this.#preference = preference;
        this.#theme = this.#resolve();
        this.#apply();
        new MutationObserver(() => this.#update()).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    get theme(): Theme {
        return this.#theme;
    }

    get preference(): ThemePreference {
        return this.#preference;
    }

    setPreference(preference: ThemePreference): void {
        this.#preference = preference;
        this.#update();
    }

    /** The next preference in the auto → light → dark cycle. */
    nextPreference(): ThemePreference {
        return THEME_PREFERENCES[(THEME_PREFERENCES.indexOf(this.#preference) + 1) % THEME_PREFERENCES.length]!;
    }

    #resolve(): Theme {
        return this.#preference === 'auto' ? themeOf(document.body.classList) : this.#preference;
    }

    #apply(): void {
        document.documentElement.dataset.ghTheme = this.#theme;
    }

    #update(): void {
        const next = this.#resolve();
        if (next !== this.#theme) {
            this.#theme = next;
            this.#apply();
            this.onChange(next);
        }
    }
}
