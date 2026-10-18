import * as vscode from 'vscode';

interface EditMessage {
    type: 'edit';
    start: number;
    endExclusive: number;
    text: string;
}

interface UndoMessage { type: 'undo'; }
interface RedoMessage { type: 'redo'; }
interface OpenLinkMessage { type: 'openLink'; href: string; }

type Inbound = EditMessage | UndoMessage | RedoMessage | OpenLinkMessage;

const MAX_HISTORY = 250;
const COALESCE_MS = 750;

export class GithubStyleMarkdownEditorProvider implements vscode.CustomTextEditorProvider {

    public static readonly viewType = 'githubStyle.markdownEditor';

    private readonly _extensionUri: vscode.Uri;
    #isApplying = false;
    /** Whole-document history used by the in-webview undo/redo stack. */
    #snapshots: string[] = [];
    #snapshotIndex = -1;
    #lastSnapshotAt = 0;

    constructor(extensionUri: vscode.Uri) {
        this._extensionUri = extensionUri;
    }

    public resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken,
    ): void {
        const webview = webviewPanel.webview;

        webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, 'media'),
            ],
        };

        webviewPanel.webview.html = this.#getHtml(webview, document);

        const dispose = vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.uri.toString() !== document.uri.toString()) {
                return;
            }
            if (this.#isApplying) {
                return;
            }
            // External change (other editor, disk write, git checkout): resync and drop stale history.
            this.#snapshots = [document.getText()];
            this.#snapshotIndex = 0;
            void webview.postMessage({ type: 'content', content: document.getText() });
        });
        webviewPanel.onDidDispose(() => dispose.dispose(), undefined, []);

        webview.onDidReceiveMessage((message: Inbound) => {
            this.#handleMessage(document, webview, message);
        });

        // Push the first content snapshot so undo starts from the opened state.
        this.#snapshots = [document.getText()];
        this.#snapshotIndex = 0;
    }

    #handleMessage(document: vscode.TextDocument, webview: vscode.Webview, message: Inbound): void {
        switch (message.type) {
            case 'edit':
                this.#snapshot(document.getText());
                this.#applyDocumentEdit(document, message.start, message.endExclusive, message.text);
                break;
            case 'undo':
                if (this.#snapshotIndex > 0) {
                    this.#snapshotIndex--;
                    this.#applyAndEcho(document, webview, this.#snapshots[this.#snapshotIndex]);
                }
                break;
            case 'redo':
                if (this.#snapshotIndex < this.#snapshots.length - 1) {
                    this.#snapshotIndex++;
                    this.#applyAndEcho(document, webview, this.#snapshots[this.#snapshotIndex]);
                }
                break;
            case 'openLink':
                if (this.#isHttpLike(message.href)) {
                    void vscode.env.openExternal(vscode.Uri.parse(message.href, true));
                }
                break;
        }
    }

    #isHttpLike(href: string): boolean {
        return href.startsWith('https://') || href.startsWith('http://');
    }

    #applyDocumentEdit(document: vscode.TextDocument, start: number, endExclusive: number, text: string): void {
        const current = document.getText();
        const edit = new vscode.WorkspaceEdit();
        const first = document.positionAt(Math.min(start, current.length));
        const last = document.positionAt(Math.min(endExclusive, current.length));
        edit.replace(document.uri, new vscode.Range(first, last), text);
        this.#isApplying = true;
        Promise.resolve(vscode.workspace.applyEdit(edit)).finally(() => {
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

    #snapshot(current: string): void {
        const now = Date.now();
        // Coalesce fast keystrokes into a single undo step.
        if (now - this.#lastSnapshotAt < COALESCE_MS && this.#snapshotIndex > 0) {
            this.#lastSnapshotAt = now;
            return;
        }
        this.#snapshots = this.#snapshots.slice(0, this.#snapshotIndex + 1);
        this.#snapshots.push(current);
        if (this.#snapshots.length > MAX_HISTORY) {
            this.#snapshots.shift();
        }
        this.#snapshotIndex = this.#snapshots.length - 1;
        this.#lastSnapshotAt = now;
    }

    #getHtml(webview: vscode.Webview, document: vscode.TextDocument): string {
        const cspSource = webview.cspSource;
        const nonce = Date.now().toString(36) + Math.floor(Math.random() * 1e9).toString(36);
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
        const stylesUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
        const initial = {
            content: document.getText(),
            documentVersion: document.version,
            /** Always light: this extension's purpose is GitHub's light markdown look. */
            themeKind: 'light',
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
        font-src ${cspSource} data:;
    ">
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
