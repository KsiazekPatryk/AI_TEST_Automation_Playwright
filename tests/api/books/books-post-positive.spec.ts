import { test, expect } from '@fixtures/test.fixture';
import { faker } from '@faker-js/faker';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import { BookResponse } from '@api/models/book.model';
import { AuthorResponse } from '@api/models/author.model';

test.describe('POST /books 2xx', { tag: ['@api', '@books', '@smoke'] }, () => {
  let authorA: AuthorResponse;
  let authorB: AuthorResponse;
  const createdBookIds: number[] = [];

  test.beforeAll(async ({ authorsApiSteps }) => {
    authorA = await authorsApiSteps.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    });
    authorB = await authorsApiSteps.create({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    });
  });

  test.afterAll(async ({ authorsApiSteps }) => {
    await authorsApiSteps.delete(authorA.id);
    await authorsApiSteps.delete(authorB.id);
  });

  test.afterEach(async ({ booksApiSteps }) => {
    for (const id of createdBookIds) {
      await booksApiSteps.deleteBook(id);
    }
    createdBookIds.length = 0;
  });

  test('should create a book with all required fields and return 201 with correct body', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], year: 2022, price: 49.99, available: 100 });

    const book: BookResponse = await test.step('POST /books', () => booksApiSteps.createBook(payload));
    createdBookIds.push(book.id);

    await test.step('assert response body', () => {
      expect(book.id).toBeGreaterThan(0);
      expect(book.title).toBe(payload.title);
      expect(book.year).toBe(2022);
      expect(book.price).toBe(49.99);
      expect(book.coverId).toBeNull();
      expect(book.available).toBe(100);
      expect(book.authors).toHaveLength(1);
      expect(book.authors[0].id).toBe(authorA.id);
      expect(typeof book.authors[0].firstName).toBe('string');
      expect(book.authors[0].firstName.length).toBeGreaterThan(0);
      expect(typeof book.authors[0].lastName).toBe('string');
      expect(book.authors[0].lastName.length).toBeGreaterThan(0);
    });
  });

  test('should create a book with multiple authors and return all authors in response', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id, authorB.id] });

    const book: BookResponse = await test.step('POST /books with two authors', () => booksApiSteps.createBook(payload));
    createdBookIds.push(book.id);

    await test.step('assert both authors are present', () => {
      expect(book.authors).toHaveLength(2);
      expect(book.authors.some(a => a.id === authorA.id)).toBe(true);
      expect(book.authors.some(a => a.id === authorB.id)).toBe(true);
    });
  });

  test('should create a book with price at minimum boundary (0.01)', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], price: 0.01 });

    const book: BookResponse = await test.step('POST /books with price=0.01', () => booksApiSteps.createBook(payload));
    createdBookIds.push(book.id);

    expect(book.price).toBe(0.01);
  });

  test('should create a book with price at maximum boundary (1000)', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], price: 1000 });

    const book: BookResponse = await test.step('POST /books with price=1000', () => booksApiSteps.createBook(payload));
    createdBookIds.push(book.id);

    expect(book.price).toBe(1000);
  });

  test('should create a book with available at minimum boundary (1)', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], available: 1 });

    const book: BookResponse = await test.step('POST /books with available=1', () => booksApiSteps.createBook(payload));
    createdBookIds.push(book.id);

    expect(book.available).toBe(1);
  });

  test('should create a book with available at maximum boundary (10000)', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], available: 10000 });

    const book: BookResponse = await test.step('POST /books with available=10000', () => booksApiSteps.createBook(payload));
    createdBookIds.push(book.id);

    expect(book.available).toBe(10000);
  });

  test('should create a book with year at minimum boundary (1900)', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], year: 1900 });

    const book: BookResponse = await test.step('POST /books with year=1900', () => booksApiSteps.createBook(payload));
    createdBookIds.push(book.id);

    expect(book.year).toBe(1900);
  });

  test('should create a book with year set to current year (2026)', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], year: 2026 });

    const book: BookResponse = await test.step('POST /books with year=2026', () => booksApiSteps.createBook(payload));
    createdBookIds.push(book.id);

    expect(book.year).toBe(2026);
  });

  test('should persist the created book and be retrievable via GET /books/{id} with identical data', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], year: 2021, price: 35.0, available: 25 });

    const created: BookResponse = await test.step('POST /books', () => booksApiSteps.createBook(payload));
    createdBookIds.push(created.id);

    const retrieved: BookResponse = await test.step(`GET /books/${created.id}`, () =>
      booksApiSteps.getBookById(created.id),
    );

    await test.step('assert retrieved data matches created data', () => {
      expect(retrieved.id).toBe(created.id);
      expect(retrieved.title).toBe(payload.title);
      expect(retrieved.year).toBe(2021);
      expect(retrieved.price).toBe(35.0);
      expect(retrieved.available).toBe(25);
      expect(retrieved.authors[0].id).toBe(authorA.id);
    });
  });

  test('should store and return a decimal price value correctly', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], price: 19.95 });

    const book: BookResponse = await test.step('POST /books with price=19.95', () => booksApiSteps.createBook(payload));
    createdBookIds.push(book.id);

    expect(book.price).toBe(19.95);
  });
});

