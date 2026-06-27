import { test, expect } from '@fixtures/test.fixture';
import { faker } from '@faker-js/faker';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import { BookResponse } from '@api/models/book.model';
import { AuthorResponse } from '@api/models/author.model';

type NumericBoundaryField = 'price' | 'available' | 'year';

test.describe('POST /books 2xx', { tag: ['@api', '@books', '@smoke'] }, () => {
  let authorA: AuthorResponse;
  let authorB: AuthorResponse;
  const createdBookIds: number[] = [];
  const currentYear = new Date().getFullYear();

  const boundaryCases: ReadonlyArray<{
    readonly name: string;
    readonly field: NumericBoundaryField;
    readonly value: number;
  }> = [
    { name: 'price at minimum boundary (0.01)', field: 'price', value: 0.01 },
    { name: 'price at maximum boundary (1000)', field: 'price', value: 1000 },
    { name: 'available at minimum boundary (1)', field: 'available', value: 1 },
    { name: 'available at maximum boundary (10000)', field: 'available', value: 10000 },
    { name: 'year at minimum boundary (1900)', field: 'year', value: 1900 },
    { name: `year set to current year (${currentYear})`, field: 'year', value: currentYear },
  ];

  test.beforeAll(async ({ authorsApiSteps }) => {
    authorA = await authorsApiSteps.create({
      firstName: faker.string.alpha({ length: 8 }),
      lastName: faker.string.alpha({ length: 10 }),
    });
    authorB = await authorsApiSteps.create({
      firstName: faker.string.alpha({ length: 7 }),
      lastName: faker.string.alpha({ length: 9 }),
    });
  });

  test.afterAll(async ({ authorsApiSteps }) => {
    if (authorA?.id) {
      await authorsApiSteps.delete(authorA.id);
    }
    if (authorB?.id) {
      await authorsApiSteps.delete(authorB.id);
    }
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
      expect(book.authors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: authorA.id }),
          expect.objectContaining({ id: authorB.id }),
        ]),
      );
    });
  });

  boundaryCases.forEach(({ name, field, value }) => {
    test(`should create a book with ${name}`, async ({ booksApiSteps }) => {
      const payload = getRandomBookOverridePayload({ authors: [authorA.id], [field]: value });

      const book: BookResponse = await test.step(`POST /books with ${field}=${value}`, () =>
        booksApiSteps.createBook(payload),
      );
      createdBookIds.push(book.id);

      expect(book[field]).toBe(value);
    });
  });

  test('should persist the created book and be retrievable via GET /books/{id} with identical data', async ({ booksApiSteps }) => {
    const payload = getRandomBookOverridePayload({ authors: [authorA.id], year: 2021, price: 35, available: 25 });

    const created: BookResponse = await test.step('POST /books', () => booksApiSteps.createBook(payload));
    createdBookIds.push(created.id);

    const retrieved: BookResponse = await test.step(`GET /books/${created.id}`, () =>
      booksApiSteps.getBookById(created.id),
    );

    await test.step('assert retrieved data matches created data', () => {
      expect(retrieved.id).toBe(created.id);
      expect(retrieved.title).toBe(payload.title);
      expect(retrieved.year).toBe(2021);
      expect(retrieved.price).toBe(35);
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

