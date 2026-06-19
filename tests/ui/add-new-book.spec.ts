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
    authorsPage,
    addNewAuthorForm,
    booksManagementPage,
    addNewBookForm,
  }) => {
    // Arrange — Authors page loaded in beforeEach

    // Act — add new author
    await expect(authorsPage.heading).toBeVisible();
    await authorsPage.openAddNewAuthorForm();
    await expect(addNewAuthorForm.panelHeading).toBeVisible();
    await addNewAuthorForm.fillForm(firstName, lastName);
    await addNewAuthorForm.submit();

    // Assert — author created and panel closed
    await expect(addNewAuthorForm.panelHeading).not.toBeVisible({ timeout: 15000 });
    await authorsPage.search(firstName);
    await expect(authorsPage.getAuthorHeading(firstName, lastName)).toBeVisible();

    // Act — add new book
    await booksManagementPage.navigate();
    await expect(booksManagementPage.heading).toBeVisible();
    await booksManagementPage.openAddNewBookForm();
    await expect(addNewBookForm.panelHeading).toBeVisible();
    await addNewBookForm.fillForm(bookTitle, '100', '100');
    await expect(addNewBookForm.getAuthorCheckboxLocator(`${firstName} ${lastName}`)).toBeVisible();
    await addNewBookForm.selectAuthor(`${firstName} ${lastName}`);
    await addNewBookForm.submit();

    // Assert — book created, panel closed, row visible in table
    await expect(booksManagementPage.successToast).toBeVisible({ timeout: 15000 });
    await expect(addNewBookForm.panelHeading).not.toBeVisible({ timeout: 15000 });
    await booksManagementPage.search(bookTitle);
    await expect(booksManagementPage.getBookTitleCell(bookTitle)).toBeVisible();
    await expect(booksManagementPage.getBookAuthorCell(`${firstName} ${lastName}`)).toBeVisible();
  });
});
