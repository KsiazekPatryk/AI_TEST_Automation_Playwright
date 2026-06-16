import { test, expect } from '@fixtures/test.fixture';
import { URLS } from '@data/urls.const';

test.describe('Book listing page — search by title', { tag: ['@ui', '@search'] }, () => {
  test('search for "effective java" returns exactly one filtered result with correct details', async ({
    page,
    bookListingPage,
  }) => {
    // Arrange
    await page.goto(URLS.home);

    // Assert initial state
    await expect(bookListingPage.heading).toBeVisible();
    await expect(bookListingPage.bookCard.cards).toHaveCount(29);

    // Act
    await bookListingPage.searchBar.search('effective java');

    // Assert filtered result
    await expect(bookListingPage.bookCard.cards).toHaveCount(1);
    await expect(bookListingPage.bookCard.title).toHaveText('Effective Java');
    await expect(bookListingPage.bookCard.authors).toHaveText('Joshua Bloch');
    await expect(bookListingPage.bookCard.year).toHaveText('2008');
    await expect(bookListingPage.bookCard.price).toHaveText('$107.28');
    await expect(bookListingPage.bookCard.stock).toHaveText('In stock: 100');
    await expect(bookListingPage.bookCard.addToCartButton).toBeVisible();
    await expect(bookListingPage.bookCard.addToCartButton).toBeEnabled();
  });
});
