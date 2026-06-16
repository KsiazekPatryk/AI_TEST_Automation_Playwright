import { Page, Locator } from '@playwright/test';

export class BookCardComponent {
  readonly cards: Locator;
  readonly title: Locator;
  readonly authors: Locator;
  readonly year: Locator;
  readonly price: Locator;
  readonly stock: Locator;
  readonly addToCartButton: Locator;

  constructor(private readonly page: Page) {
    this.cards = page.locator('.book-card');
    this.title = page.locator('.book-title');
    this.authors = page.locator('.book-authors');
    this.year = page.locator('.book-year');
    this.price = page.locator('.book-price');
    this.stock = page.locator('.book-stock');
    this.addToCartButton = page.locator('.btn-add-cart');
  }
}
