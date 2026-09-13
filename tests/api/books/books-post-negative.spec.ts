import { faker } from '@faker-js/faker';
import { test, expect } from '@fixtures/test.fixture';
import { HTTP_400_BAD_REQUEST, HTTP_415_UNSUPPORTED_MEDIA_TYPE } from '@api/consts/http.status.codes.const';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { BookPayload, BookResponse } from '@api/models/book.model';
import type { APIResponse } from '@playwright/test';
import type { AuthorsAPISteps } from '@api/steps/authors/authors.api.steps';
import type { BooksAPIRequest } from '@api/requests/books/books.api.request';
import { parseResponse } from '@utils/parse.response.utils';
import { z } from 'zod';

const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: '*/*' };
const DEFAULT_BOOK_POST_BASELINE = { year: 2026, price: 49.99, available: 10 } as const;

const ErrorBodySchema = z.object({
  status: z.number().int(),
  error: z.string(),
  message: z.union([z.string(), z.array(z.string())]),
}).passthrough();

type ErrorBody = z.infer<typeof ErrorBodySchema>;

interface InvalidBookPayload {
  readonly title?: unknown;
  readonly authors?: unknown;
  readonly year?: unknown;
  readonly price?: unknown;
  readonly available?: unknown;
  [key: string]: unknown;
}

