# Search Book by Title

---

## Steps

1. Navigate to `https://ksiegarnia.up.railway.app/`
2. Locate the search input field in the "Available Books" section
3. Type `effective java` into the search input
4. Click the search button

---

## Expected Results

- After step 1: The home page loads with a list of books visible (29 books total)
- After step 4: The book list is filtered and shows exactly 1 result
- The result card displays:
  - Title: `Effective Java`
  - Author: `Joshua Bloch`
  - Year: `2008`
  - Price: `$107.28`
  - Stock: `In stock: 100`
  - An "Add to cart" button is visible

---

## Key UI Elements

- **Search input** — text field with placeholder "Search books by title or author...", located in the "Available Books" section header
- **Search button** — icon button (magnifying glass) placed to the right of the search input
- **Book card** — a clickable card component displaying book image, title, author, year, price, stock info, and an "Add to cart" button
- **Book card title** — heading element inside the book card
- **Author line** — paragraph below the title inside the book card
- **Year line** — paragraph below the author line
- **Price** — displayed prominently in the bottom section of the card
- **Stock info** — text showing availability below the price
- **Add button** — button in the bottom-right area of the card

---

## Test Data

| Field         | Value            |
|---------------|------------------|
| Search query  | `effective java` |
| Expected title | `Effective Java` |
| Expected author | `Joshua Bloch` |
| Expected year | `2008`           |
| Expected price | `$107.28`        |
| Expected stock | `In stock: 100`  |

---

## Assertions

- The page title or heading "Available Books" is visible after navigation
- After search, the book list contains exactly 1 card
- The card heading text equals `Effective Java`
- The author text equals `Joshua Bloch`
- The year text equals `2008`
- The price text equals `$107.28`
- The stock text equals `In stock: 100`
- The "Add to cart" button is visible and enabled

---

## Notes

- Search is case-insensitive: querying `effective java` (lowercase) returns `Effective Java`
- The search filters the list client-side — no page navigation occurs after clicking search
- The book list on the home page contains 29 entries before any search is applied
- The "Add to cart" button is visible on the result card but adding to cart is outside the scope of this scenario
