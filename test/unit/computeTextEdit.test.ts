import { describe, expect, it } from 'vitest';
import { computeTextEdit } from '../../webview/computeTextEdit';

describe('computeTextEdit', () => {
    it('returns undefined when nothing changed', () => {
        expect(computeTextEdit('same', 'same')).toBeUndefined();
    });

    it('describes an insertion at the start', () => {
        expect(computeTextEdit('Title', '# Title')).toEqual({ start: 0, endExclusive: 0, text: '# ' });
    });

    it('describes an insertion at the end', () => {
        expect(computeTextEdit('Title', 'Title!')).toEqual({ start: 5, endExclusive: 5, text: '!' });
    });

    it('describes a deletion in the middle', () => {
        expect(computeTextEdit('Title', 'Tle')).toEqual({ start: 1, endExclusive: 3, text: '' });
    });

    it('describes a replacement in the middle', () => {
        expect(computeTextEdit('hello world', 'hello there')).toEqual({ start: 6, endExclusive: 11, text: 'there' });
    });

    it('describes a wholesale replacement', () => {
        expect(computeTextEdit('abc', 'xyz')).toEqual({ start: 0, endExclusive: 3, text: 'xyz' });
    });

    it('describes clearing and filling the document', () => {
        expect(computeTextEdit('', 'content')).toEqual({ start: 0, endExclusive: 0, text: 'content' });
        expect(computeTextEdit('content', '')).toEqual({ start: 0, endExclusive: 7, text: '' });
    });

    it('round-trips: applying the edit to the previous text yields the new text', () => {
        const cases: Array<[string, string]> = [
            ['Title', '# Title'],
            ['Title', 'Title!'],
            ['Title', 'Tle'],
            ['hello world', 'hello there'],
            ['abc', 'xyz'],
            ['', 'content'],
            ['content', ''],
            ['line one\nline two', 'line one\nline 2\nline three'],
        ];
        for (const [previous, next] of cases) {
            const edit = computeTextEdit(previous, next);
            expect(edit, `${JSON.stringify(previous)} -> ${JSON.stringify(next)}`).toBeDefined();
            const applied = previous.slice(0, edit!.start) + edit!.text + previous.slice(edit!.endExclusive);
            expect(applied).toBe(next);
        }
    });
});
