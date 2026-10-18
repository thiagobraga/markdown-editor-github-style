# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

VS Code extension: a `CustomTextEditorProvider` (`githubStyle.markdownEditor`, selector `*.md`) that gives WYSIWYG markdown editing styled like GitHub light mode. It wraps the engine from `@vscode/markdown-editor` (`EditorModel` + `EditorView` + `EditorController`) and mounts it with the package's `github-markdown-theme`. Always light, independent of the VS Code theme.

## Commands

```bash
npm run compile           # tsc --noEmit + esbuild (dist/extension.js, media/main.js + main.css + fonts/)
npm run watch             # esbuild --watch (no typecheck)
npm run lint              # eslint src webview test
npm test                  # vitest unit tests
npx vitest run test/unit/computeTextEdit.test.ts      # single file
npx vitest run -t "serves a CSP"                      # single test by name
npm run test:integration  # compile + tsc -p tsconfig.test.json + vscode-test (real VS Code, downloads once; CI uses xvfb-run)
npm run package           # vsce package --no-dependencies -> .vsix
```

Debug via `.vscode/launch.json` (Extension Development Host). Reopen a `.md` with *Reopen Editor With… → Markdown Editor Github Style*.

## Architecture

Two separately bundled targets (see `esbuild.mjs`):

- **Extension host** — `src/extension.ts` → `dist/extension.js` (CJS, `vscode` external). Registers the provider with `retainContextWhenHidden` and `supportsMultipleEditorsPerDocument`.
- **Webview** — `webview/main.ts` → `media/main.js` + `media/main.css` (iife, browser; fonts emitted to `media/fonts/`). `media/` is the webview `localResourceRoot`; `media/main.js` is tracked in git, `dist/` is not.

Host ↔ webview protocol (defined in `src/webviewEditorProvider.ts` and the header of `webview/main.ts`; change both sides together):

- host → webview: `{ type: 'content', content }` on external document changes and after undo/redo.
- webview → host: `{ type: 'edit', start, endExclusive, text }`, `{ type: 'undo' }`, `{ type: 'redo' }`, `{ type: 'openLink', href }` (host only opens http/https).
- Initial state is passed through a `<meta name="github-style-markdown-editor-initial-state">` tag (URI-encoded JSON), not a message. HTML uses a nonce CSP.

Edit flow: webview `autorun` over `model.sourceText` → `computeTextEdit` (common prefix/suffix diff, `webview/computeTextEdit.ts`) → `edit` message → host applies a `WorkspaceEdit`. `#isApplying` suppresses the host's `onDidChangeTextDocument` echo (and `#isUpdatingFromHost` does the same in the webview) to avoid feedback loops.

Undo/redo is NOT the native document undo stack: the webview intercepts Ctrl/Cmd+Z and the provider keeps its own whole-document history per document (`src/documentHistory.ts`; max 250 states, edits coalesced within 750 ms). States are recorded after each applied edit so redo can replay them; external changes reset the history, and closing the last editor for a document drops it.

Styling: package CSS (`@vscode/markdown-editor/editor.css`, `themes/github.css`, KaTeX) plus `webview/canvas.css`, which pins `--vscode-*` tokens to Primer light values.

## Testing notes

- Unit tests (`test/unit`) run in Node; `vitest.config.mts` aliases `vscode` to `test/unit/mocks/vscode.ts`, and `test/unit/support/stubPanel.ts` fakes a webview panel. Extend the mock when the provider uses new `vscode` APIs.
- Integration tests (`test/integration`, mocha) are compiled to `out-test/` by `tsconfig.test.json` (CommonJS) before `vscode-test` runs them (`.vscode-test.mjs`).

## Commits

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary`, imperative mood, lowercase summary — e.g. `fix: keep undo history per document`, `docs: document the webview protocol`, `chore(build): emit source maps`. Common types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.

## Release

Tag `vX.Y.Z` matching `package.json` version triggers `.github/workflows/release.yml`: it builds the `.vsix` and creates the GitHub release, and publishes to the Marketplace / Open VSX only when the `VSCE_PAT` / `OVSX_PAT` secrets exist (`gh workflow run release.yml --ref vX.Y.Z` publishes an existing tag later). `publisher` in `package.json` is still the placeholder `your-publisher`.
