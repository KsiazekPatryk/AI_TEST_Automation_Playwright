import { faker } from '@faker-js/faker';
import { BookPayload } from '@api/models/book.model';

export function getRandomBookPayload(): BookPayload {
  return {
    title: `${faker.book.title()} ${faker.string.alphanumeric(6)}`,
    authors: [],
    year: faker.number.int({ min: 1900, max: new Date().getFullYear() }),
    price: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
    available: faker.number.int({ min: 1, max: 10000 }),
  };
}

export function getRandomBookOverridePayload(overrides: Partial<BookPayload>): BookPayload {
  return {
    ...getRandomBookPayload(),
    ...overrides,
  };
}
