import { beforeEach, describe, expect, it } from 'vitest';
import type { CancellationToken, TextDocument, Uri as VscodeUri } from 'vscode';
import { GithubStyleMarkdownEditorProvider } from '../../src/webviewEditorProvider';
import { Uri, createDocument, env, resetMock } from './mocks/vscode';
import type { FakeTextDocument } from './mocks/vscode';
import { createStubPanel } from './support/stubPanel';

const EXTENSION_URI = Uri.parse('file:///extension') as unknown as VscodeUri;
const TOKEN = {} as CancellationToken;

function resolveProvider(document: FakeTextDocument) {
    const stub = createStubPanel();
    const provider = new GithubStyleMarkdownEditorProvider(EXTENSION_URI);
    provider.resolveCustomTextEditor(document as unknown as TextDocument, stub.panel, TOKEN);
    return stub;
}

/** Lets promise callbacks queued by the provider (applyEdit, postMessage) run. */
const flush = (): Promise<void> => new Promise(resolve => setImmediate(resolve));

beforeEach(() => {
    resetMock();
});

describe('webview html', () => {
    it('serves a CSP whose nonce matches the script tag', () => {
        const document = createDocument('file:///notes.md', '# Title');
        const { webview } = resolveProvider(document);

        const cspNonce = /script-src 'nonce-([a-z0-9]+)'/.exec(webview.html)?.[1];
        const tagNonce = /<script nonce="([a-z0-9]+)"/.exec(webview.html)?.[1];
        expect(cspNonce).toBeDefined();
        expect(tagNonce).toBe(cspNonce);
        expect(webview.html).toContain("default-src 'none'");
    });

    it('embeds the initial document state and the built asset uris', () => {
        const document = createDocument('file:///notes.md', '# Title');
        const { webview } = resolveProvider(document);

        const encoded = /<meta name="github-style-markdown-editor-initial-state" content="([^"]+)">/.exec(webview.html)?.[1];
        expect(encoded).toBeDefined();
        const initial = JSON.parse(decodeURIComponent(encoded!)) as {
            content: string;
            documentVersion: number;
            themeKind: string;
        };
        expect(initial.content).toBe('# Title');
        expect(initial.documentVersion).toBe(document.version);
        expect(initial.themeKind).toBe('light');
        expect(webview.html).toContain('file:///extension/media/main.js');
        expect(webview.html).toContain('file:///extension/media/main.css');
    });
});

describe('edits from the webview', () => {
    it('applies a text diff to the document through a workspace edit', async () => {
        const document = createDocument('file:///notes.md', 'Title');
        const { send } = resolveProvider(document);

        send({ type: 'edit', start: 0, endExclusive: 0, text: '# ' });
        await flush();

        expect(document.getText()).toBe('# Title');
    });

    it('clamps edit offsets to the document length', async () => {
        const document = createDocument('file:///notes.md', 'Title');
        const { send } = resolveProvider(document);

        send({ type: 'edit', start: 999, endExclusive: 9999, text: '!' });
        await flush();

        expect(document.getText()).toBe('Title!');
    });

    it('undoes the most recent edit and echoes the restored content', async () => {
        const document = createDocument('file:///notes.md', 'Title');
        const { messages, send } = resolveProvider(document);

        send({ type: 'edit', start: 0, endExclusive: 0, text: '# ' });
        await flush();
        send({ type: 'undo' });
        await flush();

        expect(document.getText()).toBe('Title');
        expect(messages).toContainEqual({ type: 'content', content: 'Title' });
    });
});

describe('external document changes', () => {
    it('pushes the new content to the webview and resets the undo history', async () => {
        const document = createDocument('file:///notes.md', 'Title');
        const { messages, send } = resolveProvider(document);

        document.setTextExternally('changed on disk');

        expect(messages).toContainEqual({ type: 'content', content: 'changed on disk' });

        send({ type: 'undo' });
        await flush();
        expect(document.getText()).toBe('changed on disk');
    });

    it('ignores changes to other documents', () => {
        const document = createDocument('file:///notes.md', 'Title');
        const other = createDocument('file:///other.md', 'Other');
        const { messages } = resolveProvider(document);

        other.setTextExternally('nope');

        expect(messages).toHaveLength(0);
    });
});

describe('link handling', () => {
    it('opens http and https links externally', () => {
        const document = createDocument('file:///notes.md', '# Title');
        const { send } = resolveProvider(document);

        send({ type: 'openLink', href: 'https://github.com' });
        send({ type: 'openLink', href: 'http://example.com' });

        expect(env.openedUris).toEqual(['https://github.com', 'http://example.com']);
    });

    it('refuses non-web schemes', () => {
        const document = createDocument('file:///notes.md', '# Title');
        const { send } = resolveProvider(document);

        send({ type: 'openLink', href: 'javascript:alert(1)' });
        send({ type: 'openLink', href: 'file:///etc/passwd' });
        send({ type: 'openLink', href: 'command:workbench.action.terminal.new' });

        expect(env.openedUris).toEqual([]);
    });
});
