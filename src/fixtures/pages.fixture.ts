import { test as base } from '@playwright/test';
import { BookListingPage } from '@ui/pages/book-listing.page';

type Pages = {
  bookListingPage: BookListingPage;
};

export const test = base.extend<Pages>({
  bookListingPage: async ({ page }, use) => {
    await use(new BookListingPage(page));
  },
});

export { expect } from '@playwright/test';
