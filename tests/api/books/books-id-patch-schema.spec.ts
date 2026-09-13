import { test, expect } from '@fixtures/test.fixture';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import { HTTP_500_INTERNAL_SERVER_ERROR } from '@api/consts/http.status.codes.const';
import { PatchBookPayload } from '@api/models/book.model';
import { PatchBookPayloadSchema, PatchBookResponseSchema } from '@api/schemas/book.schema';
import { AuthorsAPISteps } from '@api/steps/authors/authors.api.steps';
import { BooksAPISteps } from '@api/steps/books/books.api.steps';

const FORBIDDEN_RESPONSE_KEYS = ['password', 'token', 'secret', 'apiKey'];

function expectNoSensitiveFields(responseBody: Record<string, unknown>): void {
  expect(Object.keys(responseBody).some((key) => FORBIDDEN_RESPONSE_KEYS.includes(key))).toBe(false);
}

test.describe('PATCH /books/{id} schema', { tag: ['@api', '@books', '@schema', '@smoke'] }, () => {
  const createdBookIds: number[] = [];
  const createdAuthorIds: number[] = [];

  async function createBookForPatch(authorsApiSteps: AuthorsAPISteps, booksApiSteps: BooksAPISteps): Promise<number> {
    const author = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.push(author.id);

    const book = await booksApiSteps.createBook(getRandomBookOverridePayload({ authors: [author.id] }));
    createdBookIds.push(book.id);

    return book.id;
  }

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

  test('should accept minimal documented request body [PATCH-BOOKS-ID-SCHEMA-001]', async ({
    authorsApiSteps,
    booksApiSteps,
  }) => {
    const bookId = await createBookForPatch(authorsApiSteps, booksApiSteps);
    const payload = getRandomBookOverridePayload({} satisfies PatchBookPayload);

    const requestSchemaResult = PatchBookPayloadSchema.safeParse(payload);
    expect(requestSchemaResult.success, requestSchemaResult.success ? '' : JSON.stringify(requestSchemaResult.error.issues)).toBe(true);

    const responseBody = await booksApiSteps.patchBook(bookId, payload);
    const responseSchemaResult = PatchBookResponseSchema.safeParse(responseBody);
    expect(responseSchemaResult.success, responseSchemaResult.success ? '' : JSON.stringify(responseSchemaResult.error.issues)).toBe(true);
    expectNoSensitiveFields(responseBody);

    const updatedBook = await booksApiSteps.getBookById(bookId);
    expect(updatedBook.id).toBe(bookId);
  });

  test('should validate successful response contract for minimal partial update [PATCH-BOOKS-ID-SCHEMA-002]', async ({
    authorsApiSteps,
    booksApiSteps,
  }) => {
    const bookId = await createBookForPatch(authorsApiSteps, booksApiSteps);
    const payload = getRandomBookOverridePayload({} satisfies PatchBookPayload);

    const requestSchemaResult = PatchBookPayloadSchema.safeParse(payload);
    expect(requestSchemaResult.success, requestSchemaResult.success ? '' : JSON.stringify(requestSchemaResult.error.issues)).toBe(true);

    const responseBody = await booksApiSteps.patchBook(bookId, payload);
    const responseSchemaResult = PatchBookResponseSchema.safeParse(responseBody);
    expect(responseSchemaResult.success, responseSchemaResult.success ? '' : JSON.stringify(responseSchemaResult.error.issues)).toBe(true);
    expectNoSensitiveFields(responseBody);
  });
});

test.describe('PATCH /books/{id} schema contract drift', { tag: ['@api', '@books', '@schema', '@contract-drift'] }, () => {
  const createdBookIds: number[] = [];
  const createdAuthorIds: number[] = [];

  async function createBookForPatch(authorsApiSteps: AuthorsAPISteps, booksApiSteps: BooksAPISteps): Promise<number> {
    const author = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.push(author.id);

    const book = await booksApiSteps.createBook(getRandomBookOverridePayload({ authors: [author.id] }));
    createdBookIds.push(book.id);

    return book.id;
  }

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

  test('should expose 500 for documented object-valued response contract', async ({
    authorsApiSteps,
    booksApiRequest,
    booksApiSteps,
  }) => {
    const bookId = await createBookForPatch(authorsApiSteps, booksApiSteps);
    const payload = getRandomBookOverridePayload({ metadata: { source: 'contract-test' } });

    const requestSchemaResult = PatchBookPayloadSchema.safeParse(payload);
    expect(requestSchemaResult.success, requestSchemaResult.success ? '' : JSON.stringify(requestSchemaResult.error.issues)).toBe(true);

    const response = await booksApiRequest.patchBook(bookId, payload);

    expect(response.status()).toBe(HTTP_500_INTERNAL_SERVER_ERROR);
    expect(response.headers()['content-type']).toContain('application/json');
  });
});