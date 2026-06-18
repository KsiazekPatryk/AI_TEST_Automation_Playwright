import { test, expect } from '@fixtures/test.fixture';
import { faker } from '@faker-js/faker';

test.describe('Books Management — add new book', { tag: ['@ui', '@books-management'] }, () => {
  let firstName!: string;
  let lastName!: string;
  let bookTitle!: string;

  test.beforeEach(async ({ authorsPage }) => {
    firstName = faker.person.firstName();
    lastName = faker.person.lastName();
    bookTitle = faker.commerce.productName();
    await authorsPage.navigate();
  });

  test('should add a new author and a new book, then verify both appear', async ({
    page,
    authorsPage,
    addNewAuthorForm,
    booksManagementPage,
    addNewBookForm,
  }) => {
    // --- Add new author ---
    await expect(authorsPage.heading).toBeVisible();
    await authorsPage.openAddNewAuthorForm();
    await expect(addNewAuthorForm.panelHeading).toBeVisible();
    await addNewAuthorForm.fillForm(firstName, lastName);
    await addNewAuthorForm.submit();
    await expect(addNewAuthorForm.panelHeading).not.toBeVisible({ timeout: 15000 });

    // Verify new author card is visible via search
    await authorsPage.search(firstName);
    await expect(authorsPage.getAuthorHeading(firstName, lastName)).toBeVisible();

    // --- Navigate to Books Management and add new book ---
    await booksManagementPage.navigate();
    await expect(booksManagementPage.heading).toBeVisible();
    await booksManagementPage.openAddNewBookForm();
    await expect(addNewBookForm.panelHeading).toBeVisible();

    await addNewBookForm.fillForm(bookTitle, '100', '100');
    await expect(addNewBookForm.getAuthorCheckbox(`${firstName} ${lastName}`)).toBeVisible();
    await addNewBookForm.selectAuthor(`${firstName} ${lastName}`);
    await addNewBookForm.submit();

    // Verify success toast (Railway API can be slow on cold start)
    await expect(page.getByText('Book added successfully!')).toBeVisible({ timeout: 15000 });
    await expect(addNewBookForm.panelHeading).not.toBeVisible({ timeout: 15000 });

    // Verify new book row in table
    await booksManagementPage.search(bookTitle);
    await expect(booksManagementPage.getBookTitleCell(bookTitle)).toBeVisible();
    await expect(booksManagementPage.getBookAuthorCell(`${firstName} ${lastName}`)).toBeVisible();
  });
});
