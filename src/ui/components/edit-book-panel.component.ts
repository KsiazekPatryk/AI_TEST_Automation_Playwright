import { Page, Locator } from '@playwright/test';

export class EditBookPanelComponent {
  readonly heading: Locator;
  readonly updateButton: Locator;
  private readonly root: Locator;

  constructor(page: Page) {
    this.heading = page.getByRole('heading', { name: /Edit Book/ });
    this.root = this.heading.locator('../..');
    this.updateButton = this.root.getByRole('button', { name: 'Update Book' });
  }

  getAuthorItem(authorName: string): Locator {
    return this.root.locator('.author-checkbox').filter({ hasText: authorName });
  }

  getAuthorCheckbox(authorName: string): Locator {
    return this.getAuthorItem(authorName).getByRole('checkbox');
  }

  async toggleAuthor(authorName: string): Promise<void> {
    await this.getAuthorItem(authorName).click();
  }

  async submit(): Promise<void> {
    await this.updateButton.click();
  }
}
