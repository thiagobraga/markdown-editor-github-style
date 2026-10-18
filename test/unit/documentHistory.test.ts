import { describe, expect, it } from 'vitest';
import { COALESCE_MS, MAX_HISTORY, DocumentHistory } from '../../src/documentHistory';

describe('DocumentHistory', () => {
    it('has nothing to undo or redo when fresh', () => {
        const history = new DocumentHistory('A');
        expect(history.undo()).toBeUndefined();
        expect(history.redo()).toBeUndefined();
    });

    it('walks back and forward through recorded states', () => {
        const history = new DocumentHistory('A');
        history.record('B', 10_000);
        history.record('C', 20_000);

        expect(history.undo()).toBe('B');
        expect(history.undo()).toBe('A');
        expect(history.undo()).toBeUndefined();

        expect(history.redo()).toBe('B');
        expect(history.redo()).toBe('C');
        expect(history.redo()).toBeUndefined();
    });

    it('coalesces rapid edits into a single undo step', () => {
        const history = new DocumentHistory('A');
        history.record('B', 10_000);
        history.record('C', 10_100);
        history.record('D', 10_200);

        // The whole burst collapses: one undo reaches the state before it,
        // and redo replays the burst's final state.
        expect(history.undo()).toBe('A');
        expect(history.redo()).toBe('D');
    });

    it('starts a new step once the coalescing window has passed', () => {
        const history = new DocumentHistory('A');
        history.record('B', 10_000);
        history.record('C', 10_000 + COALESCE_MS);

        expect(history.undo()).toBe('B');
        expect(history.redo()).toBe('C');
    });

    it('never coalesces into the seed state', () => {
        const history = new DocumentHistory('A');
        history.record('B', 10_000);
        expect(history.undo()).toBe('A');

        // Right after an undo to the bottom, a rapid edit must still be a
        // distinct step instead of overwriting the seed state.
        history.record('C', 10_050);
        expect(history.undo()).toBe('A');
        expect(history.redo()).toBe('C');
    });

    it('drops the redo branch when edits arrive after an undo', () => {
        const history = new DocumentHistory('A');
        history.record('B', 10_000);
        history.record('C', 20_000);
        expect(history.undo()).toBe('B');

        // Rapid continuation after the undo: collapse must not leave the
        // stale 'C' reachable through redo.
        history.record('D', 20_050);
        expect(history.redo()).toBeUndefined();
        expect(history.undo()).toBe('A');
        expect(history.redo()).toBe('D');
    });

    it('caps the history at MAX_HISTORY states', () => {
        const history = new DocumentHistory('S0');
        for (let i = 1; i <= MAX_HISTORY + 50; i++) {
            history.record(`S${i}`, i * 10_000);
        }

        let undoSteps = 0;
        while (history.undo() !== undefined) {
            undoSteps++;
        }
        expect(undoSteps).toBe(MAX_HISTORY - 1);

        let redoSteps = 0;
        while (history.redo() !== undefined) {
            redoSteps++;
        }
        expect(redoSteps).toBe(MAX_HISTORY - 1);
    });
});
