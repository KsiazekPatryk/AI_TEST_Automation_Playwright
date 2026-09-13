import { test, expect } from '@fixtures/test.fixture';
import { RestBookResponse } from '@api/models/book.model';
import { RestBooksSchema } from '@api/schemas/book.schema';

function expectRestBooksSchema(body: RestBookResponse[]): void {
  expect(Array.isArray(body)).toBe(true);

  const result = RestBooksSchema.safeParse(body);
  expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
}

function getExistingTitle(books: RestBookResponse[]): string {
  const title = books.find((book) => typeof book.title === 'string' && book.title.length > 0)?.title;

  expect(title, 'expected at least one non-empty title in precondition data').toBeDefined();

  return title as string;
}

function getExistingAuthorName(books: RestBookResponse[]): string {
  const authorName = books
    .flatMap((book) => book.authors ?? [])
    .map((author) => [author.firstName, author.lastName].filter(Boolean).join(' '))
    .find((name) => name.length > 0);

  expect(authorName, 'expected at least one non-empty author name in precondition data').toBeDefined();

  return authorName as string;
}

function getExistingBookWithAuthor(books: RestBookResponse[]): { readonly title: string; readonly author: string } {
  for (const book of books) {
    const title = book.title;
    const author = book.authors
      ?.map((item) => [item.firstName, item.lastName].filter(Boolean).join(' '))
      .find((name) => name.length > 0);

    if (typeof title === 'string' && title.length > 0 && author !== undefined) {
      return { title, author };
    }
  }

  throw new Error('expected at least one book with title and author in precondition data');
}

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

test.describe('GET /books 2xx', { tag: ['@api', '@books', '@smoke'] }, () => {
  test('should retrieve all books without filters for POS-BOOKS-GET-001', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks();

    expectRestBooksSchema(body);
  });

  test('should retrieve books filtered by title for POS-BOOKS-GET-002', async ({ booksApiSteps }) => {
    const allBooks = await booksApiSteps.getBooks();
    const title = getExistingTitle(allBooks);
    const body = await booksApiSteps.getBooks({ title });

    expectRestBooksSchema(body);
    expect(body.length).toBeGreaterThan(0);
    expect(body.every((book) => bookMatchesTitle(book, title))).toBe(true);
  });

  test('should retrieve books filtered by author for POS-BOOKS-GET-003', async ({ booksApiSteps }) => {
    const allBooks = await booksApiSteps.getBooks();
    const author = getExistingAuthorName(allBooks);
    const body = await booksApiSteps.getBooks({ author });

    expectRestBooksSchema(body);
    expect(body.length).toBeGreaterThan(0);
    expect(body.every((book) => bookMatchesAuthor(book, author))).toBe(true);
  });

  test('should retrieve books filtered by title and author for POS-BOOKS-GET-004', async ({ booksApiSteps }) => {
    const allBooks = await booksApiSteps.getBooks();
    const { title, author } = getExistingBookWithAuthor(allBooks);
    const body = await booksApiSteps.getBooks({ title, author });

    expectRestBooksSchema(body);
    expect(body.length).toBeGreaterThan(0);
    expect(body.every((book) => bookMatchesTitle(book, title) && bookMatchesAuthor(book, author))).toBe(true);
  });

  test('should retrieve books with empty string query values for POS-BOOKS-GET-005', async ({ booksApiSteps }) => {
    const body = await booksApiSteps.getBooks({ title: '', author: '' });

    expectRestBooksSchema(body);
  });
});