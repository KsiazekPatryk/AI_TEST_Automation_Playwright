import { test as base, APIRequestContext } from '@playwright/test';
import { APIRequest } from '@api/requests/api.request';
import { AuthorsAPIRequest } from '@api/requests/authors/authors.api.request';
import { AuthorsAPISteps } from '@api/steps/authors/authors.api.steps';
import { BooksAPIRequest } from '@api/requests/books/books.api.request';
import { BooksAPISteps } from '@api/steps/books/books.api.steps';

type ApiFixtures = {
  apiContext: APIRequestContext;
  apiRequest: APIRequest;
  authorsApiRequest: AuthorsAPIRequest;
  authorsApiSteps: AuthorsAPISteps;
  booksApiRequest: BooksAPIRequest;
  booksApiSteps: BooksAPISteps;
};

export const test = base.extend<ApiFixtures>({
  apiContext: async ({ playwright }, use) => {
    const ctx = await playwright.request.newContext({
      baseURL: process.env.API_URL,
    });
    await use(ctx);
    await ctx.dispose();
  },
  apiRequest: async ({ apiContext }, use) => {
    await use(new APIRequest(apiContext));
  },
  authorsApiRequest: async ({ apiRequest }, use) => {
    await use(new AuthorsAPIRequest(apiRequest));
  },
  authorsApiSteps: async ({ authorsApiRequest }, use) => {
    await use(new AuthorsAPISteps(authorsApiRequest));
  },
  booksApiRequest: async ({ apiRequest }, use) => {
    await use(new BooksAPIRequest(apiRequest));
  },
  booksApiSteps: async ({ booksApiRequest }, use) => {
    await use(new BooksAPISteps(booksApiRequest));
  },
});
