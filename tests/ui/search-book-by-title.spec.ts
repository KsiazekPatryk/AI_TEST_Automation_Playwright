import { test, expect } from '@playwright/test';

test('search book by title returns filtered result for "effective java"', async ({ page }) => {
  await page.goto('https://ksiegarnia.up.railway.app/');

  await expect(page.getByRole('heading', { name: 'Available Books' })).toBeVisible();
  await expect(page.locator('.book-card')).toHaveCount(29);

  await page.getByPlaceholder('Search books by title or author...').fill('effective java');
  await page.getByRole('button', { name: '🔍' }).click();

  await expect(page.locator('.book-card')).toHaveCount(1);

  await expect(page.locator('.book-title')).toHaveText('Effective Java');
  await expect(page.locator('.book-authors')).toHaveText('Joshua Bloch');
  await expect(page.locator('.book-year')).toHaveText('2008');
  await expect(page.locator('.book-price')).toHaveText('$107.28');
  await expect(page.locator('.book-stock')).toHaveText('In stock: 100');
  await expect(page.locator('.btn-add-cart')).toBeVisible();
  await expect(page.locator('.btn-add-cart')).toBeEnabled();
});
