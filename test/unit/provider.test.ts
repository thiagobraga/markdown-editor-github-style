import { beforeEach, describe, expect, it } from 'vitest';
import type { CancellationToken, TextDocument, Uri as VscodeUri } from 'vscode';
import type { Memento } from 'vscode';
import {
    GithubStyleMarkdownEditorProvider,
    builtInMarkdownEditorViewType,
    readonlyStateKey,
    themeStateKey,
} from '../../src/webviewEditorProvider';
import { FakeMemento, TabInputCustom, Uri, commands, createDocument, env, resetMock, window, workspace, ViewColumn } from './mocks/vscode';
import type { FakeTextDocument } from './mocks/vscode';
import { createStubPanel } from './support/stubPanel';

const EXTENSION_URI = Uri.parse('file:///extension') as unknown as VscodeUri;
const TOKEN = {} as CancellationToken;

function resolveOn(
    provider: GithubStyleMarkdownEditorProvider,
    document: FakeTextDocument,
    panelOptions: { viewColumn?: number } = {},
) {
    const stub = createStubPanel(panelOptions);
    provider.resolveCustomTextEditor(document as unknown as TextDocument, stub.panel, TOKEN);
    return stub;
}

function resolveProvider(document: FakeTextDocument) {
    return resolveOn(new GithubStyleMarkdownEditorProvider(EXTENSION_URI), document);
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
            theme: string;
            readonly: boolean;
        };
        expect(initial.content).toBe('# Title');
        expect(initial.documentVersion).toBe(document.version);
        expect(initial.theme).toBe('auto');
        expect(initial.readonly).toBe(false);
        expect(webview.html).toContain('file:///extension/media/main.js');
        expect(webview.html).toContain('file:///extension/media/main.css');
    });
});

function readInitialState(html: string): { readonly: boolean } {
    const encoded = /<meta name="github-style-markdown-editor-initial-state" content="([^"]+)">/.exec(html)![1]!;
    return JSON.parse(decodeURIComponent(encoded)) as { readonly: boolean };
}

describe('document resources', () => {
    it('sets the document as the base url so relative image paths resolve', () => {
        const document = createDocument('file:///repo/docs/notes.md', '![](shot.png)');
        const { webview } = resolveProvider(document);

        expect(webview.html).toContain('<base href="file:///repo/docs/notes.md">');
    });

    it('lets the webview load media from the document', () => {
        const document = createDocument('file:///repo/notes.md', '<video src="demo.mp4"></video>');
        const { webview } = resolveProvider(document);

        expect(webview.html).toMatch(/media-src vscode-resource:\/\/test data: https:/);
    });

    it('allows every workspace folder when the document lives in one', () => {
        workspace.workspaceFolders = [{ uri: Uri.parse('file:///repo') }, { uri: Uri.parse('file:///other') }];
        const document = createDocument('file:///repo/docs/notes.md', '# Title');
        const { webview } = resolveProvider(document);

        const roots = (webview.options as { localResourceRoots: Uri[] }).localResourceRoots.map(root => root.toString());
        expect(roots).toEqual(['file:///extension/media', 'file:///repo', 'file:///other']);
    });

    it("allows the document's own folder outside a workspace", () => {
        const document = createDocument('file:///tmp/scratch/notes.md', '# Title');
        const { webview } = resolveProvider(document);

        const roots = (webview.options as { localResourceRoots: Uri[] }).localResourceRoots.map(root => root.toString());
        expect(roots).toEqual(['file:///extension/media', 'file:///tmp/scratch']);
    });

    it('allows no document resources in an untrusted workspace', () => {
        workspace.isTrusted = false;
        workspace.workspaceFolders = [{ uri: Uri.parse('file:///repo') }];
        const document = createDocument('file:///repo/notes.md', '# Title');
        const { webview } = resolveProvider(document);

        const roots = (webview.options as { localResourceRoots: Uri[] }).localResourceRoots.map(root => root.toString());
        expect(roots).toEqual(['file:///extension/media']);
    });
});

