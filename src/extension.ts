import * as vscode from 'vscode';
import { GithubStyleMarkdownEditorProvider } from './webviewEditorProvider';

export function activate(context: vscode.ExtensionContext): void {
    const provider = new GithubStyleMarkdownEditorProvider(context.extensionUri);
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
