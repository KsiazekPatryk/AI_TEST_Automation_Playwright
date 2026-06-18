import { test, expect } from '@fixtures/test.fixture';
import { faker } from '@faker-js/faker';
import { AuthorCardComponent } from '@ui/components/author-card.component';

test.describe('Authors page — add new author', { tag: ['@ui', '@authors'] }, () => {
  test('should fill the form and verify the new author card appears', async ({
    page,
    authorsPage,
    addNewAuthorForm,
  }) => {
    // Arrange
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    await page.goto('https://ksiegarnia.up.railway.app/');

    // Act — navigate to Authors page
    await authorsPage.navigate();

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

    // Act — fill the form
    await addNewAuthorForm.fillForm(firstName, lastName);

    // Assert — inputs reflect entered values
    await expect(addNewAuthorForm.firstNameInput).toHaveValue(firstName);
    await expect(addNewAuthorForm.lastNameInput).toHaveValue(lastName);

    // Act — submit the form
    await addNewAuthorForm.submit();

    // Assert — form panel disappears (Railway API can be slow on cold start)
    await expect(addNewAuthorForm.panelHeading).not.toBeVisible({ timeout: 15000 });

    // Assert — new author card appears with correct heading
    await expect(authorsPage.getAuthorHeading(firstName, lastName)).toBeVisible();

    // Assert — new author card has Edit and Delete buttons
    const card = new AuthorCardComponent(authorsPage.getAuthorCard(firstName, lastName));
    await expect(card.editButton).toBeVisible();
    await expect(card.deleteButton).toBeVisible();
  });
});
