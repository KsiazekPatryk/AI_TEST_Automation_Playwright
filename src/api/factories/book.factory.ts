import { faker } from '@faker-js/faker';
import { BookPayload, PatchBookPayload } from '@api/models/book.model';

export function getRandomBookPayload(): BookPayload {
  return {
    title: `${faker.book.title()} ${faker.string.alphanumeric(6)}`,
    authors: [],
    year: faker.number.int({ min: 1900, max: new Date().getFullYear() }),
    price: faker.number.float({ min: 0.01, max: 1000, fractionDigits: 2 }),
    available: faker.number.int({ min: 1, max: 10000 }),
  };
}

export function getRandomBookOverridePayload<T extends Partial<BookPayload> | PatchBookPayload>(
  overrides: T,
): T extends PatchBookPayload ? PatchBookPayload : BookPayload {
  const overrideRecord: Record<string, unknown> = overrides;
  const bookPayloadKeys = ['title', 'authors', 'year', 'price', 'available'];
  const isPatchPayload = Object.entries(overrideRecord).every(
    ([key, value]) => !bookPayloadKeys.includes(key) && typeof value === 'object' && value !== null && !Array.isArray(value),
  );

  if (isPatchPayload) {
    return overrides as T extends PatchBookPayload ? PatchBookPayload : BookPayload;
  }

  return {
    ...getRandomBookPayload(),
    ...overrides,
  } as T extends PatchBookPayload ? PatchBookPayload : BookPayload;
}
