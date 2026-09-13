import { z } from 'zod';
import { test, expect } from '@fixtures/test.fixture';
import { HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND } from '@api/consts/http.status.codes.const';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import type { BooksAPIRequest } from '@api/requests/books/books.api.request';
import type { AuthorsAPISteps } from '@api/steps/authors/authors.api.steps';
import type { BooksAPISteps } from '@api/steps/books/books.api.steps';

const Int64PathIdSchema = z.number().int().positive().max(Number.MAX_SAFE_INTEGER);

type DisposableBook = {
  authorId: number;
  bookId: number;
  bookDeleted: boolean;
};

async function createDisposableBook(
  authorsApiSteps: AuthorsAPISteps,
  booksApiSteps: BooksAPISteps,
): Promise<DisposableBook> {
  const author = await authorsApiSteps.create(getRandomAuthorPayload());

  try {
    const book = await booksApiSteps.createBook(getRandomBookOverridePayload({ authors: [author.id] }));
    return { authorId: author.id, bookId: book.id, bookDeleted: false };
  } catch (error) {
    await authorsApiSteps.delete(author.id);
    throw error;
  }
}

async function cleanupBookIfNeeded(booksApiRequest: Pick<BooksAPIRequest, 'deleteBook'>, bookId: number): Promise<void> {
  const response = await booksApiRequest.deleteBook(bookId);
  expect([HTTP_204_NO_CONTENT, HTTP_404_NOT_FOUND]).toContain(response.status());
}

async function expectBookDeleted(booksApiSteps: BooksAPISteps, bookId: number): Promise<void> {
  const books = await booksApiSteps.getBooks();
  expect(books.some((book) => book.id === bookId)).toBe(false);
}

test.describe('DELETE /books/{id} schema validation', { tag: ['@api', '@books', '@schema', '@smoke'] }, () => {
  const disposableBooks = new Map<string, DisposableBook>();

  test.afterEach(async ({ authorsApiSteps, booksApiRequest }, testInfo) => {
    const disposableBook = disposableBooks.get(testInfo.testId);

    if (disposableBook === undefined) {
      return;
    }

    try {
      if (!disposableBook.bookDeleted) {
        await cleanupBookIfNeeded(booksApiRequest, disposableBook.bookId);
      }
    } finally {
      await authorsApiSteps.delete(disposableBook.authorId);
      disposableBooks.delete(testInfo.testId);
    }
  });

  test('should return documented 204 status with empty body [TC-SCHEMA-BOOKS-ID-DELETE-001]', async ({
    authorsApiSteps,
    booksApiRequest,
    booksApiSteps,
  }, testInfo) => {
    const disposableBook = await createDisposableBook(authorsApiSteps, booksApiSteps);
    disposableBooks.set(testInfo.testId, disposableBook);

    const response = await booksApiRequest.deleteBook(disposableBook.bookId);
    const body = await response.text();

    expect(response.status()).toBe(HTTP_204_NO_CONTENT);
    expect(body).toBe('');
  await expectBookDeleted(booksApiSteps, disposableBook.bookId);

    disposableBook.bookDeleted = true;
  });

  test('should use documented integer int64 path parameter [TC-SCHEMA-BOOKS-ID-DELETE-002]', async ({
    authorsApiSteps,
    booksApiRequest,
    booksApiSteps,
  }, testInfo) => {
    const disposableBook = await createDisposableBook(authorsApiSteps, booksApiSteps);
    disposableBooks.set(testInfo.testId, disposableBook);

    const pathIdResult = Int64PathIdSchema.safeParse(disposableBook.bookId);
    expect(pathIdResult.success, pathIdResult.success ? '' : JSON.stringify(pathIdResult.error.issues)).toBe(true);

    const response = await booksApiRequest.deleteBook(disposableBook.bookId);
    const body = await response.text();

    expect(response.status()).toBe(HTTP_204_NO_CONTENT);
    expect(body).toBe('');
  await expectBookDeleted(booksApiSteps, disposableBook.bookId);

    disposableBook.bookDeleted = true;
  });

  test('should not validate response content because 204 has no documented schema [TC-SCHEMA-BOOKS-ID-DELETE-003]', async ({
    authorsApiSteps,
    booksApiRequest,
    booksApiSteps,
  }, testInfo) => {
    const disposableBook = await createDisposableBook(authorsApiSteps, booksApiSteps);
    disposableBooks.set(testInfo.testId, disposableBook);

    const response = await booksApiRequest.deleteBook(disposableBook.bookId);
    const body = await response.text();

    expect(response.status()).toBe(HTTP_204_NO_CONTENT);
    expect(body.length).toBe(0);
    await expectBookDeleted(booksApiSteps, disposableBook.bookId);

    disposableBook.bookDeleted = true;
  });
});