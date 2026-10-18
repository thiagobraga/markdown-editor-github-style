/**
 * Builds both extension targets:
 *  - extension host  (src/extension.ts)  -> dist/extension.js          (CommonJS, `vscode` external)
 *  - webview bundle  (webview/main.ts)   -> media/main.js + main.css,  (iife, fonts -> media/fonts/)
 *  - typecheck       (tsc --noEmit) is run separately by `npm run compile`
 *
 * Maps are always emitted next to each bundle (sourcesContent included) so the
 * debug hot path maps straight back to the TS sources. They never ship:
 * .vscodeignore excludes the map files, keeping the packaged VSIX lean.
 */
import esbuild from 'esbuild';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const watch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const common = {
  bundle: true,
  minify: false,
  sourcemap: true,
  logLevel: 'info',
  target: ['es2022'],
  absWorkingDir: root,
};

const configs = [
  {
    ...common,
    entryPoints: [{ in: 'src/extension.ts', out: 'extension' }],
    outdir: join(root, 'dist'),
    format: 'cjs',
    platform: 'node',
    external: ['vscode'],
  },
  {
    ...common,
    entryPoints: [{ in: 'webview/main.ts', out: 'main' }],
    outdir: join(root, 'media'),
    format: 'iife',
    platform: 'browser',
    target: ['es2020'],
    // `@vscode/diff` (pulled in by the editor) lazily imports `node:fs/promises`
    // on a Node-only path that never runs in the webview.
    external: ['node:*'],
    assetNames: 'fonts/[name]-[hash]',
    loader: { '.woff': 'file', '.woff2': 'file', '.ttf': 'file' },
  },
];

if (watch) {
  const contexts = await Promise.all(configs.map(config => esbuild.context(config)));
  await Promise.all(contexts.map(context => context.watch()));
  console.log('watching...');
} else {
  for (const config of configs) {
    await esbuild.build(config);
  }
}
