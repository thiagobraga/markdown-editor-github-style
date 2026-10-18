import * as assert from 'node:assert';
import * as os from 'node:os';
import * as path from 'node:path';
import * as vscode from 'vscode';
import { GithubStyleMarkdownEditorProvider } from '../../src/webviewEditorProvider';

const EXTENSION_NAME = 'markdown-editor-github-style';
const VIEW_TYPE = GithubStyleMarkdownEditorProvider.viewType;

const workspaceDir = path.join(os.tmpdir(), `github-style-markdown-tests-${process.pid}-${Date.now()}`);

async function writeMarkdownFile(name: string, content: string): Promise<vscode.Uri> {
    const uri = vscode.Uri.file(path.join(workspaceDir, name));
    await vscode.workspace.fs.createDirectory(vscode.Uri.file(workspaceDir));
    await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
    return uri;
}

async function waitFor<T>(probe: () => T | undefined, what: string, timeoutMs = 20_000): Promise<T> {
    const deadline = Date.now() + timeoutMs;
    for (;;) {
        const value = probe();
        if (value !== undefined) {
            return value;
        }
        if (Date.now() > deadline) {
            throw new Error(`Timed out after ${timeoutMs}ms waiting for ${what}`);
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

function findCustomEditorTab(uri: vscode.Uri): vscode.Tab | undefined {
    return vscode.window.tabGroups.all
        .flatMap(group => group.tabs)
        .find(tab => tab.input instanceof vscode.TabInputCustom
            && tab.input.viewType === VIEW_TYPE
            && tab.input.uri.toString() === uri.toString());
}

interface StubPanel {
    readonly panel: vscode.WebviewPanel;
    /** Everything the provider posted back to the webview. */
    readonly messages: unknown[];
    /** Simulates a message from the webview to the extension host. */
    send(message: unknown): void;
}

function createStubPanel(): StubPanel {
    const messages: unknown[] = [];
    let receiveListener: ((message: unknown) => void) | undefined;
    const webview = {
        cspSource: 'vscode-resource://test',
        html: '',
        options: {},
        asWebviewUri: (uri: unknown) => uri,
        postMessage: (message: unknown) => {
            messages.push(message);
            return Promise.resolve(true);
        },
        onDidReceiveMessage: (listener: (message: unknown) => void) => {
            receiveListener = listener;
            return { dispose(): void { /* noop */ } };
        },
    };
    const panel = {
        webview,
        onDidDispose: () => ({ dispose(): void { /* noop */ } }),
    } as unknown as vscode.WebviewPanel;
    return { panel, messages, send: message => receiveListener?.(message) };
}

function hasContentMessage(messages: unknown[], content: string): boolean {
    return messages.some(message => {
        const candidate = message as { type?: string; content?: string };
        return candidate.type === 'content' && candidate.content === content;
    });
}

suite('markdown-editor-github-style', () => {
    suiteTeardown(async () => {
        await vscode.workspace.fs.delete(vscode.Uri.file(workspaceDir), { recursive: true, useTrash: false });
    });

    test('activates when a GitHub-style markdown editor opens', async () => {
        const extension = vscode.extensions.all.find(candidate => candidate.packageJSON?.name === EXTENSION_NAME);
        assert.ok(extension, `expected the ${EXTENSION_NAME} extension to be present in the test host`);
        await extension.activate();
        assert.strictEqual(extension.isActive, true);
    });

    test('opens markdown documents in the githubStyle custom editor', async () => {
        const uri = await writeMarkdownFile('open.md', '# Title');
        try {
            await vscode.commands.executeCommand('vscode.openWith', uri, VIEW_TYPE);
            const tab = await waitFor(() => findCustomEditorTab(uri), 'the custom editor tab to open');
            await vscode.window.tabGroups.close(tab);
        } finally {
            await vscode.workspace.fs.delete(uri);
        }
    });

    test('applies webview edits to the document and undoes/redoes them', async () => {
        const uri = await writeMarkdownFile('roundtrip.md', 'Title');
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const stub = createStubPanel();
            const provider = new GithubStyleMarkdownEditorProvider(vscode.Uri.file(workspaceDir));
            provider.resolveCustomTextEditor(document, stub.panel, new vscode.CancellationTokenSource().token);

            stub.send({ type: 'edit', start: 0, endExclusive: 0, text: '# ' });
            await waitFor(() => (document.getText() === '# Title' ? true : undefined), 'the edit to reach the document');

            stub.send({ type: 'undo' });
            await waitFor(() => (document.getText() === 'Title' ? true : undefined), 'the undo to restore the document');

            stub.send({ type: 'redo' });
            await waitFor(() => (document.getText() === '# Title' ? true : undefined), 'the redo to reapply the edit');

            assert.ok(
                hasContentMessage(stub.messages, 'Title'),
                'expected the webview to receive refreshed content after undo',
            );
            assert.ok(
                hasContentMessage(stub.messages, '# Title'),
                'expected the webview to receive refreshed content after redo',
            );
        } finally {
            await vscode.workspace.fs.delete(uri);
        }
    });

    test('opens the markdown source in a text editor beside on openSource', async () => {
        const uri = await writeMarkdownFile('source.md', '# Source');
        try {
            await vscode.commands.executeCommand('vscode.openWith', uri, VIEW_TYPE);
            await waitFor(() => findCustomEditorTab(uri), 'the custom editor tab to open');
            const document = await vscode.workspace.openTextDocument(uri);
            const stub = createStubPanel();
            const provider = new GithubStyleMarkdownEditorProvider(vscode.Uri.file(workspaceDir));
            provider.resolveCustomTextEditor(document, stub.panel, new vscode.CancellationTokenSource().token);

            stub.send({ type: 'openSource' });

            const tab = await waitFor(
                () => vscode.window.tabGroups.all
                    .flatMap(group => group.tabs)
                    .find(candidate => candidate.input instanceof vscode.TabInputText
                        && candidate.input.uri.toString() === uri.toString()),
                'the text editor tab to open',
            );
            await vscode.window.tabGroups.close(tab);
        } finally {
            await vscode.commands.executeCommand('workbench.action.closeAllEditors');
            await vscode.workspace.fs.delete(uri);
        }
    });

    test('pushes refreshed content when the document changes outside the editor', async () => {
        const uri = await writeMarkdownFile('sync.md', 'one');
        try {
            const document = await vscode.workspace.openTextDocument(uri);
            const stub = createStubPanel();
            const provider = new GithubStyleMarkdownEditorProvider(vscode.Uri.file(workspaceDir));
            provider.resolveCustomTextEditor(document, stub.panel, new vscode.CancellationTokenSource().token);

            const edit = new vscode.WorkspaceEdit();
            edit.replace(uri, new vscode.Range(0, 0, 0, 3), 'two');
            assert.ok(await vscode.workspace.applyEdit(edit), 'expected the workspace edit to apply');

            await waitFor(
                () => (hasContentMessage(stub.messages, 'two') ? true : undefined),
                'the webview to receive the refreshed content',
            );
        } finally {
            await vscode.workspace.fs.delete(uri);
        }
    });
});
