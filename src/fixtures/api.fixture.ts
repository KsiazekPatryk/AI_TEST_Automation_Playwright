import { test as base } from '@playwright/test';
import { APIRequest } from '@api/requests/api.request';
import { AuthorsAPIRequest } from '@api/requests/authors/authors.api.request';
import { AuthorsAPISteps } from '@api/steps/authors/authors.api.steps';

type ApiFixtures = {
  apiRequest: APIRequest;
  authorsApiRequest: AuthorsAPIRequest;
  authorsApiSteps: AuthorsAPISteps;
};

export const test = base.extend<ApiFixtures>({
  apiRequest: async ({ request }, use) => {
    await use(new APIRequest(request));
  },
  authorsApiRequest: async ({ apiRequest }, use) => {
    await use(new AuthorsAPIRequest(apiRequest));
  },
  authorsApiSteps: async ({ authorsApiRequest }, use) => {
    await use(new AuthorsAPISteps(authorsApiRequest));
  },
});
