import { z } from 'zod';
import { test, expect } from '@fixtures/test.fixture';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import { HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR } from '@api/consts/http.status.codes.const';
import { PatchBookPayloadSchema } from '@api/schemas/book.schema';
import { parseResponse } from '@utils/parse.response.utils';
import type { APIResponse } from '@playwright/test';
import type { AuthorsAPISteps } from '@api/steps/authors/authors.api.steps';
import type { BooksAPISteps } from '@api/steps/books/books.api.steps';

const PathIdSchema = z.coerce.number().int();
const ErrorResponseSchema = z
  .object({
    status: z.number().int(),
    error: z.string(),
    message: z.union([z.string(), z.array(z.string())]),
  })
  .passthrough();

type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

type DisposableBook = {
  readonly authorId: number;
  readonly bookId: number;
};

async function createBookForPatch(authorsApiSteps: AuthorsAPISteps, booksApiSteps: BooksAPISteps): Promise<DisposableBook> {
  const author = await authorsApiSteps.create(getRandomAuthorPayload());

  try {
    const book = await booksApiSteps.createBook(getRandomBookOverridePayload({ authors: [author.id] }));

    return { authorId: author.id, bookId: book.id };
  } catch (error) {
    await authorsApiSteps.delete(author.id);
    throw error;
  }
}

async function expectErrorResponse(response: APIResponse, expectedStatus: number): Promise<ErrorResponse> {
  expect(response.status()).toBe(expectedStatus);
  expect(response.headers()['content-type']).toContain('application/json');

  const body = await parseResponse<ErrorResponse>(response);
  const result = ErrorResponseSchema.safeParse(body);
  expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
  expect(body.status).toBe(expectedStatus);
  expect(JSON.stringify(body)).not.toMatch(/stack|exception|trace|password|token|secret/i);

  return body;
}

test.describe('PATCH /books/{id} 4xx contract validation', { tag: ['@api', '@books', '@regression'] }, () => {
  const disposableBooks = new Map<string, DisposableBook>();

  test.afterEach(async ({ authorsApiSteps, booksApiSteps }, testInfo) => {
    const disposableBook = disposableBooks.get(testInfo.testId);

    if (disposableBook === undefined) {
      return;
    }

    try {
      await booksApiSteps.deleteBook(disposableBook.bookId);
    } finally {
      await authorsApiSteps.delete(disposableBook.authorId);
      disposableBooks.delete(testInfo.testId);
    }
  });

  test('should return 400 for non-integer path id [PATCH-BOOKS-ID-NEG-001]', async ({ booksApiRequest }) => {
    const id = 'abc';
    const idResult = PathIdSchema.safeParse(id);

    expect(idResult.success).toBe(false);

    const response = await booksApiRequest.patchBook(id, getRandomBookOverridePayload({}));

    await expectErrorResponse(response, HTTP_400_BAD_REQUEST);
  });

  test('should return 400 for missing request body [PATCH-BOOKS-ID-NEG-002]', async ({
    authorsApiSteps,
    booksApiRequest,
    booksApiSteps,
  }, testInfo) => {
    const disposableBook = await createBookForPatch(authorsApiSteps, booksApiSteps);
    disposableBooks.set(testInfo.testId, disposableBook);
    const requestBodyRequired = true;
    const requestBody: unknown = undefined;
    const requestBodyResult = PatchBookPayloadSchema.safeParse(requestBody);

    expect(requestBodyRequired).toBe(true);
    expect(requestBodyResult.success).toBe(false);

    const response = await booksApiRequest.patchBook(disposableBook.bookId);

    await expectErrorResponse(response, HTTP_400_BAD_REQUEST);
  });

  test('should return 400 for array body [PATCH-BOOKS-ID-NEG-003]', async ({
    authorsApiSteps,
    booksApiRequest,
    booksApiSteps,
  }, testInfo) => {
    const disposableBook = await createBookForPatch(authorsApiSteps, booksApiSteps);
    disposableBooks.set(testInfo.testId, disposableBook);
    const payload = [getRandomBookOverridePayload({ metadata: { source: 'array-body' } })];

    const requestBodyResult = PatchBookPayloadSchema.safeParse(payload);
    expect(requestBodyResult.success).toBe(false);

    const response = await booksApiRequest.patchBook(disposableBook.bookId, payload);

    await expectErrorResponse(response, HTTP_400_BAD_REQUEST);
  });

  test('should return 400 for malformed JSON [PATCH-BOOKS-ID-NEG-004]', async ({
    authorsApiSteps,
    booksApiRequest,
    booksApiSteps,
  }, testInfo) => {
    const disposableBook = await createBookForPatch(authorsApiSteps, booksApiSteps);
    disposableBooks.set(testInfo.testId, disposableBook);
    const malformedJson = '{ "metadata": ';

    expect(() => JSON.parse(malformedJson)).toThrow();

    const response = await booksApiRequest.patchBook(disposableBook.bookId, malformedJson);

    await expectErrorResponse(response, HTTP_400_BAD_REQUEST);
  });
});

test.describe('PATCH /books/{id} contract drift', { tag: ['@api', '@books', '@contract-drift'] }, () => {
  const disposableBooks = new Map<string, DisposableBook>();

  test.afterEach(async ({ authorsApiSteps, booksApiSteps }, testInfo) => {
    const disposableBook = disposableBooks.get(testInfo.testId);

    if (disposableBook === undefined) {
      return;
    }

    try {
      await booksApiSteps.deleteBook(disposableBook.bookId);
    } finally {
      await authorsApiSteps.delete(disposableBook.authorId);
      disposableBooks.delete(testInfo.testId);
    }
  });

  test('should expose server error for string-valued additional property [PATCH-BOOKS-ID-NEG-005]', async ({
    authorsApiSteps,
    booksApiRequest,
    booksApiSteps,
  }, testInfo) => {
    const disposableBook = await createBookForPatch(authorsApiSteps, booksApiSteps);
    disposableBooks.set(testInfo.testId, disposableBook);
    const payload = { metadata: 'invalid-string-value' };
    const requestBodyResult = PatchBookPayloadSchema.safeParse(payload);

    expect(requestBodyResult.success).toBe(false);

    const response = await booksApiRequest.patchBook(disposableBook.bookId, payload);

    await expectErrorResponse(response, HTTP_500_INTERNAL_SERVER_ERROR);
  });
});