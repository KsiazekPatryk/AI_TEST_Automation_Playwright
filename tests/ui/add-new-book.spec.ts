import { test, expect } from '@fixtures/test.fixture';
import { createAuthorData } from '@ui/factories/author.factory';
import { createBookData } from '@ui/factories/book.factory';
import { AuthorData } from '@ui/models/author.model';
import { BookData } from '@ui/models/book.model';

test.describe('Books Management — add new book', { tag: ['@ui', '@books-management'] }, () => {
  let author!: AuthorData;
  let book!: BookData;

  test.beforeEach(async ({ authorsPage }) => {
    author = createAuthorData();
    book = createBookData();
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
    await addNewAuthorForm.fillForm(author.firstName, author.lastName);
    await addNewAuthorForm.submit();

    // Assert — author created and panel closed
    await expect(addNewAuthorForm.panelHeading).not.toBeVisible({ timeout: 15000 });
    await authorsPage.search(author.firstName);
    await expect(authorsPage.getAuthorHeading(author.firstName, author.lastName)).toBeVisible();

    // Act — add new book
    await booksManagementPage.navigate();
    await expect(booksManagementPage.heading).toBeVisible();
    await booksManagementPage.openAddNewBookForm();
    await expect(addNewBookForm.panelHeading).toBeVisible();
    await addNewBookForm.fillForm(book.title, book.price, book.quantity);
    await expect(addNewBookForm.getAuthorCheckboxLocator(`${author.firstName} ${author.lastName}`)).toBeVisible();
    await addNewBookForm.selectAuthor(`${author.firstName} ${author.lastName}`);
    await addNewBookForm.submit();

    // Assert — book created, panel closed, row visible in table
    await expect(booksManagementPage.successToast).toBeVisible({ timeout: 30000 });
    await expect(addNewBookForm.panelHeading).not.toBeVisible({ timeout: 15000 });
    await booksManagementPage.search(book.title);
    await expect(booksManagementPage.getBookTitleCell(book.title)).toBeVisible();
    await expect(booksManagementPage.getBookAuthorCell(`${author.firstName} ${author.lastName}`)).toBeVisible();
  });
});
