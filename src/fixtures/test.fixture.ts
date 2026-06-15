import { mergeTests } from '@playwright/test';
import { test as apiLogger } from '@fixtures/api.logger.fixture';
import { test as apiRequests } from '@fixtures/api.fixture';
import { test as pages } from '@fixtures/pages.fixture';

export const test = mergeTests(apiLogger, apiRequests, pages);

export { expect } from '@playwright/test';
