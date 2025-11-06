import { defineConfig } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    retries: 0,
    use: {
        baseURL,
        trace: 'on-first-retry',
    },
    reporter: [['list']],
    projects: [
        {
            name: 'chromium',
            use: { browserName: 'chromium' },
        },
    ],
});

