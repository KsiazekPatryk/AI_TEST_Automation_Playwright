import { test, expect } from '@fixtures/test.fixture';
import { HTTP_200_OK } from '@api/consts/http.status.codes.const';
import { RestBookResponse } from '@api/models/book.model';
import { RestBooksSchema } from '@api/schemas/book.schema';
import { parseResponse } from '@utils/parse.response.utils';

const JSON_HEADERS = { Accept: 'application/json' };

test.describe('GET /books schema', { tag: ['@api', '@books', '@schema', '@smoke'] }, () => {
  test('should return 200 and JSON-compatible body for SCHEMA-BOOKS-GET-001', async ({ booksApiRequest }) => {
    const response = await booksApiRequest.getBooks(undefined, JSON_HEADERS);

    expect(response.status()).toBe(HTTP_200_OK);

    const contentType = response.headers()['content-type'];
    expect(contentType).toBeDefined();
    expect(contentType).toContain('application/json');

    const body = await parseResponse<RestBookResponse[]>(response);
    expect(body).not.toBeNull();
  });

  test('should return a JSON array for SCHEMA-BOOKS-GET-002', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks();
    expect(Array.isArray(body)).toBe(true);
  });

  test('should return only documented book fields for SCHEMA-BOOKS-GET-003', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks();

    const result = RestBooksSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
  });

  test('should return documented scalar field types for SCHEMA-BOOKS-GET-004', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks();

    for (const book of body) {
      expect(typeof book.id === 'number' || typeof book.id === 'undefined').toBe(true);
      expect(typeof book.title === 'string' || typeof book.title === 'undefined').toBe(true);
      expect(typeof book.year === 'number' || typeof book.year === 'undefined').toBe(true);
      expect(typeof book.price === 'number' || typeof book.price === 'undefined').toBe(true);
      expect(typeof book.coverUrl === 'string' || typeof book.coverUrl === 'undefined').toBe(true);
      expect(typeof book.available === 'number' || typeof book.available === 'undefined').toBe(true);
    }
  });

  test('should return documented nested author structure for SCHEMA-BOOKS-GET-005', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks();

    for (const book of body) {
      if (book.authors === undefined) {
        continue;
      }

      expect(Array.isArray(book.authors)).toBe(true);

      for (const author of book.authors) {
        expect(typeof author.firstName === 'string' || typeof author.firstName === 'undefined').toBe(true);
        expect(typeof author.lastName === 'string' || typeof author.lastName === 'undefined').toBe(true);
      }
    }
  });

  test('should return unique author objects per book for SCHEMA-BOOKS-GET-006', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks();

    const result = RestBooksSchema.safeParse(body);
  expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);

    if (!result.success) {
      return;
    }

    for (const book of result.data) {
      if (!book.authors) {
        continue;
      }

      const serializedAuthors = book.authors.map((author) => JSON.stringify(author));
      expect(new Set(serializedAuthors).size).toBe(serializedAuthors.length);
    }
  });

  test('should return no undocumented pagination or metadata wrapper for SCHEMA-BOOKS-GET-007', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks();

    expect(Array.isArray(body)).toBe(true);
  });
});