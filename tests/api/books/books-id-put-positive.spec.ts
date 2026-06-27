import { test, expect } from '@fixtures/test.fixture';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { BookResponse } from '@api/models/book.model';
import { AuthorResponse } from '@api/models/author.model';

test.describe('PUT /books/{id} 2xx', { tag: ['@api', '@books', '@smoke'] }, () => {
  let authorA: AuthorResponse;
  let authorB: AuthorResponse;
  let bookId: number;

  const assertBookMatchesPayload = (
    book: BookResponse,
    payload: { title: string; year: number; price: number; available: number },
    expectedAuthorIds: number[],
  ): void => {
    expect(book.id).toBe(bookId);
    expect(book.title).toBe(payload.title);
    expect(book.year).toBe(payload.year);
    expect(book.price).toBe(payload.price);
    expect(book.available).toBe(payload.available);
    expect(book.authors).toEqual(
      expect.arrayContaining(expectedAuthorIds.map((id) => expect.objectContaining({ id }))),
    );
  };

  test.beforeAll(async ({ authorsApiSteps, booksApiSteps }) => {
    authorA = await authorsApiSteps.create(getRandomAuthorPayload());
    authorB = await authorsApiSteps.create(getRandomAuthorPayload());
    const book = await booksApiSteps.createBook(
      getRandomBookOverridePayload({ authors: [authorA.id] }),
    );
    bookId = book.id;
  });

  test.afterAll(async ({ authorsApiSteps, booksApiSteps }) => {
    if (bookId) {
      await booksApiSteps.deleteBook(bookId);
    }
    if (authorA?.id) {
      await authorsApiSteps.delete(authorA.id);
    }
    if (authorB?.id) {
      await authorsApiSteps.delete(authorB.id);
    }
  });

  // TC-POS-PUT-001
  test('should update book with all required fields and return 200', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id] });
    const book = await booksApiSteps.updateBook(bookId, payload);
    assertBookMatchesPayload(book, payload, [authorA.id]);
  });

  // TC-POS-PUT-002
  test('should update book with optional title included and return 200', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({
      title: `put-title-${Date.now()}`,
      authors: [authorA.id],
      available: 25,
      price: 45,
      year: 2008,
    });
    const book = await booksApiSteps.updateBook(bookId, payload);
    assertBookMatchesPayload(book, payload, [authorA.id]);

    const persisted = await booksApiSteps.getBookById(bookId);
    expect(persisted.title).toBe(payload.title);
  });

  // TC-POS-PUT-003 to TC-POS-PUT-006 — boundary tests
  const boundaryDataset = [
    { description: 'price at minimum boundary (1)', overrides: { price: 1, available: 5, year: 2021 } },
    { description: 'price at maximum boundary (10000)', overrides: { price: 10000, available: 5, year: 2021 } },
    { description: 'available at minimum boundary (1)', overrides: { available: 1, price: 20, year: 2021 } },
    { description: 'available at maximum boundary (10000)', overrides: { available: 10000, price: 20, year: 2021 } },
  ];

  boundaryDataset.forEach(({ description, overrides }) => {
    test(`should update book with ${description} and return 200`, async ({ booksApiSteps }) => {
      const payload = getRandomBookOverridePayload({ authors: [authorA.id], ...overrides });
      const updated = await booksApiSteps.updateBook(bookId, payload);
      assertBookMatchesPayload(updated, payload, [authorA.id]);

      const persisted = await booksApiSteps.getBookById(bookId);
      expect(persisted.year).toBe(payload.year);
      expect(persisted.price).toBe(payload.price);
      expect(persisted.available).toBe(payload.available);
    });
  });

  // TC-POS-PUT-007
  test('should update book with multiple unique authors and return 200', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({
      authors: [authorA.id, authorB.id],
      available: 50,
      price: 55,
      year: 2017,
    });
    const updated = await booksApiSteps.updateBook(bookId, payload);
    assertBookMatchesPayload(updated, payload, [authorA.id, authorB.id]);
  });

  // TC-POS-PUT-008
  test('should update book twice with same payload and return 200 both times (idempotent)', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], available: 15, price: 39.99, year: 1999 });
    const first = await booksApiSteps.updateBook(bookId, payload);
    const second = await booksApiSteps.updateBook(bookId, payload);
    const persisted = await booksApiSteps.getBookById(bookId);

    expect(first.id).toBe(second.id);
    assertBookMatchesPayload(persisted, payload, [authorA.id]);
  });

  // TC-POS-PUT-009
  test('should update book with current calendar year and return 200', async ({ booksApiSteps }) => {
    const currentYear = new Date().getFullYear();
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], available: 5, price: 19.99, year: currentYear });
    const updated = await booksApiSteps.updateBook(bookId, payload);
    expect(updated.year).toBe(currentYear);
  });

  // TC-POS-PUT-010
  test('should persist updated book data verified via GET /books/{id}', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], available: 30, price: 59.99, year: 2003 });
    await booksApiSteps.updateBook(bookId, payload);

    const book: BookResponse = await booksApiSteps.getBookById(bookId);
    expect(book.title).toBe(payload.title);
    expect(book.year).toBe(2003);
    expect(book.price).toBe(59.99);
    expect(book.available).toBe(30);
    expect(book.authors.some((a) => a.id === authorA.id)).toBe(true);
  });

  // TC-POS-PUT-011
  test('should update book with price as decimal (two decimal places) and return 200', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], available: 5, price: 49.99, year: 2022 });
    const updated = await booksApiSteps.updateBook(bookId, payload);
    expect(updated.price).toBe(49.99);
  });
});

