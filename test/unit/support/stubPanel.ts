import type { WebviewPanel } from 'vscode';

export interface StubWebview {
    cspSource: string;
    options: unknown;
    html: string;
    asWebviewUri(uri: unknown): unknown;
    postMessage(message: unknown): Promise<boolean>;
    onDidReceiveMessage(listener: (message: unknown) => void): { dispose(): void };
}

export interface StubPanel {
    readonly panel: WebviewPanel;
    readonly webview: StubWebview;
    /** Everything the provider posted back to the webview. */
    readonly messages: unknown[];
    /** Simulates a message from the webview to the extension host. */
    send(message: unknown): void;
}

/**
 * A `WebviewPanel`-shaped stub: enough for
 * `GithubStyleMarkdownEditorProvider.resolveCustomTextEditor` to register
 * itself, with the message traffic captured instead of crossing a real
 * webview boundary.
 */
export function createStubPanel(options: { viewColumn?: number } = {}): StubPanel {
    const messages: unknown[] = [];
    let receiveListener: ((message: unknown) => void) | undefined;

    const webview: StubWebview = {
        cspSource: 'vscode-resource://test',
        options: undefined,
        html: '',
        asWebviewUri: uri => uri,
        postMessage: message => {
            messages.push(message);
            return Promise.resolve(true);
        },
        onDidReceiveMessage: listener => {
            receiveListener = listener;
            return { dispose(): void { /* noop */ } };
        },
    };

    const panel = {
        webview,
        viewColumn: options.viewColumn ?? 1,
        onDidDispose: () => ({ dispose(): void { /* noop */ } }),
    } as unknown as WebviewPanel;

    return {
        panel,
        webview,
        messages,
        send: message => receiveListener?.(message),
    };
}
