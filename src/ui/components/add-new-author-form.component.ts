import { Page, Locator } from '@playwright/test';

export class AddNewAuthorFormComponent {
  readonly panelHeading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addAuthorButton: Locator;
  readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.panelHeading = page.getByRole('heading', { name: '➕ Add New Author', level: 3 });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name', exact: true });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name', exact: true });
    this.addAuthorButton = page.getByRole('button', { name: 'Add Author' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async fillForm(firstName: string, lastName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  }

  async submit(): Promise<void> {
    await this.addAuthorButton.click();
  }
}
