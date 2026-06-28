import { expect } from '@playwright/test';
import { test } from '@fixtures/test.fixture';
import { faker } from '@faker-js/faker';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import { AuthorResponse } from '@api/models/author.model';
import { BookResponse } from '@api/models/book.model';

test.describe('E2E — Edit Book: Add Second Author', { tag: ['@e2e', '@books-management', '@smoke'] }, () => {
  let authorA: AuthorResponse | undefined;
  let authorB: AuthorResponse | undefined;
  let book: BookResponse | undefined;

  test.afterEach(async ({ authorsApiSteps, booksApiSteps }) => {
    if (book) await booksApiSteps.deleteBook(book.id);
    if (authorA) await authorsApiSteps.delete(authorA.id);
    if (authorB) await authorsApiSteps.delete(authorB.id);
  });

  test('should add second author to existing book via UI', async ({
    booksManagementPage,
    editBookPanel,
    toastComponent,
    authorsApiSteps,
    booksApiSteps,
  }) => {
    // ── ARRANGE ──────────────────────────────────────────────────────────────

    const uniqueA = faker.string.alpha({ length: 8, casing: 'upper' });
    const uniqueB = faker.string.alpha({ length: 8, casing: 'upper' });

    authorA = await authorsApiSteps.create(
      getRandomAuthorPayload({ lastName: `${faker.person.lastName()}-${uniqueA}` }),
    );
    authorB = await authorsApiSteps.create(
      getRandomAuthorPayload({ lastName: `${faker.person.lastName()}-${uniqueB}` }),
    );

    book = await booksApiSteps.createBook(
      getRandomBookOverridePayload({ authors: [authorA.id] }),
    );

    const setupBook = await booksApiSteps.getBookById(book.id);
    expect(setupBook.authors).toHaveLength(1);
    expect(setupBook.authors[0].id).toBe(authorA.id);

    const authorAFullName = `${authorA.firstName} ${authorA.lastName}`;
    const authorBFullName = `${authorB.firstName} ${authorB.lastName}`;

    // ── ACT ───────────────────────────────────────────────────────────────────

    await booksManagementPage.navigate();
    await expect(booksManagementPage.heading).toBeVisible();

    await booksManagementPage.search(book.title);
    await expect(booksManagementPage.getBookTitleCell(book.title)).toBeVisible();

    await booksManagementPage.openEditBook(book.title);
    await expect(editBookPanel.heading).toBeVisible();

    await expect(editBookPanel.getAuthorCheckbox(authorAFullName)).toBeChecked();
    await expect(editBookPanel.getAuthorCheckbox(authorBFullName)).not.toBeChecked();

    await editBookPanel.toggleAuthor(authorBFullName);
    await expect(editBookPanel.getAuthorCheckbox(authorBFullName)).toBeChecked();
    await expect(editBookPanel.getAuthorCheckbox(authorAFullName)).toBeChecked();

    await editBookPanel.submit();

    // ── ASSERT ────────────────────────────────────────────────────────────────

    await expect(editBookPanel.heading).not.toBeVisible({ timeout: 15000 });
    await expect(toastComponent.updateSuccess).toBeVisible({ timeout: 30000 });

    await booksManagementPage.reload();
    await booksManagementPage.search(book.title);
    await expect(booksManagementPage.getBookTitleCell(book.title)).toBeVisible();

    const bookRow = booksManagementPage.getBookRow(book.title);
    await expect(bookRow).toContainText(authorAFullName);
    await expect(bookRow).toContainText(authorBFullName);

    const updatedBook = await booksApiSteps.getBookById(book.id);
    expect(updatedBook.authors).toHaveLength(2);
    const updatedAuthorIds = updatedBook.authors.map((a) => a.id);
    expect(updatedAuthorIds).toContain(authorA.id);
    expect(updatedAuthorIds).toContain(authorB.id);
    expect(updatedBook.title).toBe(book.title);
    expect(updatedBook.year).toBe(book.year);
    expect(updatedBook.price).toBe(book.price);
    expect(updatedBook.available).toBe(book.available);
  });
});

