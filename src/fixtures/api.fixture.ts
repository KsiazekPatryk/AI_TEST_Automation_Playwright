import { test as base } from '@playwright/test';
import { APIRequest } from '@api/requests/api.request';
// import { ResourceAPIRequest } from '@api/requests/resource/resource.api.request';
// import { ResourceAPISteps } from '@api/steps/resource/resource.api.steps';

type ApiFixtures = {
  apiRequest: APIRequest;
  // resourceApiRequest: ResourceAPIRequest;
  // resourceApiSteps: ResourceAPISteps;
};

export const test = base.extend<ApiFixtures>({
  apiRequest: async ({ request }, use) => {
    await use(new APIRequest(request));
  },
  // resourceApiRequest: async ({ apiRequest }, use) => {
  //   await use(new ResourceAPIRequest(apiRequest));
  // },
  // resourceApiSteps: async ({ resourceApiRequest }, use) => {
  //   await use(new ResourceAPISteps(resourceApiRequest));
  // },
});
