# Page Knowledge: Books Listing & Management Page

## Overview
- **URL Path:** `/` (default landing page)
- **Purpose:** Displays available books, search filters, and triggers for adding/editing books.

## DOM Structure & Key Locators

| Component | Semantic Locator Strategy | Notes / Quirks |
| :--- | :--- | :--- |
| **Search Input** | `page.getByPlaceholder('Wyszukaj książkę...')` or `page.getByRole('textbox', { name: /szukaj/i })` | Real-time filtering or on Enter |
| **Add Book Button** | `page.getByRole('button', { name: /dodaj książkę/i })` | Opens modal / panel with book form |
| **Book Card** | `page.locator('.book-card')` or `getByRole('article')` | Contains title, authors list, year, price |
| **Edit Book Button** | `bookCard.getByRole('button', { name: /edytuj/i })` | Located inside individual book card |
| **Delete Book Button** | `bookCard.getByRole('button', { name: /usuń/i })` | Triggers confirm toast or deletion |

## Form Fields (Add/Edit Book Modal)

| Field | Locator | Validation / Rules |
| :--- | :--- | :--- |
| **Title** | `getByLabel(/tytuł/i)` or `getByPlaceholder(/tytuł/i)` | Required string |
| **Year** | `getByLabel(/rok/i)` or `getByPlaceholder(/rok/i)` | Numeric integer (1900..current) |
| **Price** | `getByLabel(/cena/i)` or `getByPlaceholder(/cena/i)` | Decimal number (0.01..1000) |
| **Available** | `getByLabel(/dostępność|ilość/i)` | Numeric integer (1..10000) |
| **Authors Select** | `getByRole('combobox', { name: /autor/i })` | Selects registered authors |
| **Submit Button** | `getByRole('button', { name: /zapisz|dodaj/i })` | Submits form |
