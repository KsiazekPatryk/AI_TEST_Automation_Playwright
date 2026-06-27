import { test, expect } from '@fixtures/test.fixture';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { AuthorResponse } from '@api/models/author.model';
import { API_ENDPOINTS } from '@api/consts/api.endpoints.const';
import { APIPayload } from '@api/requests/api.request';
import { HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND } from '@api/consts/http.status.codes.const';

test.describe('PUT /books/{id} 4xx', { tag: ['@api', '@books', '@regression'] }, () => {
  let authorA: AuthorResponse;
  let bookId: number;

  test.beforeAll(async ({ authorsApiSteps, booksApiSteps }) => {
    authorA = await authorsApiSteps.create(getRandomAuthorPayload());
    const book = await booksApiSteps.createBook(getRandomBookOverridePayload({ authors: [authorA.id] }));
    bookId = book.id;
  });

  test.afterAll(async ({ authorsApiSteps, booksApiSteps }) => {
    if (bookId) {
      await booksApiSteps.deleteBook(bookId);
    }
    if (authorA?.id) {
      await authorsApiSteps.delete(authorA.id);
    }
  });

  test('should return 400 when required field authors is missing', async ({ apiRequest }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id] }) as Record<string, unknown>;
    delete payload.authors;

    const response = await apiRequest.put(API_ENDPOINTS.books.byId(bookId), payload as APIPayload);

    expect(response.status()).toBe(HTTP_400_BAD_REQUEST);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return 400 when price is below minimum boundary', async ({ apiRequest }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], price: 0.99, available: 5, year: 2020 });

    const response = await apiRequest.put(API_ENDPOINTS.books.byId(bookId), payload as APIPayload);

    expect(response.status()).toBe(HTTP_400_BAD_REQUEST);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return 400 when available is above maximum boundary', async ({ apiRequest }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], price: 20, available: 10001, year: 2020 });

    const response = await apiRequest.put(API_ENDPOINTS.books.byId(bookId), payload as APIPayload);

    expect(response.status()).toBe(HTTP_400_BAD_REQUEST);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return 400 when title is missing', async ({ apiRequest }) => {
    const payload = getRandomBookOverridePayload({
      authors: [authorA.id],
      price: 20,
      available: 5,
      year: 2020,
    }) as Record<string, unknown>;
    delete payload.title;

    const response = await apiRequest.put(API_ENDPOINTS.books.byId(bookId), payload as APIPayload);

    expect(response.status()).toBe(HTTP_400_BAD_REQUEST);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return 404 when book id does not exist', async ({ apiRequest }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], price: 25, available: 3, year: 2019 });

    const response = await apiRequest.put(API_ENDPOINTS.books.byId(999999999), payload as APIPayload);

    expect(response.status()).toBe(HTTP_404_NOT_FOUND);
  });
});
