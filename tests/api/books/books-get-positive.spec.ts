import { test, expect } from '@fixtures/test.fixture';
import { faker } from '@faker-js/faker';
import { getRandomAuthorPayload } from '@api/factories/author.factory';
import { getRandomBookOverridePayload } from '@api/factories/book.factory';
import { RestBookResponse } from '@api/models/book.model';

const FORBIDDEN_RESPONSE_KEYS = ['password', 'token', 'secret', 'apiKey'];
const DEFAULT_BOOK_DATA = { year: 2026, price: 49.99, available: 10 } as const;

type SeededBook = {
  readonly authorId: number;
  readonly authorName: string;
  readonly bookId: number;
  readonly title: string;
};

function bookMatchesTitle(book: RestBookResponse, title: string): boolean {
  return (book.title ?? '').toLowerCase().includes(title.toLowerCase());
}

function bookMatchesAuthor(book: RestBookResponse, authorName: string): boolean {
  return (book.authors ?? []).some((author) =>
    [author.firstName, author.lastName]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(authorName.toLowerCase()),
  );
}

function expectNoSensitiveFields(body: RestBookResponse[]): void {
  for (const book of body) {
    const bookKeys = Object.keys(book);
    expect(bookKeys.some((key) => FORBIDDEN_RESPONSE_KEYS.includes(key))).toBe(false);

    for (const author of book.authors ?? []) {
      const authorKeys = Object.keys(author);
      expect(authorKeys.some((key) => FORBIDDEN_RESPONSE_KEYS.includes(key))).toBe(false);
    }
  }
}

test.describe('GET /books 2xx', { tag: ['@api', '@books', '@smoke'] }, () => {
  const createdBookIds = new Map<string, number[]>();
  const createdAuthorIds = new Map<string, number[]>();

  test.afterEach(async ({ authorsApiSteps, booksApiSteps }, testInfo) => {
    for (const bookId of createdBookIds.get(testInfo.testId) ?? []) {
      await booksApiSteps.deleteBook(bookId);
    }
    createdBookIds.delete(testInfo.testId);

    for (const authorId of createdAuthorIds.get(testInfo.testId) ?? []) {
      await authorsApiSteps.delete(authorId);
    }
    createdAuthorIds.delete(testInfo.testId);
  });

  async function seedBookForFilters(
    authorsApiSteps: Parameters<Parameters<typeof test>[1]>[0]['authorsApiSteps'],
    booksApiSteps: Parameters<Parameters<typeof test>[1]>[0]['booksApiSteps'],
    testId: string,
  ): Promise<SeededBook> {
    const author = await authorsApiSteps.create(getRandomAuthorPayload());
    const title = `Filter Target ${faker.string.uuid()}`;
    const payload = getRandomBookOverridePayload({
      title,
      authors: [author.id],
      ...DEFAULT_BOOK_DATA,
    });
    const book = await booksApiSteps.createBook(payload);

    createdAuthorIds.set(testId, [...(createdAuthorIds.get(testId) ?? []), author.id]);
    createdBookIds.set(testId, [...(createdBookIds.get(testId) ?? []), book.id]);

    return {
      authorId: author.id,
      authorName: `${author.firstName} ${author.lastName}`,
      bookId: book.id,
      title,
    };
  }

  test('should retrieve all books without filters for POS-BOOKS-GET-001', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks();

    expect(Array.isArray(body)).toBe(true);
    expectNoSensitiveFields(body);
  });

  test('should retrieve books filtered by title for POS-BOOKS-GET-002', async ({ authorsApiSteps, booksApiSteps }, testInfo) => {
    const { title } = await seedBookForFilters(authorsApiSteps, booksApiSteps, testInfo.testId);
    const body = await booksApiSteps.getBooks({ title });

    expect(body.length).toBeGreaterThan(0);
    expect(body.every((book) => bookMatchesTitle(book, title))).toBe(true);
    expectNoSensitiveFields(body);
  });

  test('should retrieve books filtered by author for POS-BOOKS-GET-003', async ({ authorsApiSteps, booksApiSteps }, testInfo) => {
    const { authorName } = await seedBookForFilters(authorsApiSteps, booksApiSteps, testInfo.testId);
    const body = await booksApiSteps.getBooks({ author: authorName });

    expect(body.length).toBeGreaterThan(0);
    expect(body.every((book) => bookMatchesAuthor(book, authorName))).toBe(true);
    expectNoSensitiveFields(body);
  });

  test('should retrieve books filtered by title and author for POS-BOOKS-GET-004', async ({ authorsApiSteps, booksApiSteps }, testInfo) => {
    const { title, authorName } = await seedBookForFilters(authorsApiSteps, booksApiSteps, testInfo.testId);
    const body = await booksApiSteps.getBooks({ title, author: authorName });

    expect(body.length).toBeGreaterThan(0);
    expect(body.every((book) => bookMatchesTitle(book, title) && bookMatchesAuthor(book, authorName))).toBe(true);
    expectNoSensitiveFields(body);
  });

  test('should retrieve books with empty string query values for POS-BOOKS-GET-005', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks({ title: '', author: '' });

    expect(Array.isArray(body)).toBe(true);
    expectNoSensitiveFields(body);
  });
});