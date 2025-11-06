import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
    test('shows course links and expressions link', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle('西班牙语课程主页');
        await expect(page.getByRole('heading', { name: '赵文清的西班牙语课程' })).toBeVisible();
        await expect(page.getByRole('link', { name: '第一课：西班牙语深度入门' })).toBeVisible();
        await expect(page.getByRole('link', { name: '第二课：我的日常生活' })).toBeVisible();
        await expect(page.getByRole('link', { name: '第三课：过去的故事' })).toBeVisible();
        await expect(page.getByRole('link', { name: '第四课：未来的计划与假设' })).toBeVisible();
        await expect(page.getByRole('link', { name: '常用表达查询手册' })).toBeVisible();
    });
});

