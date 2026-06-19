import { faker } from '@faker-js/faker';
import { AuthorData } from '@ui/models/author.model';

export function createAuthorData(): AuthorData {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
}
