import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('should add a new book via Manage Books form and verify it appears in the table', async ({ page }) => {
  const title = `${faker.word.adjective()} ${faker.word.noun()} Book`;

  // Navigate to Manage Books
  await page.goto('/books-management');

  // Verify page loaded
  await expect(page.getByRole('heading', { name: '📚 Books Management' })).toBeVisible();

  // Open the Add New Book side panel
  await page.getByRole('button', { name: '➕ Add New Book' }).click();

  // Scope all form interactions to the panel
  const panel = page.locator('div').filter({ has: page.getByRole('heading', { name: '➕ Add New Book', level: 3 }) });
  await expect(panel.getByRole('heading', { name: '➕ Add New Book', level: 3 })).toBeVisible();

  // Fill the form
  await panel.getByRole('textbox', { name: 'Title *' }).fill(title);
  await panel.getByRole('spinbutton', { name: 'Year *' }).fill('2013');
  await panel.getByRole('spinbutton', { name: 'Price ($) *' }).fill('79.99');
  await panel.getByRole('spinbutton', { name: 'Available Quantity *' }).fill('50');

  // Select author — checkbox has no <label>, click parent div of the name text
  await panel.getByText('Kent Beck', { exact: true }).locator('..').getByRole('checkbox').click();

  // Submit
  await page.getByRole('button', { name: 'Add Book' }).click();

  // Assert success toast
  await expect(page.getByText('Book added successfully!')).toBeVisible();

  // Assert panel closed (Railway API can be slow on cold start)
  await expect(page.getByRole('heading', { name: '➕ Add New Book', level: 3 })).not.toBeVisible({ timeout: 15000 });

  // Assert new row in table
  await expect(page.getByRole('cell', { name: title })).toBeVisible();
});
