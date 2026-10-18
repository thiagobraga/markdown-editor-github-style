import * as vscode from 'vscode';
import { DocumentHistory } from './documentHistory';

interface EditMessage {
    type: 'edit';
    start: number;
    endExclusive: number;
    text: string;
}

interface UndoMessage { type: 'undo'; }
interface RedoMessage { type: 'redo'; }
interface OpenLinkMessage { type: 'openLink'; href: string; }
interface SetReadonlyMessage { type: 'setReadonly'; readonly: boolean; }
interface SetThemeMessage { type: 'setTheme'; theme: string; }
interface OpenSourceMessage { type: 'openSource'; }

type Inbound = EditMessage | UndoMessage | RedoMessage | OpenLinkMessage | SetReadonlyMessage | SetThemeMessage | OpenSourceMessage;

/** Global state key for the edit/read-only mode new editors open in. */
export const readonlyStateKey = 'githubStyle.markdownEditor.readonly';
export const themeStateKey = 'githubStyle.markdownEditor.theme';

const themePreferences = ['auto', 'light', 'dark'];

/** VS Code's built-in Markdown Editor, the editor this extension restyles. */
export const builtInMarkdownEditorViewType = 'vscode.markdown.editor';

export class GithubStyleMarkdownEditorProvider implements vscode.CustomTextEditorProvider {

    public static readonly viewType = 'githubStyle.markdownEditor';

    private readonly _extensionUri: vscode.Uri;
    /** Debug builds only: mirror each editor with the built-in one for comparison. */
    #debugSideBySide: boolean;
    /** Remembers the last edit/read-only toggle as the default for new editors. */
    #globalState: vscode.Memento | undefined;
    #isApplying = false;
    /** Undo/redo history powering the in-webview stack, one per document. */
    #histories = new Map<string, DocumentHistory>();
    /** Open webview count per document; the history is dropped with the last one. */
    #webviewCounts = new Map<string, number>();

    constructor(extensionUri: vscode.Uri, debugSideBySide = false, globalState?: vscode.Memento) {
        this._extensionUri = extensionUri;
        this.#debugSideBySide = debugSideBySide;
        this.#globalState = globalState;
    }

