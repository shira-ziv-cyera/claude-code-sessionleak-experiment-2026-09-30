const { test, expect } = require('@playwright/test');

// Tests run with pre-loaded storageState from playwright.config.js — they
// hit the private area directly, no per-test login.

test.describe('Authenticated area', () => {
  test('private page renders for pre-authenticated session', async ({ page }) => {
    await page.goto('/private');
    await expect(page).toHaveURL(/\/private$/);
    await expect(page.getByTestId('private-heading')).toBeVisible();
    await expect(page.getByTestId('private-doc')).toContainText('PRIVATE DOCUMENT');
  });

  test('username reflects stored session', async ({ page }) => {
    await page.goto('/private');
    await expect(page.getByTestId('username')).toContainText('testuser');
  });
});
