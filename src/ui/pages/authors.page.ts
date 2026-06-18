import { Page, Locator } from '@playwright/test';
import { AuthorCardComponent } from '@ui/components/author-card.component';

export class AuthorsPage {
  readonly heading: Locator;
  readonly addNewAuthorButton: Locator;
  readonly firstExistingAuthorHeading: Locator;
  readonly authorsNavLink: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: '👥 Authors Management' });
    this.addNewAuthorButton = page.getByRole('button', { name: '➕ Add New Author' });
    this.firstExistingAuthorHeading = page.getByRole('heading', { level: 3 }).first();
    this.authorsNavLink = page.getByRole('link', { name: /^Authors/ });
  }

  async navigate(): Promise<void> {
    await this.page.goto('/');
    await this.authorsNavLink.click();
  }

  async openAddNewAuthorForm(): Promise<void> {
    await this.addNewAuthorButton.click();
  }

  getAuthorHeading(firstName: string, lastName: string): Locator {
    return this.page.getByRole('heading', { name: `${firstName} ${lastName}`, level: 3 });
  }

  getAuthorCard(firstName: string, lastName: string): Locator {
    return this.page
      .locator('div')
      .filter({ has: this.page.getByRole('heading', { name: `${firstName} ${lastName}`, level: 3 }) })
      .filter({ has: this.page.locator('button[title="Edit"]') })
      .last();
  }

  getAuthorCardComponent(firstName: string, lastName: string): AuthorCardComponent {
    return new AuthorCardComponent(this.getAuthorCard(firstName, lastName));
  }
}
