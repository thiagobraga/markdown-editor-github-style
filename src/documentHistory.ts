/**
 * Whole-document undo/redo history for one custom editor document.
 *
 * States are recorded *after* each applied edit (see
 * `GithubStyleMarkdownEditorProvider.#applyDocumentEdit`), so `undo()` returns
 * the state to restore and `redo()` can walk back through the same states.
 * Rapid edits are coalesced into a single history entry.
 */

export const MAX_HISTORY = 250;
export const COALESCE_MS = 750;

export class DocumentHistory {
    #entries: string[] = [];
    #index = -1;
    #lastRecordedAt = 0;

    constructor(text: string) {
        this.reset(text);
    }

    /** Restarts the history from the given state (e.g. after an external change). */
    reset(text: string): void {
        this.#entries = [text];
        this.#index = 0;
        this.#lastRecordedAt = 0;
    }

    /** Records the state the document settled on after an applied edit. */
    record(text: string, now: number = Date.now()): void {
        if (now - this.#lastRecordedAt < COALESCE_MS && this.#index > 0) {
            // Coalesce a burst of edits into the newest entry instead of adding
            // one; anything that was redoable is now unreachable, so drop it.
            this.#entries.length = this.#index + 1;
            this.#entries[this.#index] = text;
            this.#lastRecordedAt = now;
            return;
        }
        this.#entries = this.#entries.slice(0, this.#index + 1);
        this.#entries.push(text);
        if (this.#entries.length > MAX_HISTORY) {
            this.#entries.shift();
        }
        this.#index = this.#entries.length - 1;
        this.#lastRecordedAt = now;
    }

    /** Returns the state to restore, or undefined when there is nothing to undo. */
    undo(): string | undefined {
        if (this.#index <= 0) {
            return undefined;
        }
        this.#index--;
        return this.#entries[this.#index];
    }

    /** Returns the state to restore, or undefined when there is nothing to redo. */
    redo(): string | undefined {
        if (this.#index >= this.#entries.length - 1) {
            return undefined;
        }
        this.#index++;
        return this.#entries[this.#index];
    }
}
