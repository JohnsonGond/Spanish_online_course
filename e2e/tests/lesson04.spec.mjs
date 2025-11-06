import { test, expect } from '@playwright/test';

test.describe('Lesson 04 page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/lesson-04');
        await expect(page.getByRole('heading', { name: '西班牙语深度定制第四课' })).toBeVisible();
    });

    test('pagination and jump menu work', async ({ page }) => {
        await expect(page.locator('#page-counter')).toHaveText(/第\s+1\s+\/\s+13\s+页/);
        await page.getByRole('button', { name: '»' }).click();
        await expect(page.locator('#page-counter')).toHaveText(/第\s+2\s+\/\s+13\s+页/);
        await page.locator('#slide-jump-menu').selectOption({ label: /小测/ });
        await expect(page.getByRole('heading', { name: /小测/ })).toBeVisible();
        await expect(page.locator('#page-counter')).toHaveText(/第\s+12\s+\/\s+13\s+页/);
    });

    test('quiz answers show feedback', async ({ page }) => {
        await page.locator('#slide-jump-menu').selectOption({ label: /小测/ });
        await page.getByRole('radio', { name: 'estará' }).click();
        await expect(page.locator('#feedback-q1')).toHaveText(/正确/);
        await page.getByRole('radio', { name: 'Podrías' }).click();
        await expect(page.locator('#feedback-q2')).toHaveText(/正确/);
    });

    test('TTS click triggers API (mocked)', async ({ page }) => {
        // Mock /api/speak to avoid 404 and decouple from backend.
        await page.route('**/api/speak', async (route) => {
            await route.fulfill({ status: 200, contentType: 'audio/mpeg', body: 'dummy' });
        });
        await page.locator('#slide-jump-menu').selectOption({ label: /Futuro simple/ });
        const speak = page.locator('.speak-icon').first();
        await expect(speak).toBeVisible();
        await expect(speak).toHaveAttribute('role', 'button');
        await expect(speak).toHaveAttribute('tabindex', '0');
        await expect(speak).toHaveAttribute('aria-label', /播放/);
        await speak.click();
        // If no error surfaces and route was hit at least once, we consider pass.
        const requests = [];
        page.on('request', (req) => { if (req.url().includes('/api/speak')) requests.push(req); });
        await speak.click();
        await expect.poll(() => requests.length).toBeGreaterThan(0);
    });
});
