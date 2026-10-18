# Markdown Preview Editor Github Style

Realtime WYSIWYG markdown editing that looks like GitHub Pages in light mode —
the same inline editor experience VS Code's new built-in Markdown Editor gives
you, rendered with GitHub's own markdown styling.

![](https://github.com/your-user/markdown-editor-github-style/raw/main/docs/screenshot.png)

## Why

VS Code's built-in **Markdown Editor** (`vscode.markdown.editor`) styles itself
from the active color theme and loads no user CSS, no `markdown.styles`, and no
extension preview styles — so it can't be themed like GitHub.

This extension ships a **companion editor** built on the same engine Microsoft
publishes as [`@vscode/markdown-editor`](https://www.npmjs.com/package/@vscode/markdown-editor)
(MIT), mounted with its bundled **`github-markdown-theme`** — a faithful port of
GitHub's light markdown typography (headings, borders, code blocks, tables,
blockquotes, task lists…).

Result: edit a `.md` file directly in the rendered view, GitHub-styled, in
realtime — regardless of whether VS Code itself uses a dark theme.

## Features (v0.1)

- Realtime WYSIWYG markdown editing (GitHub Flavored Markdown: tables, task
  lists, strikethrough)
- GitHub light typography and palette (Primer values), pinned independent of
  your VS Code theme
- Math rendering via bundled KaTeX (fonts included)
- Click links to open them in the browser
- Shares the underlying document with the text editor — edit in either view,
  both stay in sync
- Scroll position persists per document
- Undo/redo inside the editor
- Works with `*.md`; open via *Reopen Editor With…* or a workspace mapping:

```json
{
  "workbench.editorAssociations": {
    "*.md": "githubStyle.markdownEditor"
  }
}
```

## How it works

- **Extension host** (`src/webviewEditorProvider.ts`): a
  `CustomTextEditorProvider` syncs the document to the webview; edits arrive as
  text diffs and are applied through `WorkspaceEdit`; undo/redo use a compact
  snapshot history kept host-side.
- **Webview** (`webview/main.ts`): mounts `EditorModel` + `EditorView({ classNames:
  ['github-markdown-theme'] })` + `EditorController` from
  `@vscode/markdown-editor`, mirroring VS Code's own bootstrap code (open
  source, MIT).
- **Styling**: the package theme provides GitHub typography scoped under the
  theme class; `webview/github-light.css` re-pins any deltas to the markdown
  styles **github.com ships today** (1px `hr`, 16px code-block padding, 6px
  table-header padding, GitHub's selection/caret/checkbox colors, heading
  hover anchors, the 888px README column) so the port tracks the live site,
  and `webview/canvas.css` pins the surrounding chrome (`--vscode-*` tokens)
  to Primer light values so the look doesn't follow your workbench.

## Known limitations (v0.1)

- Syntax coloring inside code blocks is not wired yet (code renders styled but
  monochrome); the editor API accepts a syntax highlighter — see roadmap
- Undo history is per-editor (native document undo is not re-wired yet)
- No readonly ("locked") mode yet
- No Mermaid rendering yet (diagrams render as source)
- GitHub *dark* themes are not built into the package; a dark variant is on the
  roadmap as a custom theme stylesheet

## Roadmap

1. Syntax highlighting in code blocks (the package ships Monarch/Monaco
   helpers — `createDefaultMonacoSyntaxHighlighter`)
2. Settings: code font size, canvas width, caret behavior on external changes
3. Checkbox click-to-toggle, link hover cards, rich link presentations
4. Mermaid rendering (same plugin slot VS Code uses)
5. Theme setting: `githubStyleMarkdownEditor.theme: light | github-dark`

## Building

```bash
npm install
npm run compile           # typecheck + bundle -> dist/ + media/
npm run lint              # eslint
npm test                  # unit tests (vitest)
npm run test:integration  # integration tests in a real VS Code (downloads it once)
npm run package           # compile + vsce -> .vsix
```

Dev workflow (VS Code tasks, mirrors [.vscode/tasks.json](.vscode/tasks.json)):

- **Dev** (default build) — opens agent tabs (Claude, Codex, Antigravity,
  OpenCode) alongside a compile + `esbuild --watch` terminal
- **Package VSIX** (default test) — bundles and packages a `.vsix` via `vsce`

## CI/CD

- **CI** ([`ci.yml`](.github/workflows/ci.yml)) — on pushes to `main` and pull
  requests: lint, typecheck, unit tests, integration tests in a real VS Code,
  and an uploadable `.vsix` artifact. No secrets required.
- **Release** ([`release.yml`](.github/workflows/release.yml)) — on `v*.*.*`
  tags: verifies the tag matches `package.json`, runs lint + unit tests,
  packages the `.vsix`, publishes to the [VS Code
  Marketplace](https://marketplace.visualstudio.com) and
  [Open VSX](https://open-vsx.org), and attaches the `.vsix` to a GitHub
  release.

### Releasing

1. Bump `version` in `package.json`, update `CHANGELOG.md`, commit.
2. `git tag v0.2.0 && git push origin v0.2.0` — the release workflow does the rest.

Repository secrets (Settings → Secrets and variables → Actions):

- `VSCE_PAT` — Azure DevOps personal access token with the **Marketplace →
  Manage** scope, created under the account that owns the publisher configured
  in `package.json`.
- `OVSX_PAT` — access token from [open-vsx.org](https://open-vsx.org) after
  claiming the publisher namespace.

Before the first publish, replace the `publisher` placeholder in `package.json`
with your real Marketplace publisher id.

## Built with

This extension was developed using **GLM-5.3-Flash Free** with the
**OpenCode harness** at max effort — from the webview bootstrap to the
GitHub Primer styling.

## Credits & licenses

- [`@vscode/markdown-editor`](https://www.npmjs.com/package/@vscode/markdown-editor)
  — Microsoft, MIT. This extension reuses its public API and follows the
  bootstrap approach of VS Code's built-in Markdown Editor (MIT).
- Styling values follow GitHub's Primer design tokens.

## License

MIT
