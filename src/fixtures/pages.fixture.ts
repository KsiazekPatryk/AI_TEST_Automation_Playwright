import { test as base } from '@playwright/test';
import { BookListingPage } from '@ui/pages/book-listing.page';
import { AuthorsPage } from '@ui/pages/authors.page';
import { BooksManagementPage } from '@ui/pages/books-management.page';
import { AddNewAuthorFormComponent } from '@ui/components/add-new-author-form.component';
import { AddNewBookFormComponent } from '@ui/components/add-new-book-form.component';
import { EditBookPanelComponent } from '@ui/components/edit-book-panel.component';
import { ToastComponent } from '@ui/components/toast.component';

type Pages = {
  bookListingPage: BookListingPage;
  authorsPage: AuthorsPage;
  booksManagementPage: BooksManagementPage;
  addNewAuthorForm: AddNewAuthorFormComponent;
  addNewBookForm: AddNewBookFormComponent;
  editBookPanel: EditBookPanelComponent;
  toastComponent: ToastComponent;
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
    await use(new AddNewAuthorFormComponent(page));
  },
  addNewBookForm: async ({ page }, use) => {
    const root = page.locator('div').filter({
      has: page.getByRole('heading', { name: '➕ Add New Book', level: 3 }),
    });
    await use(new AddNewBookFormComponent(root));
  },
  editBookPanel: async ({ page }, use) => {
    await use(new EditBookPanelComponent(page));
  },
  toastComponent: async ({ page }, use) => {
    await use(new ToastComponent(page));
  },
});
