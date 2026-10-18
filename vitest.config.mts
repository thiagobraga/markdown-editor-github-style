import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: {
            // Unit tests run without a real editor host; the provider's `vscode`
            // imports resolve to an in-memory stand-in instead.
            vscode: fileURLToPath(new URL('./test/unit/mocks/vscode.ts', import.meta.url)),
        },
    },
    test: {
        environment: 'node',
        include: ['test/unit/**/*.test.ts'],
    },
});
