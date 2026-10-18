/**
 * Computes the minimal text edit (common-prefix / common-suffix trim) that
 * turns `previousText` into `text`. Used by the webview to describe local edits
 * as `{ start, endExclusive, text }` messages to the extension host, and
 * covered by test/unit/computeTextEdit.test.ts.
 */
export function computeTextEdit(previousText: string, text: string): { start: number; endExclusive: number; text: string } | undefined {
    if (previousText === text) {
        return undefined;
    }
    let start = 0;
    while (start < previousText.length && start < text.length && previousText.charCodeAt(start) === text.charCodeAt(start)) {
        start++;
    }
    let previousEnd = previousText.length;
    let end = text.length;
    while (previousEnd > start && end > start && previousText.charCodeAt(previousEnd - 1) === text.charCodeAt(end - 1)) {
        previousEnd--;
        end--;
    }
    return {
        start,
        endExclusive: previousEnd,
        text: text.slice(start, end),
    };
}