test.describe('POST /books 4xx negative scenarios', { tag: ['@api', '@books', '@regression'] }, () => {
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

  function omitBookPayloadField(fieldName: keyof BookPayload, authorId: number): InvalidBookPayload {
    const payload = getRandomBookOverridePayload({ authors: [authorId], ...DEFAULT_BOOK_POST_BASELINE });
    const { [fieldName]: _omitted, ...invalidPayload } = payload;
    return invalidPayload;
  }

  async function expectErrorResponse(response: APIResponse, expectedStatus: number): Promise<ErrorBody> {
    expect(response.status()).toBe(expectedStatus);
    expect(response.headers()['content-type']).toContain('application/json');

    const body = await parseResponse<ErrorBody>(response);
    const result = ErrorBodySchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
    expect(body.status).toBe(expectedStatus);
    expect(JSON.stringify(body)).not.toMatch(/stack|exception|trace|password|token|secret/i);

    return body;
  }

  async function expectInvalidBookPayloadRejected(booksApiRequest: Pick<BooksAPIRequest, 'createBook'>, payload: InvalidBookPayload): Promise<void> {
    const response = await booksApiRequest.createBook(payload, JSON_HEADERS);

    if (response.status() === 201) {
      const createdBook = await parseResponse<BookResponse>(response);
      createdBookIds.push(createdBook.id);
    }

    await expectErrorResponse(response, HTTP_400_BAD_REQUEST);
  }

  const missingRequiredFieldCases = [
    { testCaseId: 'TC-NEG-BOOKS-POST-001', fieldName: 'authors' as const },
    { testCaseId: 'TC-NEG-BOOKS-POST-002', fieldName: 'year' as const },
    { testCaseId: 'TC-NEG-BOOKS-POST-003', fieldName: 'price' as const },
    { testCaseId: 'TC-NEG-BOOKS-POST-004', fieldName: 'available' as const },
  ];

  missingRequiredFieldCases.forEach(({ testCaseId, fieldName }) => {
    test(`should reject missing required field ${fieldName} [${testCaseId}]`, async ({ authorsApiSteps, booksApiRequest }) => {
      const [authorId] = await createAuthors(authorsApiSteps, 1);
      const payload = omitBookPayloadField(fieldName, authorId);

      expect(payload).not.toHaveProperty(fieldName);

      await expectInvalidBookPayloadRejected(booksApiRequest, payload);
    });
  });

  const boundaryViolationCases = [
    {
      testCaseId: 'TC-NEG-BOOKS-POST-006',
      description: 'price below documented minimum',
      overrides: { price: 0 },
      assertion: (payload: InvalidBookPayload): void => expect(payload.price as number).toBeLessThan(0.01),
    },
    {
      testCaseId: 'TC-NEG-BOOKS-POST-007',
      description: 'price above documented maximum',
      overrides: { price: 1000.01 },
      assertion: (payload: InvalidBookPayload): void => expect(payload.price as number).toBeGreaterThan(1000),
    },
    {
      testCaseId: 'TC-NEG-BOOKS-POST-008',
      description: 'available below documented minimum',
      overrides: { available: 0 },
      assertion: (payload: InvalidBookPayload): void => expect(payload.available as number).toBeLessThan(1),
    },
    {
      testCaseId: 'TC-NEG-BOOKS-POST-009',
      description: 'available above documented maximum',
      overrides: { available: 10001 },
      assertion: (payload: InvalidBookPayload): void => expect(payload.available as number).toBeGreaterThan(10000),
    },
  ];

  boundaryViolationCases.forEach(({ testCaseId, description, overrides, assertion }) => {
    test(`should reject ${description} [${testCaseId}]`, async ({ authorsApiSteps, booksApiRequest }) => {
      const [authorId] = await createAuthors(authorsApiSteps, 1);
      const payload = getRandomBookOverridePayload({ authors: [authorId], ...DEFAULT_BOOK_POST_BASELINE, ...overrides });

      assertion(payload);

      await expectInvalidBookPayloadRejected(booksApiRequest, payload);
    });
  });

  test('should reject invalid primitive types [TC-NEG-BOOKS-POST-010]', async ({ booksApiRequest }) => {
    const payload: InvalidBookPayload = {
      title: faker.number.int({ min: 100, max: 999 }),
      authors: String(faker.number.int({ min: 1, max: 9 })),
      year: '2026',
      price: '49.99',
      available: '10',
    };

    expect(typeof payload.title).not.toBe('string');
    expect(Array.isArray(payload.authors)).toBe(false);
    expect(typeof payload.year).not.toBe('number');
    expect(typeof payload.price).not.toBe('number');
    expect(typeof payload.available).not.toBe('number');

    await expectInvalidBookPayloadRejected(booksApiRequest, payload);
  });

  test('should reject malformed JSON body', async ({ authorsApiSteps, booksApiRequest }) => {
    const [authorId] = await createAuthors(authorsApiSteps, 1);
    const malformedJson = `{ "title": "${faker.book.title()}", "authors": [${authorId}]`;

    expect(() => JSON.parse(malformedJson)).toThrow();

    const response = await booksApiRequest.createBook(malformedJson, JSON_HEADERS);

    await expectErrorResponse(response, HTTP_400_BAD_REQUEST);
  });

  test('should reject unsupported text/plain media type', async ({ booksApiRequest }) => {
    const response = await booksApiRequest.createBook('plain text payload', {
      'Content-Type': 'text/plain',
      Accept: '*/*',
    });

    await expectErrorResponse(response, HTTP_415_UNSUPPORTED_MEDIA_TYPE);
  });

  test('should reject oversized title input', async ({ authorsApiSteps, booksApiRequest }) => {
    const [authorId] = await createAuthors(authorsApiSteps, 1);
    const payload = getRandomBookOverridePayload({
      title: 'A'.repeat(10000),
      authors: [authorId],
      ...DEFAULT_BOOK_POST_BASELINE,
    });

    const response = await booksApiRequest.createBook(payload, JSON_HEADERS);

    await expectErrorResponse(response, HTTP_400_BAD_REQUEST);
  });

  test('should reject oversized authors input', async ({ authorsApiSteps, booksApiRequest }) => {
    test.fail(true, 'Live API currently accepts oversized/duplicate authors input with 201.');

    const [authorId] = await createAuthors(authorsApiSteps, 1);
    const payload = getRandomBookOverridePayload({
      authors: Array.from({ length: 200 }, () => authorId),
      ...DEFAULT_BOOK_POST_BASELINE,
    });

    const response = await booksApiRequest.createBook(payload, JSON_HEADERS);

    if (response.status() === 201) {
      const createdBook = await parseResponse<BookResponse>(response);
      createdBookIds.push(createdBook.id);
    }

    await expectErrorResponse(response, HTTP_400_BAD_REQUEST);
  });
});