import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test('Add New Author - fills form and verifies new author card appears', async ({ page }) => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  await page.goto('https://ksiegarnia.up.railway.app/');

  // Navigate to Authors page via nav link (text includes dynamic count, e.g. "Authors (44)")
  await page.getByRole('link', { name: /^Authors/ }).click();

  // A1: Authors Management heading visible
  await expect(page.getByRole('heading', { name: '👥 Authors Management' })).toBeVisible();

  // A2: At least one existing author card is visible
  await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible();

  // A3: "Add New Author" button visible
  const addAuthorButton = page.getByRole('button', { name: '➕ Add New Author' });
  await expect(addAuthorButton).toBeVisible();

  // Open the form
  await addAuthorButton.click();

  // A4: Form panel heading visible
  await expect(page.getByRole('heading', { name: '➕ Add New Author', level: 3 })).toBeVisible();

  // A5–A6: Inputs visible and empty
  const firstNameInput = page.getByRole('textbox', { name: 'First Name', exact: true });
  const lastNameInput = page.getByRole('textbox', { name: 'Last Name', exact: true });

  await expect(firstNameInput).toBeVisible();
  await expect(firstNameInput).toHaveValue('');
  await expect(lastNameInput).toBeVisible();
  await expect(lastNameInput).toHaveValue('');

  // A7–A8: Action buttons visible
  await expect(page.getByRole('button', { name: 'Add Author' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

  // Fill the form
  await firstNameInput.fill(firstName);
  await lastNameInput.fill(lastName);

  // A9–A10: Inputs reflect the entered values
  await expect(firstNameInput).toHaveValue(firstName);
  await expect(lastNameInput).toHaveValue(lastName);

  // Submit
  await page.getByRole('button', { name: 'Add Author' }).click();

  // A11: Form panel is gone — Railway API can be slow on cold start, allow up to 15s
  await expect(page.getByRole('heading', { name: '➕ Add New Author', level: 3 })).not.toBeVisible({ timeout: 15000 });

  // A12–A13: New author heading visible (format: "FirstName LastName")
  const newAuthorHeading = page.getByRole('heading', { name: `${firstName} ${lastName}`, level: 3 });
  await expect(newAuthorHeading).toBeVisible();

  // A14–A15: The card for the new author has Edit and Delete buttons.
  // Double-filter to find divs that contain BOTH the heading AND an edit button, then take
  // the last() (innermost in DOM order) which is the specific card div, not an ancestor wrapper.
  const newAuthorCard = page.locator('div').filter({
    has: page.getByRole('heading', { name: `${firstName} ${lastName}`, level: 3 }),
  }).filter({
    has: page.locator('button[title="Edit"]'),
  }).last();

  await expect(newAuthorCard.locator('button[title="Edit"]')).toBeVisible();
  await expect(newAuthorCard.locator('button[title="Delete"]')).toBeVisible();
});
