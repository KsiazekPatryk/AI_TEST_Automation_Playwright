import { z } from 'zod';
import { test, expect } from '@fixtures/test.fixture';
import { HTTP_201_CREATED } from '@api/consts/http.status.codes.const';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { BookPayload, BookResponse } from '@api/models/book.model';
import { BookSchema } from '@api/schemas/book.schema';
import type { AuthorsAPISteps } from '@api/steps/authors/authors.api.steps';
import type { BooksAPIRequest } from '@api/requests/books/books.api.request';
import { parseResponse } from '@utils/parse.response.utils';

const CreateBookPayloadSchema = z.object({
  title: z.string().optional(),
  authors: z.array(z.number().int()).refine((authors) => new Set(authors).size === authors.length),
  year: z.number().int(),
  price: z.number().min(0.01).max(1000),
  available: z.number().int().min(1).max(10000),
});

const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: '*/*' };
const DEFAULT_BOOK_POST_BASELINE = { year: 2026, price: 49.99, available: 10 } as const;

test.describe('POST /books schema 2xx', { tag: ['@api', '@books', '@schema', '@smoke'] }, () => {
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

  async function createBook(booksApiRequest: Pick<BooksAPIRequest, 'createBook'>, payload: BookPayload): Promise<BookResponse> {
    const requestSchemaResult = CreateBookPayloadSchema.safeParse(payload);
    expect(requestSchemaResult.success, requestSchemaResult.success ? '' : JSON.stringify(requestSchemaResult.error.issues)).toBe(true);

    const response = await booksApiRequest.createBook(payload, JSON_HEADERS);

    expect(response.status()).toBe(HTTP_201_CREATED);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await parseResponse<BookResponse>(response);
    const responseSchemaResult = BookSchema.safeParse(body);
    expect(responseSchemaResult.success, responseSchemaResult.success ? '' : JSON.stringify(responseSchemaResult.error.issues)).toBe(true);
    expect(body.id).toBeGreaterThan(0);
    expect(body.year).toBe(payload.year);
    expect(body.price).toBe(payload.price);
    expect(body.available).toBe(payload.available);

    createdBookIds.push(body.id);

    return body;
  }

  test('should return documented success status and JSON object response [TC-SCHEMA-BOOKS-POST-001]', async ({ authorsApiSteps, booksApiRequest }) => {
    const [authorId] = await createAuthors(authorsApiSteps, 1);
    const payload = getRandomBookOverridePayload({ authors: [authorId], ...DEFAULT_BOOK_POST_BASELINE });

    await createBook(booksApiRequest, payload);
  });

  test('should send all required request schema fields while title remains optional [TC-SCHEMA-BOOKS-POST-002]', async ({ authorsApiSteps, booksApiRequest }) => {
    test.fail(true, 'Live API rejects title omission even though OpenAPI does not mark title as required.');

    const [authorId] = await createAuthors(authorsApiSteps, 1);
    const { title: _title, ...payload } = getRandomBookOverridePayload({ authors: [authorId], ...DEFAULT_BOOK_POST_BASELINE });

    expect(payload).toHaveProperty('authors');
    expect(payload).toHaveProperty('year');
    expect(payload).toHaveProperty('price');
    expect(payload).toHaveProperty('available');
    expect(payload).not.toHaveProperty('title');

    const requestSchemaResult = CreateBookPayloadSchema.safeParse(payload);
    expect(requestSchemaResult.success, requestSchemaResult.success ? '' : JSON.stringify(requestSchemaResult.error.issues)).toBe(true);

    await createBook(booksApiRequest, payload);
  });

  test('should validate request field types and formats [TC-SCHEMA-BOOKS-POST-003]', async ({ authorsApiSteps, booksApiRequest }) => {
    const authorIds = await createAuthors(authorsApiSteps, 2);
    const payload = getRandomBookOverridePayload({ authors: authorIds, ...DEFAULT_BOOK_POST_BASELINE });

    expect(typeof payload.title).toBe('string');
    expect(Array.isArray(payload.authors)).toBe(true);
    expect(payload.authors.every(Number.isInteger)).toBe(true);
    expect(new Set(payload.authors).size).toBe(payload.authors.length);
    expect(Number.isInteger(payload.year)).toBe(true);
    expect(typeof payload.price).toBe('number');
    expect(Number.isInteger(payload.available)).toBe(true);

    await createBook(booksApiRequest, payload);
  });

  test('should validate documented numeric boundaries in request schema [TC-SCHEMA-BOOKS-POST-004]', async ({ authorsApiSteps, booksApiRequest }) => {
    const [authorId] = await createAuthors(authorsApiSteps, 1);
    const payload = getRandomBookOverridePayload({ authors: [authorId], year: 2026, price: 0.01, available: 1 });

    expect(payload.price).toBeGreaterThanOrEqual(0.01);
    expect(payload.price).toBeLessThanOrEqual(1000);
    expect(payload.available).toBeGreaterThanOrEqual(1);
    expect(payload.available).toBeLessThanOrEqual(10000);

    await createBook(booksApiRequest, payload);
  });
});