import { test, expect } from '@fixtures/test.fixture';
import { QueryParams } from '@api/requests/api.request';
import { RestBookResponse } from '@api/models/book.model';
import { RestBooksSchema } from '@api/schemas/book.schema';

type ContractValidNegativeQuery = {
  readonly testId: string;
  readonly description: string;
  readonly params?: QueryParams;
};

const contractValidNegativeQueries: ContractValidNegativeQuery[] = [
  {
    testId: 'NEG-BOOKS-GET-001',
    description: 'an unlikely title value',
    params: { title: '__nonexistent_book_title_12345__' },
  },
  {
    testId: 'NEG-BOOKS-GET-002',
    description: 'an unlikely author value',
    params: { author: '__nonexistent_author_name_12345__' },
  },
  {
    testId: 'NEG-BOOKS-GET-003',
    description: 'unlikely title and author values',
    params: {
      title: '__nonexistent_book_title_12345__',
      author: '__nonexistent_author_name_12345__',
    },
  },
  {
    testId: 'NEG-BOOKS-GET-004',
    description: 'the documented base request because no negative response contract exists',
  },
];

function expectRestBooksSchema(body: RestBookResponse[]): void {
  expect(Array.isArray(body)).toBe(true);

  const result = RestBooksSchema.safeParse(body);
  expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
}

test.describe('GET /books 2xx contract-valid negative inputs', { tag: ['@api', '@books', '@regression'] }, () => {
  contractValidNegativeQueries.forEach(({ testId, description, params }) => {
    test(`should return documented response for ${description} for ${testId}`, async ({ booksApiSteps }) => {
      const body = await booksApiSteps.getBooks(params);

      expectRestBooksSchema(body);
    });
  });
});