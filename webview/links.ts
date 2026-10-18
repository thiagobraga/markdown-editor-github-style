/**
 * Link activation, GitHub-style: `#fragment` links jump to the heading with
 * that anchor inside the document, web links open externally, and relative
 * paths open the target file in VS Code (resolved by the extension host).
 */

export type LinkTarget =
    | { readonly kind: 'fragment'; readonly slug: string }
    | { readonly kind: 'external' }
    | { readonly kind: 'relative' }
    | { readonly kind: 'blocked' };

export function classifyLink(url: string): LinkTarget {
    const trimmed = url.trim();
    if (trimmed.startsWith('#')) {
        let slug = trimmed.slice(1);
        try {
            slug = decodeURIComponent(slug);
        } catch {
            // Keep the raw fragment when it is not valid percent-encoding.
        }
        // GitHub prefixes rendered anchors with `user-content-`; links may use either form.
        return { kind: 'fragment', slug: slug.replace(/^user-content-/, '').toLowerCase() };
    }
    const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(trimmed)?.[1]?.toLowerCase();
    if (scheme === undefined) {
        return trimmed.length > 0 ? { kind: 'relative' } : { kind: 'blocked' };
    }
    if (scheme === 'http' || scheme === 'https' || scheme === 'mailto') {
        return { kind: 'external' };
    }
    return { kind: 'blocked' };
}

/**
 * GitHub's heading anchor algorithm (github-slugger): lowercase, drop
 * everything but letters, marks, numbers, connector punctuation, `-` and
 * spaces, then turn spaces into dashes.
 */
export function githubSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '')
        .replace(/ /g, '-');
}

/** Anchors for `headings` in document order, de-duplicated like GitHub (`a`, `a-1`, `a-2`). */
export function headingSlugs(headings: readonly string[]): string[] {
    const occurrences = new Map<string, number>();
    return headings.map(text => {
        const original = githubSlug(text.trim());
        let slug = original;
        while (occurrences.has(slug)) {
            const count = (occurrences.get(original) ?? 0) + 1;
            occurrences.set(original, count);
            slug = `${original}-${count}`;
        }
        occurrences.set(slug, 0);
        return slug;
    });
}

/** The heading's visible text, without the (hidden) `#` / setext source markers. */
function headingText(heading: Element): string {
    const clone = heading.cloneNode(true) as Element;
    for (const marker of Array.from(clone.querySelectorAll('.md-marker'))) {
        marker.remove();
    }
    return clone.textContent ?? '';
}

export function findHeadingBySlug(root: ParentNode, slug: string): HTMLElement | undefined {
    const headings = Array.from(root.querySelectorAll<HTMLElement>('.md-heading'));
    const slugs = headingSlugs(headings.map(headingText));
    const index = slugs.indexOf(slug);
    return index < 0 ? undefined : headings[index];
}
