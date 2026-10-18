#!/bin/bash
set -e

echo "[md-editor] Installing dependencies..."
npm install

echo "[md-editor] Typecheck + bundle..."
npm run compile

echo "[md-editor] Watching for changes (esbuild)..."
npm run watch
