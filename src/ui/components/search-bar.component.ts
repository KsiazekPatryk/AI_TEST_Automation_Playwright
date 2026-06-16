import { Page, Locator } from '@playwright/test';

export class SearchBarComponent {
  readonly searchInput: Locator;
  readonly searchButton: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByPlaceholder('Search books by title or author...');
    this.searchButton = page.getByRole('button', { name: '🔍' });
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }
}
