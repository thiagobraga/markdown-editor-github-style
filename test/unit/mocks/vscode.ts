/**
 * Minimal in-memory stand-in for the `vscode` module, aliased in by
 * vitest.config.ts so `src/webviewEditorProvider.ts` can be unit tested
 * without an editor host. Only the surface that file uses is implemented;
 * documents and outbound calls are recorded so tests can assert on them.
 */

export class Position {
    constructor(public readonly offset: number) {}
}

export class Range {
    constructor(
        public readonly start: Position,
        public readonly end: Position,
    ) {}
}

export class Uri {
    readonly #value: string;

    constructor(value: string) {
        this.#value = value;
    }

    static parse(value: string): Uri {
        return new Uri(value);
    }

    static joinPath(base: Uri, ...parts: string[]): Uri {
        return new Uri([base.toString().replace(/\/+$/, ''), ...parts].join('/'));
    }

    toString(): string {
        return this.#value;
    }
}

export interface RecordedEdit {
    readonly uri: string;
    readonly start: number;
    readonly endExclusive: number;
    readonly text: string;
}

export class WorkspaceEdit {
    readonly edits: RecordedEdit[] = [];

    replace(uri: Uri, range: Range, text: string): void {
        this.edits.push({
            uri: uri.toString(),
            start: range.start.offset,
            endExclusive: range.end.offset,
            text,
        });
    }
}

type ChangeListener = (event: { document: FakeTextDocument }) => void;

const changeListeners: ChangeListener[] = [];
export const documents = new Map<string, FakeTextDocument>();

export class FakeTextDocument {
    #text: string;
    #version = 1;
    readonly uri: Uri;

    constructor(uri: Uri, text: string) {
        this.uri = uri;
        this.#text = text;
    }

    get version(): number {
        return this.#version;
    }

    getText(): string {
        return this.#text;
    }

    positionAt(offset: number): Position {
        return new Position(offset);
    }

    /** Simulates an edit that did not come from the provider (disk, other editor). */
    setTextExternally(text: string): void {
        this.#text = text;
        this.#version++;
        for (const listener of changeListeners) {
            listener({ document: this });
        }
    }

    /** Applied by the mocked `workspace.applyEdit`; does not notify listeners itself. */
    applyLocalEdit(start: number, endExclusive: number, text: string): void {
        this.#text = this.#text.slice(0, start) + text + this.#text.slice(endExclusive);
        this.#version++;
    }
}

export function createDocument(path: string, text: string): FakeTextDocument {
    const document = new FakeTextDocument(Uri.parse(path), text);
    documents.set(document.uri.toString(), document);
    return document;
}

export const workspace = {
    onDidChangeTextDocument(listener: ChangeListener): { dispose(): void } {
        changeListeners.push(listener);
        return {
            dispose(): void {
                const index = changeListeners.indexOf(listener);
                if (index >= 0) {
                    changeListeners.splice(index, 1);
                }
            },
        };
    },

    async applyEdit(edit: WorkspaceEdit): Promise<boolean> {
        for (const recorded of edit.edits) {
            const document = documents.get(recorded.uri);
            if (!document) {
                return false;
            }
            document.applyLocalEdit(recorded.start, recorded.endExclusive, recorded.text);
            for (const listener of [...changeListeners]) {
                listener({ document });
            }
        }
        return true;
    },
};

export const env = {
    openedUris: [] as string[],

    openExternal(uri: Uri): Promise<boolean> {
        env.openedUris.push(uri.toString());
        return Promise.resolve(true);
    },
};

/** Clears all recorded state; call from `beforeEach`. */
export function resetMock(): void {
    documents.clear();
    changeListeners.length = 0;
    env.openedUris.length = 0;
}
