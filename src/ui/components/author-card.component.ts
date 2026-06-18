import { Locator } from '@playwright/test';

export class AuthorCardComponent {
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(card: Locator) {
    this.editButton = card.locator('button[title="Edit"]');
    this.deleteButton = card.locator('button[title="Delete"]');
  }
}
