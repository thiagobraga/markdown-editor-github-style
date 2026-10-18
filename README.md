<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/images/markdown-editor-github-style-dark-transparent.png">
    <source media="(prefers-color-scheme: light)" srcset="public/images/markdown-editor-github-style-light-transparent.png">
    <img src="public/images/markdown-editor-github-style-light-transparent.png" alt="Markdown Editor Github Style logo" width="320">
  </picture>
</p>

<h1 align="center">Markdown Editor Github Style</h1>

Realtime WYSIWYG markdown editing that looks like GitHub Pages in light mode - the same inline editor experience VS Code's new built-in Markdown Editor gives you, rendered with GitHub's own markdown styling.

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
- Raw HTML rendered like GitHub (sanitized with GitHub's allowlist): centered
  logos, `<picture>` (variant for the active theme), `<details>`, `<kbd>`, `<sub>`/`<sup>`…
- Relative images (`![](docs/shot.png)`, `<img src="public/logo.png">`) load
  from the workspace
- GitHub alerts (`> [!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]`,
  `[!CAUTION]`)
- Edit / read-only toggle (top-right, like the built-in Markdown Editor); the
  last choice becomes the default for new editors
- Links: web links open in the browser, relative links open the file in VS
  Code, `#anchor` links jump to the heading
- Shares the underlying document with the text editor — edit in either view,
  both stay in sync
- Scroll position persists per document
- Undo/redo inside the editor
- Works with `*.md`; open via _Reopen Editor With…_ or a workspace mapping:

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
- Undo history is kept per document by the extension (native document undo is
  not re-wired yet)
- No readonly ("locked") mode yet
- No Mermaid rendering yet (diagrams render as source)
- GitHub _dark_ themes are not built into the package; a dark variant is on the
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

- **Dev** (default build, F6) — opens agent tabs (Claude, Codex, Antigravity,
  OpenCode) alongside **Install Locally**
- **Package VSIX** (default test, F7) — bundles and packages a `.vsix` via `vsce`
- **Install Locally** — packages a `.vsix` and installs it into your everyday
  VS Code (`npm run install:local`); run _Developer: Reload Window_ afterwards.

### Debugging

`.vscode/launch.json` ships two configs:

- **Launch Markdown Editor Github Style** — the usual F5 flow. Opens an
  Extension Development Host; reopen a `.md` with _Reopen Editor With… →
  Markdown Editor Github Style_. Breakpoints in `src/` and `webview/` both bind
  (esbuild emits source maps into `dist/` and `media/`, and the launch config
  sets `resolveSourceMapLocations` + `debugWebviews` so the webview bundle and
  webworkers debug too).
- **Attach to Extension Host (installed VSIX)** — for a packaged/installed
  copy. Start VS Code with `code --inspect-extensions=9229`, then launch this
  config; points the debugger at the installed extension's code via its
  `.map` files.

Debug-only side-by-side comparison: in an Extension Development Host, opening a
`.md` in _Markdown Editor Github Style_ also opens VS Code's built-in **Markdown
Editor** (`vscode.markdown.editor`) in the column beside it, so the two
renderings can be compared while editing. This is gated on
`ExtensionMode.Development`; packaged builds run in Production mode and never
open the extra pane.

Maps are dev-only: `.vscodeignore` excludes `**/*.map`, so the packaged
`.vsix` never carries them — installed copies get maps only if you install the
unbuilt folder, or re-enable them deliberately for a debug VSIX.

## CI/CD

- **CI** ([`ci.yml`](.github/workflows/ci.yml)) — on pushes to `main` and pull
  requests: lint, typecheck, unit tests, integration tests in a real VS Code,
  and an uploadable `.vsix` artifact. No secrets required.
- **Release** ([`release.yml`](.github/workflows/release.yml)) — on `v*.*.*`
  tags (or manual runs on a tag): verifies the tag matches `package.json`,
  runs lint + unit tests, packages the `.vsix`, and attaches it to a GitHub
  release. Publishing to the [VS Code
  Marketplace](https://marketplace.visualstudio.com) and
  [Open VSX](https://open-vsx.org) only happens once the `VSCE_PAT` /
  `OVSX_PAT` secrets are configured — see [Releasing](#releasing).

### Releasing

1. Bump `version` in `package.json`, update `CHANGELOG.md`, commit.
2. `git tag v0.2.0 && git push origin v0.2.0` — the release workflow does the rest.

Repository secrets (Settings → Secrets and variables → Actions) — only needed
for marketplace publishing:

- `VSCE_PAT` — Azure DevOps personal access token with the **Marketplace →
  Manage** scope, created under the account that owns the publisher configured
  in `package.json`.
- `OVSX_PAT` — access token from [open-vsx.org](https://open-vsx.org) after
  claiming the publisher namespace.

While the secrets are absent, tagged releases still build the `.vsix` and
attach it to a GitHub release. After adding them, publish an existing tag with
`gh workflow run release.yml --ref v0.1.1`. Before the first publish, replace
the `publisher` placeholder in `package.json` with your real Marketplace
publisher id.

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
