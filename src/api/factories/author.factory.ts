import { faker } from '@faker-js/faker';
import { CreateAuthorPayload } from '@api/models/author.model';

export function getRandomAuthorPayload(overrides?: Partial<CreateAuthorPayload>): CreateAuthorPayload {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    ...overrides,
  };
}

export function getRandomAuthorOverridePayload(overrides: Partial<CreateAuthorPayload>): CreateAuthorPayload {
  return {
    ...getRandomAuthorPayload(),
    ...overrides,
  };
}
