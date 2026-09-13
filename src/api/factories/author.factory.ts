import { faker } from '@faker-js/faker';
import { CreateAuthorPayload, PatchAuthorPayload } from '@api/models/author.model';

export function getRandomAuthorPayload(overrides?: Partial<CreateAuthorPayload>): CreateAuthorPayload {
  return {
    firstName: faker.person.firstName().replaceAll("'", ''),
    lastName: faker.person.lastName().replaceAll("'", ''),
    ...overrides,
  };
}

export function getRandomAuthorOverridePayload<T extends Partial<CreateAuthorPayload> | PatchAuthorPayload>(
  overrides: T,
): T extends PatchAuthorPayload ? PatchAuthorPayload : CreateAuthorPayload {
  return overrides as T extends PatchAuthorPayload ? PatchAuthorPayload : CreateAuthorPayload;
}
