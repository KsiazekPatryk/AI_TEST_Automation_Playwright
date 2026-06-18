import { test, expect } from '@fixtures/test.fixture';
import { faker } from '@faker-js/faker';

test.describe('Authors page — add new author', { tag: ['@ui', '@authors'] }, () => {
  let firstName: string;
  let lastName: string;

  test.beforeEach(async ({ authorsPage }) => {
    firstName = faker.person.firstName();
    lastName = faker.person.lastName();
    await authorsPage.navigate();
  });

  test('should fill the form and verify the new author card appears', async ({
    authorsPage,
    addNewAuthorForm,
  }) => {
    // Assert — Authors Management page loaded
    await expect(authorsPage.heading).toBeVisible();
    await expect(authorsPage.firstExistingAuthorHeading).toBeVisible();
    await expect(authorsPage.addNewAuthorButton).toBeVisible();

    // Act — open Add New Author form
    await authorsPage.openAddNewAuthorForm();

    // Assert — form panel visible with empty inputs and action buttons
    await expect(addNewAuthorForm.panelHeading).toBeVisible();
    await expect(addNewAuthorForm.firstNameInput).toBeVisible();
    await expect(addNewAuthorForm.firstNameInput).toHaveValue('');
    await expect(addNewAuthorForm.lastNameInput).toBeVisible();
    await expect(addNewAuthorForm.lastNameInput).toHaveValue('');
    await expect(addNewAuthorForm.addAuthorButton).toBeVisible();
    await expect(addNewAuthorForm.cancelButton).toBeVisible();

    // Act — fill and submit
    await addNewAuthorForm.fillForm(firstName, lastName);
    await addNewAuthorForm.submit();

    // Assert — form panel disappears (Railway API can be slow on cold start)
    await expect(addNewAuthorForm.panelHeading).not.toBeVisible({ timeout: 15000 });

    // Assert — new author card appears with Edit and Delete buttons
    await expect(authorsPage.getAuthorHeading(firstName, lastName)).toBeVisible();

    const card = authorsPage.getAuthorCardComponent(firstName, lastName);
    await expect(card.editButton).toBeVisible();
    await expect(card.deleteButton).toBeVisible();
  });
});
