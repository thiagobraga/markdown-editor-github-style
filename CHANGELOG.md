# Change Log

All notable changes to the **Markdown Editor Github Style** extension
will be documented in this file.

## Unreleased

- Upgrade the editor engine (`@vscode/markdown-editor`) to `0.0.2-132`, the
  build VS Code's own Markdown Editor uses
- Edit / read-only toggle in the top-right corner; the last choice is
  remembered for new editors
- Render raw HTML the way GitHub does (sanitized allowlist): HTML blocks such
  as centered logos and `<picture>`, inline `<kbd>`/`<sub>`/`<sup>`/`<br>`,
  and `<details>` that collapse their markdown body
- GitHub dark theme, following the VS Code theme (dark / high-contrast);
  `<picture>` `prefers-color-scheme` sources and `#gh-dark-mode-only` /
  `#gh-light-mode-only` images follow it and switch live
- View-source `</>` button opens the markdown file in the text editor beside
- Theme toggle button (auto / light / dark) beside the edit toggle; the
  choice is remembered for new editors
- Relative images and videos load (document `<base>` + workspace resource
  roots); `<picture>` picks the source for the active theme
- GitHub alerts (`> [!NOTE]` … `> [!CAUTION]`)
- Relative links open the file in VS Code and `#anchor` links jump to the
  heading; `mailto:` links open externally
- GitHub-like layout fixes: paragraphs join soft line breaks, fenced code
  blocks lose the blank fence lines, the heading link icon no longer overlaps
  the active `#` marker
- Undo/redo also accepts Ctrl+Y; reopening keeps the cursor and no longer
  jumps it to the end of the document after undo or external changes
- Debug-only side-by-side comparison: in an Extension Development Host, opening
  a `.md` in Markdown Editor Github Style also opens VS Code's built-in Markdown
  Editor beside it

## 0.1.1 — Undo/redo history fixes

- Fix redo after undo: history states are now recorded after each applied edit,
  so redo replays them instead of re-applying a stale snapshot
- Keep the undo/redo history per document instead of sharing a single history
  across every open editor
- The extension is now called **Markdown Editor Github Style**

## 0.1.0 — Initial scaffold

- Realtime GitHub-styled WYSIWYG markdown editor on `@vscode/markdown-editor`
  with the bundled `github-markdown-theme` (GitHub Primer light)
- Custom text editor sync with the underlying document (bi-directional)
- KaTeX math fonts bundled; GitHub Flavored Markdown (tables, task lists,
  strikethrough)
- Undo/redo via host-side snapshot history
- Link clicking opens http(s) links in the browser
