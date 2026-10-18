import * as vscode from 'vscode';
import { GithubStyleMarkdownEditorProvider } from './webviewEditorProvider';

export function activate(context: vscode.ExtensionContext): void {
    // Debug-only: in an Extension Development Host, every editor mirrors itself
    // with VS Code's built-in Markdown Editor for side-by-side comparison.
    // Packaged builds run in Production mode, so users never get the extra pane.
    const debugSideBySide = context.extensionMode === vscode.ExtensionMode.Development;
    const provider = new GithubStyleMarkdownEditorProvider(context.extensionUri, debugSideBySide, context.globalState);
    context.subscriptions.push(
        vscode.window.registerCustomEditorProvider(
            GithubStyleMarkdownEditorProvider.viewType,
            provider,
            {
                webviewOptions: { retainContextWhenHidden: true },
                supportsMultipleEditorsPerDocument: true,
            },
        ),
    );
}

export function deactivate(): void {
    /* nothing to do */
}
