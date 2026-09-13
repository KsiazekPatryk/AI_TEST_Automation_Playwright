import { test, expect } from '@fixtures/test.fixture';
import { HTTP_200_OK } from '@api/consts/http.status.codes.const';
import { RestBookResponse } from '@api/models/book.model';
import { RestBooksSchema } from '@api/schemas/book.schema';
import { parseResponse } from '@utils/parse.response.utils';

const JSON_HEADERS = { Accept: 'application/json' };
const ALLOWED_BOOK_KEYS = ['id', 'title', 'year', 'price', 'coverUrl', 'available', 'authors'];
const ALLOWED_AUTHOR_KEYS = ['firstName', 'lastName'];
const FORBIDDEN_RESPONSE_KEYS = ['password', 'token', 'secret', 'apiKey'];

function expectNoSensitiveFields(body: RestBookResponse[]): void {
  for (const book of body) {
    expect(Object.keys(book).some((key) => FORBIDDEN_RESPONSE_KEYS.includes(key))).toBe(false);

    for (const author of book.authors ?? []) {
      expect(Object.keys(author).some((key) => FORBIDDEN_RESPONSE_KEYS.includes(key))).toBe(false);
    }
  }
}

test.describe('GET /books schema', { tag: ['@api', '@books', '@schema', '@smoke'] }, () => {
  test('should return 200 and JSON-compatible body for SCHEMA-BOOKS-GET-001', async ({ booksApiRequest }) => {
    const response = await booksApiRequest.getBooks(undefined, JSON_HEADERS);

    expect(response.status()).toBe(HTTP_200_OK);

    const contentType = response.headers()['content-type'];
    expect(contentType).toBeDefined();
    expect(contentType).toContain('application/json');

    const body = await parseResponse<RestBookResponse[]>(response);
    expect(Array.isArray(body)).toBe(true);
  });

  test('should return a JSON array for SCHEMA-BOOKS-GET-002', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks();
    expect(Array.isArray(body)).toBe(true);
  });

  test('should return only documented book fields for SCHEMA-BOOKS-GET-003', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks();

    expect(body.length).toBeGreaterThan(0);

    for (const book of body) {
      expect(Object.keys(book).every((key) => ALLOWED_BOOK_KEYS.includes(key))).toBe(true);
    }
  });

  test('should return documented scalar field types for SCHEMA-BOOKS-GET-004', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks();

    expect(body.length).toBeGreaterThan(0);

    for (const book of body) {
      expect(typeof book.id === 'number' || typeof book.id === 'undefined').toBe(true);
      expect(typeof book.title === 'string' || typeof book.title === 'undefined').toBe(true);
      expect(typeof book.year === 'number' || typeof book.year === 'undefined').toBe(true);
      expect(typeof book.price === 'number' || typeof book.price === 'undefined').toBe(true);
      expect(typeof book.coverUrl === 'string' || book.coverUrl === null || typeof book.coverUrl === 'undefined').toBe(true);
      expect(typeof book.available === 'number' || typeof book.available === 'undefined').toBe(true);
    }
  });

  test('should return documented nested author structure for SCHEMA-BOOKS-GET-005', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks();

    expect(body.length).toBeGreaterThan(0);

    for (const book of body) {
      if (book.authors === undefined) {
        continue;
      }

      expect(Array.isArray(book.authors)).toBe(true);

      for (const author of book.authors) {
        expect(Object.keys(author).every((key) => ALLOWED_AUTHOR_KEYS.includes(key))).toBe(true);
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

    expect(result.data.length).toBeGreaterThan(0);

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

    const responseAsObject = body as unknown as Record<string, unknown>;
    expect(responseAsObject.items).toBeUndefined();
    expect(responseAsObject.meta).toBeUndefined();
    expect(responseAsObject.page).toBeUndefined();
    expectNoSensitiveFields(body);
  });
});