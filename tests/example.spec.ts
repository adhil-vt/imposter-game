import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).toBe('Example Domain');
});

test('check heading', async ({ page }) => {
    await page.goto('https://example.com');
    const heading = await page.locator('h1').textContent();
    expect(heading).toBe('Example Domain');
});