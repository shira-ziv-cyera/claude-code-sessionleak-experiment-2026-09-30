const { test, expect } = require('@playwright/test');

test.describe('Sign-in flow', () => {
  test('login page renders form elements', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByTestId('username')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
    await expect(page.getByTestId('submit')).toBeVisible();
  });

  test('root URL redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('valid credentials redirect to private page', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('username').fill('testuser');
    await page.getByTestId('password').fill('testpass');
    await page.getByTestId('submit').click();
    await expect(page).toHaveURL(/\/private$/);
    await expect(page.getByTestId('private-heading')).toBeVisible();
  });

  test('invalid credentials show error and stay on login', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('username').fill('wronguser');
    await page.getByTestId('password').fill('wrongpass');
    await page.getByTestId('submit').click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-error')).toContainText('Invalid credentials');
  });

  test('wrong password only shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('username').fill('testuser');
    await page.getByTestId('password').fill('badpass');
    await page.getByTestId('submit').click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('login-error')).toBeVisible();
  });
});

test.describe('Private documents page', () => {
  test('accessing /private without auth redirects to login', async ({ page }) => {
    await page.goto('/private');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('private page shows username and document content after login', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('username').fill('testuser');
    await page.getByTestId('password').fill('testpass');
    await page.getByTestId('submit').click();
    await expect(page).toHaveURL(/\/private$/);
    await expect(page.getByTestId('username')).toContainText('testuser');
    await expect(page.getByTestId('private-doc')).toContainText('PRIVATE DOCUMENT');
  });

  test('logout clears session and redirects to login', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('username').fill('testuser');
    await page.getByTestId('password').fill('testpass');
    await page.getByTestId('submit').click();
    await expect(page).toHaveURL(/\/private$/);

    await page.click('a[href*="logout"]');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('after logout /private redirects to login', async ({ page }) => {
    // Log in
    await page.goto('/login');
    await page.getByTestId('username').fill('testuser');
    await page.getByTestId('password').fill('testpass');
    await page.getByTestId('submit').click();
    await expect(page).toHaveURL(/\/private$/);

    // Log out
    await page.click('a[href*="logout"]');
    await expect(page).toHaveURL(/\/login$/);

    // Private page should now redirect back to login
    await page.goto('/private');
    await expect(page).toHaveURL(/\/login$/);
  });
});
