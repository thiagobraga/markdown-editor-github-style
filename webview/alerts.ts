/**
 * GitHub alerts: a blockquote whose first line is `[!NOTE]`, `[!TIP]`,
 * `[!IMPORTANT]`, `[!WARNING]` or `[!CAUTION]` renders as a colored callout
 * with an icon + title row instead of the literal marker.
 */

export type AlertKind = 'note' | 'tip' | 'important' | 'warning' | 'caution';

const MARKER = /^\s*\[!(note|tip|important|warning|caution)\][ \t]*(?:\r?\n|$)/i;

/** The alert a blockquote's first paragraph declares, if its text opens with a marker. */
export function alertKind(firstParagraphText: string): AlertKind | undefined {
    return MARKER.exec(firstParagraphText)?.[1]?.toLowerCase() as AlertKind | undefined;
}

const TITLES: Readonly<Record<AlertKind, string>> = {
    note: 'Note',
    tip: 'Tip',
    important: 'Important',
    warning: 'Warning',
    caution: 'Caution',
};

/** Replaces the leading `[!KIND]` line of a serialized paragraph with the alert's title row. */
export function renderAlertParagraph(kind: AlertKind, paragraphHtml: string): string {
    const body = paragraphHtml.replace(/^\s*\[![a-z]+\][ \t]*(?:\r?\n)?/i, '');
    const title = `<span class="gh-alert-title gh-alert-title-${kind}">${TITLES[kind]}</span>`;
    return body.trim() === '' ? title : `${title}${body}`;
}
