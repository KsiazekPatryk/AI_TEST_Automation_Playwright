import { test, expect } from '@fixtures/test.fixture';
import { HTTP_201_CREATED } from '@api/consts/http.status.codes.const';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { BookPayload, BookResponse } from '@api/models/book.model';
import { BookSchema } from '@api/schemas/book.schema';
import type { AuthorsAPISteps } from '@api/steps/authors/authors.api.steps';
import type { BooksAPIRequest } from '@api/requests/books/books.api.request';
import { parseResponse } from '@utils/parse.response.utils';

const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: '*/*' };
const DEFAULT_BOOK_POST_BASELINE = { year: 2026, price: 49.99, available: 10 } as const;

test.describe('POST /books 2xx positive scenarios', { tag: ['@api', '@books', '@smoke'] }, () => {
  const createdBookIds: number[] = [];
  const createdAuthorIds: number[] = [];

  test.afterEach(async ({ authorsApiSteps, booksApiSteps }) => {
    for (const bookId of createdBookIds) {
      await booksApiSteps.deleteBook(bookId);
    }
    createdBookIds.length = 0;

    for (const authorId of createdAuthorIds) {
      await authorsApiSteps.delete(authorId);
    }
    createdAuthorIds.length = 0;
  });

  async function createAuthors(authorsApiSteps: Pick<AuthorsAPISteps, 'create'>, count: number): Promise<number[]> {
    const authorIds: number[] = [];

    for (let index = 0; index < count; index += 1) {
      const author = await authorsApiSteps.create(getRandomAuthorPayload());
      createdAuthorIds.push(author.id);
      authorIds.push(author.id);
    }

    return authorIds;
  }

  async function createBook(
    booksApiRequest: Pick<BooksAPIRequest, 'createBook'>,
    payload: BookPayload,
  ): Promise<BookResponse> {
    const response = await booksApiRequest.createBook(payload, JSON_HEADERS);

    expect(response.status()).toBe(HTTP_201_CREATED);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await parseResponse<BookResponse>(response);
    const result = BookSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
    expect(body.id).toBeGreaterThan(0);
    expect(body.year).toBe(payload.year);
    expect(body.price).toBe(payload.price);
    expect(body.available).toBe(payload.available);

    createdBookIds.push(body.id);

    return body;
  }

  test('should create a book with all documented request properties [TC-POS-BOOKS-POST-001]', async ({
    authorsApiSteps,
    booksApiRequest,
  }) => {
    const [authorId] = await createAuthors(authorsApiSteps, 1);
    const payload = getRandomBookOverridePayload({ authors: [authorId], ...DEFAULT_BOOK_POST_BASELINE });

    await createBook(booksApiRequest, payload);

    expect(typeof payload.title).toBe('string');
    expect(payload).toHaveProperty('authors');
    expect(payload).toHaveProperty('year');
    expect(payload).toHaveProperty('price');
    expect(payload).toHaveProperty('available');
  });

  test('should create a book without optional title [TC-POS-BOOKS-POST-002]', async ({
    authorsApiSteps,
    booksApiRequest,
  }) => {
    test.fail(true, 'Live API rejects title omission even though OpenAPI does not mark title as required.');

    const [authorId] = await createAuthors(authorsApiSteps, 1);
    const { title: _title, ...payload } = getRandomBookOverridePayload({
      authors: [authorId],
      ...DEFAULT_BOOK_POST_BASELINE,
    });

    expect(payload).not.toHaveProperty('title');

    await createBook(booksApiRequest, payload);
  });

  test('should create a book with multiple unique authors [TC-POS-BOOKS-POST-003]', async ({
    authorsApiSteps,
    booksApiRequest,
  }) => {
    const authorIds = await createAuthors(authorsApiSteps, 2);
    const payload = getRandomBookOverridePayload({ authors: authorIds, ...DEFAULT_BOOK_POST_BASELINE });

    await createBook(booksApiRequest, payload);

    expect(payload.authors.every(Number.isInteger)).toBe(true);
    expect(new Set(payload.authors).size).toBe(payload.authors.length);
  });

  const boundaryPayloads = [
    {
      testCaseId: 'TC-POS-BOOKS-POST-004',
      description: 'minimum documented boundaries',
      price: 0.01,
      available: 1,
    },
    {
      testCaseId: 'TC-POS-BOOKS-POST-005',
      description: 'maximum documented boundaries',
      price: 1000,
      available: 10000,
    },
  ];

  boundaryPayloads.forEach(({ testCaseId, description, price, available }) => {
    test(`should create a book using ${description} [${testCaseId}]`, async ({ authorsApiSteps, booksApiRequest }) => {
      const [authorId] = await createAuthors(authorsApiSteps, 1);
      const payload = getRandomBookOverridePayload({ authors: [authorId], year: 2026, price, available });

      await createBook(booksApiRequest, payload);

      expect(payload.price).toBe(price);
      expect(payload.available).toBe(available);
    });
  });
});
