import { test as base } from '@playwright/test';
import { BookListingPage } from '@ui/pages/book-listing.page';
import { AuthorsPage } from '@ui/pages/authors.page';
import { AddNewAuthorFormComponent } from '@ui/components/add-new-author-form.component';

type Pages = {
  bookListingPage: BookListingPage;
  authorsPage: AuthorsPage;
  addNewAuthorForm: AddNewAuthorFormComponent;
};

export const test = base.extend<Pages>({
  bookListingPage: async ({ page }, use) => {
    await use(new BookListingPage(page));
  },
  authorsPage: async ({ page }, use) => {
    await use(new AuthorsPage(page));
  },
  addNewAuthorForm: async ({ page }, use) => {
    await use(new AddNewAuthorFormComponent(page));
  },
});
