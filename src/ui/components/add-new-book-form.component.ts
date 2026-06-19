import { Locator } from '@playwright/test';

export class AddNewBookFormComponent {
  readonly panelHeading: Locator;
  readonly titleInput: Locator;
  readonly yearInput: Locator;
  readonly priceInput: Locator;
  readonly quantityInput: Locator;
  readonly addBookButton: Locator;
  readonly cancelButton: Locator;

  constructor(private readonly root: Locator) {
    this.panelHeading = root.getByRole('heading', { name: /Add New Book/ });
    this.titleInput = root.getByRole('textbox', { name: 'Title *' });
    this.yearInput = root.getByRole('spinbutton', { name: 'Year *' });
    this.priceInput = root.getByRole('spinbutton', { name: 'Price ($) *' });
    this.quantityInput = root.getByRole('spinbutton', { name: 'Available Quantity *' });
    this.addBookButton = root.getByRole('button', { name: 'Add Book' });
    this.cancelButton = root.getByRole('button', { name: 'Cancel' });
  }

  getAuthorCheckboxLocator(authorName: string): Locator {
    return this.root
      .getByText(authorName, { exact: true })
      .locator('..')
      .getByRole('checkbox');
  }

  async fillForm(title: string, price: string, quantity: string): Promise<void> {
    await this.titleInput.fill(title);
    await this.priceInput.fill(price);
    await this.quantityInput.fill(quantity);
  }

  async selectAuthor(authorName: string): Promise<void> {
    await this.getAuthorCheckboxLocator(authorName).click();
  }

  async submit(): Promise<void> {
    await this.addBookButton.click();
  }
}
