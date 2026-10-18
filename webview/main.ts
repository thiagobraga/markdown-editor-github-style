/**
 * Markdown Editor Github Style — webview bootstrap.
 *
 * Builds the same editor component VS Code's built-in markdown editor uses
 * (`@vscode/markdown-editor`), but mounts it with the package's own
 * `github-markdown-theme` instead of the VS Code default theme.
 *
 * Protocol (extension host <-> webview):
 *   host -> webview: { type: 'content', content, documentVersion }
 *   webview -> host:
 *     { type: 'edit', start, endExclusive, text }
 *     { type: 'undo' } / { type: 'redo' }
 *     { type: 'openLink', href }
 */

import {
    EditorController,
    EditorModel,
    EditorView,
    Selection,
    StringValue,
} from '@vscode/markdown-editor';
import { autorun } from '@vscode/markdown-editor/observables';
import 'katex/dist/katex.min.css';
import '@vscode/markdown-editor/editor.css';
import '@vscode/markdown-editor/themes/github.css';
/* Pins the package theme to the markdown styles github.com ships today. */
import './github-light.css';
import './canvas.css';
import { computeTextEdit } from './computeTextEdit';

interface VsCodeApi {
    postMessage(message: unknown): void;
    getState(): unknown;
    setState(state: unknown): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

interface InitialState {
    readonly content: string;
    readonly documentVersion: number;
}

interface PersistedViewState {
    scrollTop?: number;
}

function readInitialState(): InitialState {
    const element = document.querySelector<HTMLMetaElement>('meta[name="github-style-markdown-editor-initial-state"]');
    if (!element) {
        throw new Error('Markdown editor initial state was not found.');
    }
    element.remove();
    const value: unknown = JSON.parse(decodeURIComponent(element.content));
    const candidate = value as Partial<InitialState>;
    if (typeof candidate?.content !== 'string') {
        throw new Error('Markdown editor initial state is invalid.');
    }
    return { content: candidate.content, documentVersion: candidate.documentVersion ?? 0 };
}

class GithubStyleEditor {
    readonly model = new EditorModel();
    #isUpdatingFromHost = false;
    #previousText: string;

    constructor(host: HTMLElement, initial: InitialState) {
        const vscode = acquireVsCodeApi();

        this.#previousText = initial.content;
        this.model.sourceText.set(new StringValue(initial.content), undefined);

        const view = new EditorView(this.model, {
            classNames: ['github-markdown-theme'],
            onOpenLink: (url: string) => {
                vscode.postMessage({ type: 'openLink', href: url });
            },
        });
        new EditorController(this.model, view);

        host.appendChild(view.element);

        // Place the caret at the end so typing works immediately after opening.
        this.#setCaretToEnd(initial.content);

        // --- host -> webview -------------------------------------------------
        window.addEventListener('message', (event: MessageEvent) => {
            const message = event.data as { type?: string; content?: unknown };
            if (message?.type !== 'content' || typeof message.content !== 'string') {
                return;
            }
            this.#isUpdatingFromHost = true;
            try {
                this.model.sourceText.set(new StringValue(message.content), undefined);
                this.#setCaretToEnd(message.content);
            } finally {
                this.#isUpdatingFromHost = false;
            }
            this.#previousText = message.content;
        });

        // --- webview -> host -------------------------------------------------
        autorun(reader => {
            const text = reader.readObservable(this.model.sourceText).value;
            if (this.#isUpdatingFromHost) {
                return;
            }
            const edit = computeTextEdit(this.#previousText, text);
            if (edit) {
                vscode.postMessage({ type: 'edit', ...edit });
            }
            this.#previousText = text;
        });

        // Keyboard chords for undo/redo (the DOM editor does not own the file's
        // undo stack; the provider keeps a snapshot history instead).
        window.addEventListener('keydown', event => {
            const hasMeta = event.ctrlKey || event.metaKey;
            if (!hasMeta || event.key !== 'z') {
                return;
            }
            event.preventDefault();
            vscode.postMessage({ type: event.shiftKey ? 'redo' : 'undo' });
        });

        // Persist scroll position across webview reloads.
        const saved = (vscode.getState() as PersistedViewState | undefined) ?? {};
        if (typeof saved.scrollTop === 'number' && saved.scrollTop > 0) {
            requestAnimationFrame(() => {
                host.scrollTop = saved.scrollTop!;
            });
        }
        let scrollSaveScheduled = false;
        const saveScroll = (): void => {
            if (scrollSaveScheduled) {
                return;
            }
            scrollSaveScheduled = true;
            requestAnimationFrame(() => {
                scrollSaveScheduled = false;
                vscode.setState({ scrollTop: host.scrollTop } satisfies PersistedViewState);
            });
        };
        host.addEventListener('scroll', saveScroll, { passive: true });
        window.addEventListener('pagehide', () => {
            // Flush synchronously; a frame-throttled save may not have run yet.
            vscode.setState({ scrollTop: host.scrollTop } satisfies PersistedViewState);
        });
    }

    #setCaretToEnd(content: string): void {
        this.model.selection.set(new Selection(content.length, content.length), undefined);
    }
}

new GithubStyleEditor(document.getElementById('editor')!, readInitialState());
