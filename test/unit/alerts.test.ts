import { describe, expect, it } from 'vitest';
import { alertKind, renderAlertParagraph } from '../../webview/alerts';

describe('alertKind', () => {
    it.each([
        ['[!NOTE]\nUseful.', 'note'],
        ['[!tip]', 'tip'],
        ['  [!IMPORTANT]  \nx', 'important'],
        ['[!WARNING]\r\nx', 'warning'],
        ['[!CAUTION]', 'caution'],
    ])('%j is a %s alert', (text, kind) => {
        expect(alertKind(text)).toBe(kind);
    });

    it.each([
        'Plain quote',
        '[!NOTE] trailing text on the marker line',
        '[!DANGER]\nunknown kind',
        'text\n[!NOTE]',
    ])('%j is not an alert', text => {
        expect(alertKind(text)).toBeUndefined();
    });
});

describe('renderAlertParagraph', () => {
    it('replaces the marker line with the title row', () => {
        expect(renderAlertParagraph('warning', '[!WARNING]\nBe <strong>careful</strong>.'))
            .toBe('<span class="gh-alert-title gh-alert-title-warning">Warning</span>Be <strong>careful</strong>.');
    });

    it('renders just the title when the body is in later paragraphs', () => {
        expect(renderAlertParagraph('note', '[!NOTE]\n')).toBe('<span class="gh-alert-title gh-alert-title-note">Note</span>');
    });
});