describe('edit / read-only mode', () => {
    it('opens in edit mode by default', () => {
        const document = createDocument('file:///notes.md', '# Title');
        const provider = new GithubStyleMarkdownEditorProvider(EXTENSION_URI, false, new FakeMemento() as unknown as Memento);

        expect(readInitialState(resolveOn(provider, document).webview.html).readonly).toBe(false);
    });

    it('remembers the toggled mode for the next editor', async () => {
        const memento = new FakeMemento();
        const provider = new GithubStyleMarkdownEditorProvider(EXTENSION_URI, false, memento as unknown as Memento);
        const first = resolveOn(provider, createDocument('file:///a.md', 'a'));

        first.send({ type: 'setReadonly', readonly: true });
        await flush();

        expect(memento.get(readonlyStateKey)).toBe(true);
        expect(readInitialState(resolveOn(provider, createDocument('file:///b.md', 'b')).webview.html).readonly).toBe(true);

        first.send({ type: 'setReadonly', readonly: false });
        await flush();

        expect(readInitialState(resolveOn(provider, createDocument('file:///c.md', 'c')).webview.html).readonly).toBe(false);
    });
});

describe('theme preference', () => {
    it('defaults to auto and remembers the chosen theme', async () => {
        const memento = new FakeMemento();
        const provider = new GithubStyleMarkdownEditorProvider(EXTENSION_URI, false, memento as unknown as Memento);
        const first = resolveOn(provider, createDocument('file:///a.md', 'a'));
        expect((readInitialState(first.webview.html) as { theme?: string }).theme).toBe('auto');

        first.send({ type: 'setTheme', theme: 'dark' });
        first.send({ type: 'setTheme', theme: 'neon' });
        await flush();

        expect(memento.get(themeStateKey)).toBe('dark');
        expect((readInitialState(resolveOn(provider, createDocument('file:///b.md', 'b')).webview.html) as { theme?: string }).theme).toBe('dark');
    });
});

