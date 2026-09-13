import { test, expect } from '@fixtures/test.fixture';
import { QueryParams } from '@api/requests/api.request';
import { RestBookResponse } from '@api/models/book.model';
import { faker } from '@faker-js/faker';

const FORBIDDEN_RESPONSE_KEYS = ['password', 'token', 'secret', 'apiKey'];

function getNonExistentValue(label: string): string {
  return `__nonexistent_${label}_${faker.string.uuid()}__`;
}

type ContractValidNegativeQuery = {
  readonly testId: string;
  readonly description: string;
  readonly buildParams: () => QueryParams;
  readonly expectEmptyResult: boolean;
};

const contractValidNegativeQueries: ContractValidNegativeQuery[] = [
  {
    testId: 'NEG-BOOKS-GET-001',
    description: 'an unlikely title value',
    buildParams: () => ({ title: getNonExistentValue('book_title') }),
    expectEmptyResult: true,
  },
  {
    testId: 'NEG-BOOKS-GET-002',
    description: 'an unlikely author value',
    buildParams: () => ({ author: getNonExistentValue('author_name') }),
    expectEmptyResult: true,
  },
  {
    testId: 'NEG-BOOKS-GET-003',
    description: 'unlikely title and author values',
    buildParams: () => ({
      title: getNonExistentValue('book_title'),
      author: getNonExistentValue('author_name'),
    }),
    expectEmptyResult: true,
  },
  {
    testId: 'NEG-BOOKS-GET-004',
    description: 'an unsupported query key',
    buildParams: () => ({ unsupportedKey: getNonExistentValue('unsupported_key') }),
    expectEmptyResult: false,
  },
  {
    testId: 'NEG-BOOKS-GET-005',
    description: 'SQL-like and XSS-like query values',
    buildParams: () => ({ title: `"' OR 1=1 -- <script>${faker.string.uuid()}</script>` }),
    expectEmptyResult: true,
  },
];

function expectRestBooksResponse(body: RestBookResponse[]): void {
  expect(Array.isArray(body)).toBe(true);

  for (const book of body) {
    const bookKeys = Object.keys(book);
    expect(bookKeys.some((key) => FORBIDDEN_RESPONSE_KEYS.includes(key))).toBe(false);

    for (const author of book.authors ?? []) {
      const authorKeys = Object.keys(author);
      expect(authorKeys.some((key) => FORBIDDEN_RESPONSE_KEYS.includes(key))).toBe(false);
    }
  }
}

test.describe('GET /books 2xx contract-valid negative inputs', { tag: ['@api', '@books', '@regression'] }, () => {
  contractValidNegativeQueries.forEach(({ testId, description, buildParams, expectEmptyResult }) => {
    test(`should return documented response for ${description} for ${testId}`, async ({ booksApiSteps }) => {
      const params = buildParams();
      const body = await booksApiSteps.getBooks(params);

      expectRestBooksResponse(body);

      if (expectEmptyResult) {
        expect(body).toHaveLength(0);
      }
    });
  });
});