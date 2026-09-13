import { test, expect } from '@fixtures/test.fixture';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import { HTTP_200_OK, HTTP_500_INTERNAL_SERVER_ERROR } from '@api/consts/http.status.codes.const';
import { BookResponse, PatchBookPayload } from '@api/models/book.model';
import { BookSchema, PatchBookPayloadSchema, PatchBookResponseSchema } from '@api/schemas/book.schema';
import { AuthorsAPISteps } from '@api/steps/authors/authors.api.steps';
import { BooksAPISteps } from '@api/steps/books/books.api.steps';
import { parseResponse } from '@utils/parse.response.utils';

const FORBIDDEN_RESPONSE_KEYS = ['password', 'token', 'secret', 'apiKey'];

function expectNoSensitiveFields(responseBody: Record<string, unknown>): void {
  expect(Object.keys(responseBody).some((key) => FORBIDDEN_RESPONSE_KEYS.includes(key))).toBe(false);
}

type PatchSetup = {
  readonly authorId: number;
  readonly bookId: number;
};

test.describe('PATCH /books/{id} 2xx', { tag: ['@api', '@books', '@smoke'] }, () => {
  const createdBookIds: number[] = [];
  const createdAuthorIds: number[] = [];

  async function createBookForPatch(authorsApiSteps: AuthorsAPISteps, booksApiSteps: BooksAPISteps): Promise<PatchSetup> {
    const author = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.push(author.id);

    const book = await booksApiSteps.createBook(getRandomBookOverridePayload({ authors: [author.id] }));
    createdBookIds.push(book.id);

    return { authorId: author.id, bookId: book.id };
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

  test('should send a documented minimal partial update request [PATCH-BOOKS-ID-POS-001]', async ({
    authorsApiSteps,
    booksApiSteps,
  }) => {
    const { bookId } = await createBookForPatch(authorsApiSteps, booksApiSteps);
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
});

test.describe('PATCH /books/{id} runtime behavior', { tag: ['@api', '@books', '@runtime'] }, () => {
  const createdBookIds: number[] = [];
  const createdAuthorIds: number[] = [];

  async function createBookForPatch(authorsApiSteps: AuthorsAPISteps, booksApiSteps: BooksAPISteps): Promise<PatchSetup> {
    const author = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.push(author.id);

    const book = await booksApiSteps.createBook(getRandomBookOverridePayload({ authors: [author.id] }));
    createdBookIds.push(book.id);

    return { authorId: author.id, bookId: book.id };
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

  test('should update a book title using current runtime PATCH behavior [PATCH-BOOKS-ID-POS-002]', async ({
    authorsApiSteps,
    booksApiRequest,
    booksApiSteps,
  }) => {
    const { authorId, bookId } = await createBookForPatch(authorsApiSteps, booksApiSteps);
    const updatedTitle = `Patched title ${bookId}`;
    const payload = getRandomBookOverridePayload({ title: updatedTitle, authors: [authorId], year: 2026, price: 49.99, available: 10 });

    const response = await booksApiRequest.patchBook(bookId, payload);

    expect(response.status()).toBe(HTTP_200_OK);
    expect(response.headers()['content-type']).toContain('application/json');

    const responseBody = await parseResponse<BookResponse>(response);
    const responseSchemaResult = BookSchema.safeParse(responseBody);
    expect(responseSchemaResult.success, responseSchemaResult.success ? '' : JSON.stringify(responseSchemaResult.error.issues)).toBe(true);
    expect(responseBody.title).toBe(updatedTitle);
    expectNoSensitiveFields(responseBody);

    const updatedBook = await booksApiSteps.getBookById(bookId);
    expect(updatedBook.title).toBe(updatedTitle);
  });
});

test.describe('PATCH /books/{id} contract drift', { tag: ['@api', '@books', '@contract-drift'] }, () => {
  const createdBookIds: number[] = [];
  const createdAuthorIds: number[] = [];

  async function createBookForPatch(authorsApiSteps: AuthorsAPISteps, booksApiSteps: BooksAPISteps): Promise<PatchSetup> {
    const author = await authorsApiSteps.create(getRandomAuthorPayload());
    createdAuthorIds.push(author.id);

    const book = await booksApiSteps.createBook(getRandomBookOverridePayload({ authors: [author.id] }));
    createdBookIds.push(book.id);

    return { authorId: author.id, bookId: book.id };
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

  test('should expose 500 for documented object-valued partial update request', async ({
    authorsApiSteps,
    booksApiRequest,
    booksApiSteps,
  }) => {
    const { bookId } = await createBookForPatch(authorsApiSteps, booksApiSteps);
    const payload = getRandomBookOverridePayload({ metadata: { source: 'positive-contract-test' } });

    const requestSchemaResult = PatchBookPayloadSchema.safeParse(payload);
    expect(requestSchemaResult.success, requestSchemaResult.success ? '' : JSON.stringify(requestSchemaResult.error.issues)).toBe(true);

    const response = await booksApiRequest.patchBook(bookId, payload);

    expect(response.status()).toBe(HTTP_500_INTERNAL_SERVER_ERROR);
    expect(response.headers()['content-type']).toContain('application/json');
  });
});