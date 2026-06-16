import { test, expect } from '@fixtures/test.fixture';
import { BOOKS, BOOK_CATALOG_TOTAL_COUNT } from '@data/books.const';

test.describe('Book listing page - search by title', { tag: ['@ui', '@search'] }, () => {
  test.beforeEach(async ({ bookListingPage }) => {
    await bookListingPage.navigate();
  });

  test('should return one result with correct details when searching by exact book title', async ({
    bookListingPage,
  }) => {
    // Arrange
    await expect(bookListingPage.heading, 'book listing heading should be visible on load').toBeVisible();
    await expect(bookListingPage.bookCard.cards, 'full catalog should contain all books').toHaveCount(BOOK_CATALOG_TOTAL_COUNT);

    // Act
    await bookListingPage.searchBar.search(BOOKS.EFFECTIVE_JAVA.searchTerm);

    // Assert
    await expect(bookListingPage.bookCard.cards, 'search should return exactly one result').toHaveCount(1);
    await expect.soft(bookListingPage.bookCard.title, 'book title should match').toHaveText(BOOKS.EFFECTIVE_JAVA.title);
    await expect.soft(bookListingPage.bookCard.authors, 'author should match').toHaveText(BOOKS.EFFECTIVE_JAVA.author);
    await expect.soft(bookListingPage.bookCard.year, 'publication year should match').toHaveText(BOOKS.EFFECTIVE_JAVA.year);
    await expect.soft(bookListingPage.bookCard.price, 'book price should match').toHaveText(BOOKS.EFFECTIVE_JAVA.price);
    await expect.soft(bookListingPage.bookCard.stock, 'stock label should match').toHaveText(BOOKS.EFFECTIVE_JAVA.stock);
    await expect.soft(bookListingPage.bookCard.addToCartButton, '"Add to cart" button should be visible').toBeVisible();
    await expect.soft(bookListingPage.bookCard.addToCartButton, '"Add to cart" button should be enabled').toBeEnabled();
  });
});
