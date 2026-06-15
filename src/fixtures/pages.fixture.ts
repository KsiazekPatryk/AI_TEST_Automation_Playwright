import { test as base } from '@playwright/test';
// import { ExamplePage } from '@ui/pages/example.page';
// import { ExampleModalComponent } from '@ui/components/example-modal.component';

type Pages = {
  // examplePage: ExamplePage;
  // exampleModal: ExampleModalComponent;
};

export const test = base.extend<Pages>({
  // examplePage: async ({ page }, use) => {
  //   await use(new ExamplePage(page));
  // },
  // exampleModal: async ({ page }, use) => {
  //   await use(new ExampleModalComponent(page));
  // },
});

export { expect } from '@playwright/test';