    public resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken,
    ): void {
        const webview = webviewPanel.webview;
        const key = document.uri.toString();

        this.#webviewCounts.set(key, (this.#webviewCounts.get(key) ?? 0) + 1);
        if (!this.#histories.has(key)) {
            // Seed the history so undo bottoms out at the state the editor opened with.
            this.#histories.set(key, new DocumentHistory(document.getText()));
        }

        webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'media'),
                ...this.#documentResourceRoots(document),
            ],
        };

        webviewPanel.webview.html = this.#getHtml(webview, document);

        const dispose = vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.uri.toString() !== key) {
                return;
            }
            if (this.#isApplying) {
                return;
            }
            // External change (other editor, disk write, git checkout): resync and drop stale history.
            this.#historyFor(document).reset(document.getText());
            void webview.postMessage({ type: 'content', content: document.getText() });
        });
        webviewPanel.onDidDispose(() => {
            dispose.dispose();
            const remaining = (this.#webviewCounts.get(key) ?? 1) - 1;
            if (remaining > 0) {
                this.#webviewCounts.set(key, remaining);
                return;
            }
            this.#webviewCounts.delete(key);
            this.#histories.delete(key);
        }, undefined, []);

        webview.onDidReceiveMessage((message: Inbound) => {
            this.#handleMessage(document, webview, message);
        });

        if (this.#debugSideBySide) {
            this.#openBuiltInBeside(document, webviewPanel);
        }
    }

    /**
     * Debug-only: open VS Code's built-in Markdown Editor in the column beside
     * this editor so the two renderings can be compared side-by-side. Skipped
     * while the built-in editor already shows this document.
     */
    #openBuiltInBeside(document: vscode.TextDocument, panel: vscode.WebviewPanel): void {
        if (this.#isBuiltInEditorOpen(document.uri)) {
            return;
        }
        const column = panel.viewColumn;
        void vscode.commands.executeCommand(
            'vscode.openWith',
            document.uri,
            builtInMarkdownEditorViewType,
            {
                viewColumn: column === undefined ? vscode.ViewColumn.Beside : (column + 1) as vscode.ViewColumn,
                preserveFocus: true,
                preview: false,
            },
        ).then(undefined, error => {
            // The built-in editor may be absent on older or trimmed-down hosts.
            console.warn(`[githubStyle] could not open ${builtInMarkdownEditorViewType} side-by-side:`, error);
        });
    }

    #isBuiltInEditorOpen(uri: vscode.Uri): boolean {
        const key = uri.toString();
        return vscode.window.tabGroups.all.some(group =>
            group.tabs.some(tab =>
                tab.input instanceof vscode.TabInputCustom
                && tab.input.viewType === builtInMarkdownEditorViewType
                && tab.input.uri.toString() === key,
            ),
        );
    }

    /**
     * Folders the webview may load images/videos from, so relative paths in the
     * markdown (`![](docs/shot.png)`, `<img src="public/logo.png">`) resolve
     * against the document like on GitHub: the workspace folders when the
     * document is inside one, else its own folder. Untrusted workspaces get
     * none, matching VS Code's built-in markdown editor.
     */
    #documentResourceRoots(document: vscode.TextDocument): vscode.Uri[] {
        if (!vscode.workspace.isTrusted) {
            return [];
        }
        if (vscode.workspace.getWorkspaceFolder(document.uri)) {
            return (vscode.workspace.workspaceFolders ?? []).map(folder => folder.uri);
        }
        return [vscode.Uri.joinPath(document.uri, '..')];
    }

    #handleMessage(document: vscode.TextDocument, webview: vscode.Webview, message: Inbound): void {
        switch (message.type) {
            case 'edit':
                this.#applyDocumentEdit(document, message.start, message.endExclusive, message.text);
                break;
            case 'undo': {
                const previous = this.#historyFor(document).undo();
                if (previous !== undefined) {
                    this.#applyAndEcho(document, webview, previous);
                }
                break;
            }
            case 'redo': {
                const next = this.#historyFor(document).redo();
                if (next !== undefined) {
                    this.#applyAndEcho(document, webview, next);
                }
                break;
            }
            case 'openLink':
                this.#openLink(document, message.href);
                break;
            case 'setReadonly':
                void this.#globalState?.update(readonlyStateKey, message.readonly === true);
                break;
            case 'openSource':
                // The raw markdown in VS Code's plain text editor, beside this one.
                void vscode.commands.executeCommand('vscode.openWith', document.uri, 'default', {
                    viewColumn: vscode.ViewColumn.Beside,
                    preview: false,
                }).then(undefined, (error: unknown) => {
                    void vscode.window.showErrorMessage(`Could not open the markdown source: ${String(error)}`);
                });
                break;
            case 'setTheme':
                if (themePreferences.includes(message.theme)) {
                    void this.#globalState?.update(themeStateKey, message.theme);
                }
                break;
        }
    }

    #historyFor(document: vscode.TextDocument): DocumentHistory {
        const key = document.uri.toString();
        let history = this.#histories.get(key);
        if (!history) {
            history = new DocumentHistory(document.getText());
            this.#histories.set(key, history);
        }
        return history;
    }

    /**
     * Web and mail links open externally; relative links open the linked file
     * in VS Code, resolved like GitHub does (against the document's folder, or
     * the workspace folder for `/`-rooted paths). Every other scheme
     * (`command:`, `file:`, `javascript:`…) is refused.
     */
    #openLink(document: vscode.TextDocument, href: string): void {
        if (/^(https?|mailto):/i.test(href)) {
            void vscode.env.openExternal(vscode.Uri.parse(href, true));
            return;
        }
        const target = this.#resolveRelativeLink(document, href);
        if (target) {
            void vscode.commands.executeCommand('vscode.open', target);
        }
    }

    #resolveRelativeLink(document: vscode.TextDocument, href: string): vscode.Uri | undefined {
        if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) {
            return undefined;
        }
        const path = href.replace(/[?#].*$/, '');
        if (path === '') {
            return undefined;
        }
        let decoded: string;
        try {
            decoded = decodeURIComponent(path);
        } catch {
            decoded = path;
        }
        if (decoded.startsWith('/')) {
            const root = vscode.workspace.getWorkspaceFolder(document.uri)?.uri ?? vscode.Uri.joinPath(document.uri, '..');
            return vscode.Uri.joinPath(root, decoded);
        }
        return vscode.Uri.joinPath(document.uri, '..', decoded);
    }

    #applyDocumentEdit(document: vscode.TextDocument, start: number, endExclusive: number, text: string): void {
        const current = document.getText();
        const edit = new vscode.WorkspaceEdit();
        const first = document.positionAt(Math.min(start, current.length));
        const last = document.positionAt(Math.min(endExclusive, current.length));
        edit.replace(document.uri, new vscode.Range(first, last), text);
        this.#isApplying = true;
        Promise.resolve(vscode.workspace.applyEdit(edit)).then(applied => {
            this.#isApplying = false;
            if (applied) {
                // Record the state the document settled on, now that the edit
                // is actually in; recording before applying would leave the
                // newest state out of the history, breaking redo.
                this.#historyFor(document).record(document.getText());
            }
        }, () => {
            this.#isApplying = false;
        });
    }

    #applyAndEcho(document: vscode.TextDocument, webview: vscode.Webview, content: string): void {
        const edit = new vscode.WorkspaceEdit();
        const first = document.positionAt(0);
        const last = document.positionAt(document.getText().length);
        edit.replace(document.uri, new vscode.Range(first, last), content);
        this.#isApplying = true;
        Promise.resolve(vscode.workspace.applyEdit(edit)).then(() => {
            // The change handler is suppressed while we apply ourselves, so the
            // webview needs the refreshed content explicitly. The editor model
            // ignores identical source text, so echoing an untouched document is
            // a no-op.
            this.#isApplying = false;
            void webview.postMessage({ type: 'content', content: document.getText() });
        }, () => {
            this.#isApplying = false;
        });
    }

    #getHtml(webview: vscode.Webview, document: vscode.TextDocument): string {
        const cspSource = webview.cspSource;
        const nonce = Date.now().toString(36) + Math.floor(Math.random() * 1e9).toString(36);
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
        const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
        // Relative image/link paths in the markdown resolve against the document.
        const baseUri = webview.asWebviewUri(document.uri);
        const initial = {
            content: document.getText(),
            documentVersion: document.version,
            theme: this.#globalState?.get<string>(themeStateKey, 'auto') ?? 'auto',
            readonly: this.#globalState?.get<boolean>(readonlyStateKey, false) ?? false,
        };

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'none';
        script-src 'nonce-${nonce}';
        style-src ${cspSource} 'unsafe-inline';
        img-src ${cspSource} data: https:;
        media-src ${cspSource} data: https:;
        font-src ${cspSource} data:;
    ">
    <base href="${escapeAttribute(baseUri.toString())}">
    <meta name="github-style-markdown-editor-initial-state" content="${encodeURIComponent(JSON.stringify(initial))}">
    <link href="${stylesUri}" rel="stylesheet">
    <script nonce="${nonce}" src="${scriptUri}" defer></script>
    <title>Markdown</title>
</head>
<body>
    <div id="editor"></div>
</body>
</html>`;
    }
}

function escapeAttribute(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
