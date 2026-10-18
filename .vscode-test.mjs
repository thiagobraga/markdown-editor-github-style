import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
    // Compiled from test/integration by `tsc -p tsconfig.test.json`
    // (see the `test:integration` npm script).
    files: 'out-test/test/integration/**/*.test.js',
    version: 'stable',
    mocha: {
        timeout: 30_000,
        color: true,
    },
});
