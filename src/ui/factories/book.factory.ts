import { faker } from '@faker-js/faker';
import { BookData } from '@ui/models/book.model';

export function createBookData(): BookData {
  return {
    title: faker.commerce.productName(),
    price: '100',
    quantity: '100',
  };
}