describe('view source', () => {
    it('opens the document in the plain text editor beside', async () => {
        const provider = new GithubStyleMarkdownEditorProvider(EXTENSION_URI, false, new FakeMemento() as unknown as Memento);
        const panel = resolveOn(provider, createDocument('file:///repo/README.md', '# T'));
        commands.recorded.length = 0;

        panel.send({ type: 'openSource' });
        await flush();

        expect(commands.recorded).toEqual([{
            command: 'vscode.openWith',
            args: [expect.objectContaining({}), 'default', { viewColumn: ViewColumn.Beside, preview: false }],
        }]);
        expect(String(commands.recorded[0]!.args[0])).toBe('file:///repo/README.md');
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

    it('redoes the edit after an undo', async () => {
        const document = createDocument('file:///notes.md', 'Title');
        const { messages, send } = resolveProvider(document);

        send({ type: 'edit', start: 0, endExclusive: 0, text: '# ' });
        await flush();
        send({ type: 'undo' });
        await flush();
        send({ type: 'redo' });
        await flush();

        expect(document.getText()).toBe('# Title');
        expect(messages).toContainEqual({ type: 'content', content: '# Title' });
    });

    it('coalesces rapid edits into a single undo step', async () => {
        const document = createDocument('file:///notes.md', 'Title');
        const { send } = resolveProvider(document);

        send({ type: 'edit', start: 0, endExclusive: 0, text: '# ' });
        await flush();
        send({ type: 'edit', start: 7, endExclusive: 7, text: '!' });
        await flush();

        send({ type: 'undo' });
        await flush();
        expect(document.getText()).toBe('Title');

        send({ type: 'redo' });
        await flush();
        expect(document.getText()).toBe('# Title!');
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

describe('multiple editors', () => {
    it('keeps a separate history per document', async () => {
        const first = createDocument('file:///one.md', 'One');
        const second = createDocument('file:///two.md', 'Two');
        const provider = new GithubStyleMarkdownEditorProvider(EXTENSION_URI);
        const firstStub = resolveOn(provider, first);
        const secondStub = resolveOn(provider, second);

        firstStub.send({ type: 'edit', start: 3, endExclusive: 3, text: '!' });
        secondStub.send({ type: 'edit', start: 3, endExclusive: 3, text: '?' });
        await flush();
        expect(first.getText()).toBe('One!');
        expect(second.getText()).toBe('Two?');

        firstStub.send({ type: 'undo' });
        secondStub.send({ type: 'undo' });
        await flush();
        expect(first.getText()).toBe('One');
        expect(second.getText()).toBe('Two');
    });
});

describe('debug side-by-side comparison', () => {
    it('stays off by default, so production and test runs never get the extra pane', () => {
        const document = createDocument('file:///notes.md', '# Title');
        resolveProvider(document);

        expect(commands.recorded).toEqual([]);
    });

    it('opens the built-in markdown editor in the column beside the panel when enabled', () => {
        const document = createDocument('file:///notes.md', '# Title');
        const provider = new GithubStyleMarkdownEditorProvider(EXTENSION_URI, true);
        resolveOn(provider, document, { viewColumn: 1 });

        expect(commands.recorded).toEqual([{
            command: 'vscode.openWith',
            args: [
                document.uri,
                builtInMarkdownEditorViewType,
                { viewColumn: 2, preserveFocus: true, preview: false },
            ],
        }]);
    });

    it('skips opening a second built-in editor when one already shows the document', () => {
        const document = createDocument('file:///notes.md', '# Title');
        window.tabGroups.all.push({
            viewColumn: 2,
            tabs: [{ input: new TabInputCustom(document.uri, builtInMarkdownEditorViewType) }],
        });
        const provider = new GithubStyleMarkdownEditorProvider(EXTENSION_URI, true);
        resolveOn(provider, document);

        expect(commands.recorded).toEqual([]);
    });

    it('still opens the built-in editor when one is open for a different document', () => {
        const document = createDocument('file:///notes.md', '# Title');
        window.tabGroups.all.push({
            viewColumn: 2,
            tabs: [{ input: new TabInputCustom(Uri.parse('file:///other.md'), builtInMarkdownEditorViewType) }],
        });
        const provider = new GithubStyleMarkdownEditorProvider(EXTENSION_URI, true);
        resolveOn(provider, document);

        expect(commands.recorded).toHaveLength(1);
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

    it('opens mailto links externally', () => {
        const document = createDocument('file:///notes.md', '# Title');
        const { send } = resolveProvider(document);

        send({ type: 'openLink', href: 'mailto:someone@example.com' });

        expect(env.openedUris).toEqual(['mailto:someone@example.com']);
    });

    it('opens relative links as files next to the document', () => {
        const document = createDocument('file:///repo/docs/notes.md', '# Title');
        const { send } = resolveProvider(document);

        send({ type: 'openLink', href: 'guide.md#install' });
        send({ type: 'openLink', href: '../CHANGELOG.md' });
        send({ type: 'openLink', href: 'my%20file.md?plain=1' });

        expect(env.openedUris).toEqual([]);
        expect(commands.recorded.map(call => [call.command, String(call.args[0])])).toEqual([
            ['vscode.open', 'file:///repo/docs/guide.md'],
            ['vscode.open', 'file:///repo/CHANGELOG.md'],
            ['vscode.open', 'file:///repo/docs/my file.md'],
        ]);
    });

    it('resolves root-relative links against the workspace folder', () => {
        workspace.workspaceFolders = [{ uri: Uri.parse('file:///repo') }];
        const document = createDocument('file:///repo/docs/notes.md', '# Title');
        const { send } = resolveProvider(document);

        send({ type: 'openLink', href: '/README.md' });

        expect(commands.recorded.map(call => String(call.args[0]))).toEqual(['file:///repo/README.md']);
    });

    it('ignores fragment-only and protocol-relative links', () => {
        const document = createDocument('file:///repo/notes.md', '# Title');
        const { send } = resolveProvider(document);

        send({ type: 'openLink', href: '#section' });
        send({ type: 'openLink', href: '//evil.example/x' });

        expect(commands.recorded).toEqual([]);
        expect(env.openedUris).toEqual([]);
    });

    it('refuses non-web schemes', () => {
        const document = createDocument('file:///notes.md', '# Title');
        const { send } = resolveProvider(document);

        send({ type: 'openLink', href: 'javascript:alert(1)' });
        send({ type: 'openLink', href: 'file:///etc/passwd' });
        send({ type: 'openLink', href: 'command:workbench.action.terminal.new' });

        expect(env.openedUris).toEqual([]);
        expect(commands.recorded).toEqual([]);
    });
});
