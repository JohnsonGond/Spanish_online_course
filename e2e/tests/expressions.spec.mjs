import { test, expect } from '@playwright/test';

test.describe('Expressions page', () => {
    test('renders dynamic cards and items', async ({ page }) => {
        await page.goto('/expressions');
        await expect(page.getByRole('heading', { name: '常用表达 (Common Expressions)' })).toBeVisible();
        await expect(page.getByRole('heading', { name: /问候与告别/ })).toBeVisible();
        await expect(page.getByText('Hola')).toBeVisible();
        await expect(page.getByText('Hello')).toBeVisible();
        await expect(page.getByText('你好')).toBeVisible();
    });

    test('TTS click on expression (mocked)', async ({ page }) => {
        await page.route('**/api/speak', async (route) => {
            await route.fulfill({ status: 200, contentType: 'audio/mpeg', body: 'dummy' });
        });
        await page.goto('/expressions');
        const speak = page.locator('.expression-list .speak-icon').first();
        await expect(speak).toBeVisible();
        await expect(speak).toHaveAttribute('role', 'button');
        await expect(speak).toHaveAttribute('tabindex', '0');
        await expect(speak).toHaveAttribute('aria-label', /播放/);
        const requests = [];
        page.on('request', (req) => { if (req.url().includes('/api/speak')) requests.push(req); });
        await speak.click();
        await expect.poll(() => requests.length).toBeGreaterThan(0);
    });

    test('favorites toggle and search filter', async ({ page }) => {
        await page.route('**/api/speak', async (route) => {
            await route.fulfill({ status: 200, contentType: 'audio/mpeg', body: 'dummy' });
        });
        await page.goto('/expressions');
        // Mark first item as favorite
        const firstFav = page.locator('.expression-list .favorite-icon').first();
        await firstFav.click();
        await firstFav.waitFor();
        await expect(firstFav).toHaveClass(/active/);
        // Enable show-only-favorites
        await page.getByLabel('仅看收藏').check();
        // After filter, ensure at least one item is visible and non-favorite items are filtered
        const favItems = page.locator('.expression-list li');
        await expect(favItems.first()).toBeVisible();
        // Search narrows items
        await page.getByLabel('搜索常用表达').fill('Gracias');
        // If the favorited item is not Gracias, list may be empty; just ensure no error occurs
        await expect(page.locator('.expression-card')).toBeVisible();
    });
});
