import { test as base } from '@playwright/test';
import { BookListingPage } from '@ui/pages/book-listing.page';
import { AuthorsPage } from '@ui/pages/authors.page';
import { BooksManagementPage } from '@ui/pages/books-management.page';
import { AddNewAuthorFormComponent } from '@ui/components/add-new-author-form.component';
import { AddNewBookFormComponent } from '@ui/components/add-new-book-form.component';

type Pages = {
  bookListingPage: BookListingPage;
  authorsPage: AuthorsPage;
  booksManagementPage: BooksManagementPage;
  addNewAuthorForm: AddNewAuthorFormComponent;
  addNewBookForm: AddNewBookFormComponent;
};

export const test = base.extend<Pages>({
  bookListingPage: async ({ page }, use) => {
    await use(new BookListingPage(page));
  },
  authorsPage: async ({ page }, use) => {
    await use(new AuthorsPage(page));
  },
  booksManagementPage: async ({ page }, use) => {
    await use(new BooksManagementPage(page));
  },
  addNewAuthorForm: async ({ page }, use) => {
    const root = page.locator('div').filter({
      has: page.getByRole('heading', { name: /Add New Author/, level: 3 }),
    });
    await use(new AddNewAuthorFormComponent(root));
  },
  addNewBookForm: async ({ page }, use) => {
    const root = page.locator('div').filter({
      has: page.getByRole('heading', { name: '➕ Add New Book', level: 3 }),
    });
    await use(new AddNewBookFormComponent(root));
  },
});
