import { test, expect } from '@playwright/test';

test.describe('Toolkit and Practice pages', () => {
    test('toolkit renders sections', async ({ page }) => {
        await page.goto('/toolkit');
        await expect(page.getByRole('heading', { name: '职场沟通工具包（Toolkit）' })).toBeVisible();
        await expect(page.getByRole('heading', { name: /邮件模板/ })).toBeVisible();
        await expect(page.getByRole('heading', { name: /会议表达/ })).toBeVisible();
        await expect(page.getByRole('heading', { name: /STAR/ })).toBeVisible();
    });

    test('practice page shows shadowing controls and cloze items', async ({ page }) => {
        await page.route('**/api/speak', async (route) => {
            await route.fulfill({ status: 200, contentType: 'audio/mpeg', body: 'dummy' });
        });
        await page.goto('/practice');
        await expect(page.getByRole('heading', { name: /练习中心/ })).toBeVisible();
        await expect(page.getByRole('button', { name: '开始' })).toBeVisible();
        await expect(page.getByRole('button', { name: '停止' })).toBeVisible();
        await expect(page.getByText('影子跟读（Shadowing）')).toBeVisible();
        await expect(page.getByText('关键表达填空')).toBeVisible();
    });

    test('practice tense quiz feedback works', async ({ page }) => {
        await page.goto('/practice');
        // Select correct answers and check feedback
        await page.getByLabel('compré').click();
        await expect(page.locator('#feedback-q1')).toHaveText(/正确/);
        await page.getByLabel('jugaba').click();
        await expect(page.locator('#feedback-q2')).toHaveText(/正确/);
        await page.getByLabel('trabajo').click();
        await expect(page.locator('#feedback-q3')).toHaveText(/正确/);
    });
});
