import { Page, Locator } from '@playwright/test';
import { SearchBarComponent } from '@ui/components/search-bar.component';
import { BookCardComponent } from '@ui/components/book-card.component';

export class BookListingPage {
  readonly heading: Locator;
  readonly searchBar: SearchBarComponent;
  readonly bookCard: BookCardComponent;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Available Books' });
    this.searchBar = new SearchBarComponent(page);
    this.bookCard = new BookCardComponent(page);
  }
}
