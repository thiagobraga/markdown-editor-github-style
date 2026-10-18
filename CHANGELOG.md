# Change Log

All notable changes to the **Markdown Preview Editor Github Style** extension
will be documented in this file.

## Unreleased

- Fix redo after undo: history states are now recorded after each applied edit,
  so redo replays them instead of re-applying a stale snapshot
- Keep the undo/redo history per document instead of sharing a single history
  across every open editor

## 0.1.0 — Initial scaffold

- Realtime GitHub-styled WYSIWYG markdown editor on `@vscode/markdown-editor`
  with the bundled `github-markdown-theme` (GitHub Primer light)
- Custom text editor sync with the underlying document (bi-directional)
- KaTeX math fonts bundled; GitHub Flavored Markdown (tables, task lists,
  strikethrough)
- Undo/redo via host-side snapshot history
- Link clicking opens http(s) links in the browser
