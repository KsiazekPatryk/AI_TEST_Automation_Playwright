import { Page, Locator } from '@playwright/test';

export class BooksManagementPage {
  readonly heading: Locator;
  readonly addNewBookButton: Locator;
  readonly searchInput: Locator;
  readonly successToast: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: /Books Management/ });
    this.addNewBookButton = page.getByRole('button', { name: '➕ Add New Book' });
    this.searchInput = page.getByRole('textbox', { name: /Search by title or author/ });
    this.successToast = page.getByText('Book added successfully!');
  }

  async navigate(): Promise<void> {
    await this.page.goto('/books-management');
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async openAddNewBookForm(): Promise<void> {
    await this.addNewBookButton.click();
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
  }

  getBookTitleCell(title: string): Locator {
    return this.page.getByRole('cell', { name: title });
  }

  getBookAuthorCell(author: string): Locator {
    return this.page.getByRole('cell', { name: author, exact: true });
  }

  getBookRow(title: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(title) });
  }

  async openEditBook(title: string): Promise<void> {
    await this.getBookRow(title).getByRole('button', { name: '✏️' }).click();
  }
}
