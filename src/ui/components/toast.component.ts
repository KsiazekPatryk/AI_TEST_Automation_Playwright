import { Page, Locator } from '@playwright/test';

export class ToastComponent {
  readonly addSuccess: Locator;
  readonly updateSuccess: Locator;

  constructor(page: Page) {
    this.addSuccess = page.getByText('Book added successfully!');
    this.updateSuccess = page.getByText('Book updated successfully!');
  }
}
