import { test, expect } from '@fixtures/test.fixture';
import { createAuthorData } from '@ui/factories/author.factory';
import { createBookData } from '@ui/factories/book.factory';
import { AuthorData } from '@ui/models/author.model';
import { BookData } from '@ui/models/book.model';

test.describe('Books Management — add new book', { tag: ['@ui', '@books-management'] }, () => {
  let author!: AuthorData;
  let book!: BookData;
  let existingAuthorIds = new Set<number>();
  let existingBookIds = new Set<number>();

  test.beforeEach(async ({ authorsPage, authorsApiSteps, booksApiSteps }) => {
    author = createAuthorData();
    book = createBookData();
    existingAuthorIds = new Set(
      (await authorsApiSteps.getAll({ firstName: author.firstName, lastName: author.lastName })).map(({ id }) => id),
    );
    existingBookIds = new Set(
      (await booksApiSteps.getBooks({ title: book.title }))
        .filter((item) => item.title === book.title && item.id !== undefined)
        .map(({ id }) => id as number),
    );
    await authorsPage.navigate();
  });

  test.afterEach(async ({ authorsApiSteps, booksApiSteps }) => {
    const matchingBooks = await booksApiSteps.getBooks({ title: book.title });
    for (const item of matchingBooks) {
      if (item.title === book.title && item.id !== undefined && !existingBookIds.has(item.id)) {
        await booksApiSteps.deleteBook(item.id);
      }
    }

    const matchingAuthors = await authorsApiSteps.getAll({ firstName: author.firstName, lastName: author.lastName });
    for (const item of matchingAuthors) {
      if (item.firstName === author.firstName && item.lastName === author.lastName && !existingAuthorIds.has(item.id)) {
        await authorsApiSteps.delete(item.id);
      }
    }
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
    await expect(addNewBookForm.getAuthorCheckboxLocator(`${author.firstName} ${author.lastName}`)).toBeChecked();
    await addNewBookForm.submit();

    // Assert — book created, panel closed, row visible in table
    await expect(booksManagementPage.successToast).toBeVisible({ timeout: 30000 });
    await expect(addNewBookForm.panelHeading).not.toBeVisible({ timeout: 15000 });
    await booksManagementPage.search(book.title);
    await expect(booksManagementPage.getBookTitleCell(book.title)).toBeVisible();
    await expect(booksManagementPage.getBookAuthorCell(`${author.firstName} ${author.lastName}`)).toBeVisible();
  });
});
