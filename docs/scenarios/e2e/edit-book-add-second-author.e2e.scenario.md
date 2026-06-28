# Edit Book — Add Second Author

---

## Setup (API)

1. Create **Author A** via `POST /authors` using `AuthorsAPISteps.create()` with a random payload from `getRandomAuthorPayload()`.
2. Create **Author B** via `POST /authors` using `AuthorsAPISteps.create()` with a different random payload from `getRandomAuthorPayload()`.
3. Create **Book** via `POST /books` using `BooksAPISteps.createBook()` with a random payload from `getRandomBookOverridePayload({ authors: [authorA.id] })` — only Author A is assigned.

---

## Verify Setup (API)

1. Call `BooksAPISteps.getBookById(book.id)` and verify the response.
2. Assert `authors` array contains exactly **one entry** with `id === authorA.id`.
3. Assert Author B is **not** present in the `authors` array.

---

## Action (UI)

1. Navigate to `/books-management` via `BooksManagementPage.navigate()`.
2. Assert the "📚 Books Management" heading is visible.
3. Search for the book by title using `BooksManagementPage.search(book.title)`.
4. Assert the book row is visible in the table — `BooksManagementPage.getBookTitleCell(book.title)` is visible.
5. Click the **✏️** edit button in the book's row — `BooksManagementPage.getEditButtonForBook(book.title)`.
6. Assert the **Edit Book** panel opens — `EditBookFormComponent.panelHeading` ("✏️ Edit Book") is visible.
7. Assert Author A's checkbox is **pre-checked** — `EditBookFormComponent.getAuthorCheckbox(authorA.fullName)` is checked.
8. Assert Author B's checkbox is **unchecked** — `EditBookFormComponent.getAuthorCheckbox(authorB.fullName)` is not checked.
9. Check Author B's checkbox by calling `EditBookFormComponent.selectAuthor(authorB.fullName)`.
10. Click the **"Update Book"** button — `EditBookFormComponent.submit()`.

---

## Verify UI

1. Assert the **Edit Book** panel closes — `EditBookFormComponent.panelHeading` is not visible (timeout: 15 000 ms).
2. Assert a success toast appears — `BooksManagementPage.updateSuccessToast` ("Book updated successfully!" or similar observed text) is visible (timeout: 30 000 ms).
3. Assert the book row in the table shows **both authors** — `BooksManagementPage.getBookAuthorCell` containing both `authorA.fullName` and `authorB.fullName` is visible.

> **Note**: The exact success toast text should be confirmed by the E2E Writer during implementation, as it was not triggered during planning (to avoid modifying shared data). Apply the same pattern as `BooksManagementPage.successToast` used in `add-new-book.spec.ts`.

---

## Verify API

1. Call `BooksAPISteps.getBookById(book.id)`.
2. Assert `response.status` is `200`.
3. Assert `authors` array has **exactly 2 entries**.
4. Assert `authors` contains an object with `id === authorA.id`.
5. Assert `authors` contains an object with `id === authorB.id`.
6. Assert all other book fields (`title`, `year`, `price`, `available`) are **unchanged** from creation.

---

## Cleanup (API)

1. `BooksAPISteps.deleteBook(book.id)` — delete the test book.
2. `AuthorsAPISteps.delete(authorA.id)` — delete Author A.
3. `AuthorsAPISteps.delete(authorB.id)` — delete Author B.

> Run cleanup in `test.afterAll`. Guard each call with existence checks (`if (book?.id)`, `if (authorA?.id)`, `if (authorB?.id)`) to ensure cleanup runs even if setup fails partially.

---

## Required API Endpoints

| Method | Endpoint         | Purpose                                      |
|--------|------------------|----------------------------------------------|
| POST   | /authors         | Create Author A and Author B during setup    |
| POST   | /books           | Create test book with Author A during setup  |
| GET    | /books/{id}      | Verify setup and verify API after UI action  |
| DELETE | /books/{id}      | Cleanup test book                            |
| DELETE | /authors/{id}    | Cleanup Author A and Author B                |

---

## Required API Coverage

| Spec file                                          | Status   |
|----------------------------------------------------|----------|
| `tests/api/authors/authors-post-positive.spec.ts`  | ✅ Exists |
| `tests/api/books/books-post-positive.spec.ts`      | ✅ Exists |
| `tests/api/books/books-id-put-positive.spec.ts`    | ✅ Exists |
| `tests/api/books/books-id-put-negative.spec.ts`    | ✅ Exists |

> `GET /books/{id}` has no dedicated spec file. It is used internally by `BooksAPISteps.getBookById()`, which is already exercised in `books-id-put-positive.spec.ts` via `createBook()` → `getBookById()` pattern. No blocker.

---

## Required API Architecture

### API Requests — all present ✅

| Class              | File                                                  |
|--------------------|-------------------------------------------------------|
| `AuthorsAPIRequest`| `src/api/requests/authors/authors.api.request.ts`     |
| `BooksAPIRequest`  | `src/api/requests/books/books.api.request.ts`         |

### API Steps — all present ✅

| Class             | File                                                 |
|-------------------|------------------------------------------------------|
| `AuthorsAPISteps` | `src/api/steps/authors/authors.api.steps.ts`         |
| `BooksAPISteps`   | `src/api/steps/books/books.api.steps.ts`             |

---

## Required UI Components

| Component / Page             | File                                                   | Status       |
|------------------------------|--------------------------------------------------------|--------------|
| `BooksManagementPage`        | `src/ui/pages/books-management.page.ts`                | ✅ Exists     |
| `EditBookFormComponent`      | `src/ui/components/edit-book-form.component.ts`        | ❌ **Missing — must be created** |

### EditBookFormComponent — expected interface

Based on UI inspection (`https://ksiegarnia.up.railway.app/books-management`), the Edit Book panel renders on the right side of the page when the ✏️ button is clicked. The E2E Writer must create `EditBookFormComponent` with at least:

| Locator                 | Strategy                                                              |
|-------------------------|-----------------------------------------------------------------------|
| `panelHeading`          | `getByRole('heading', { name: /Edit Book/ })`                         |
| `titleInput`            | `getByRole('textbox', { name: 'Title *' })`                           |
| `yearInput`             | `getByRole('spinbutton', { name: 'Year *' })`                         |
| `priceInput`            | `getByRole('spinbutton', { name: 'Price ($) *' })`                    |
| `quantityInput`         | `getByRole('spinbutton', { name: 'Available Quantity *' })`           |
| `closeButton`           | `getByRole('button', { name: '×' })`                                  |
| `cancelButton`          | `getByRole('button', { name: 'Cancel' })`                             |
| `submitButton`          | `getByRole('button', { name: 'Update Book' })`                        |
| `getAuthorCheckbox(name)` | `getByText(name, { exact: true }).locator('..').getByRole('checkbox')` |

Also, `BooksManagementPage` needs two new locators:
- `getEditButtonForBook(title: string)` — the ✏️ button in the row that contains the given title cell.
- `updateSuccessToast` — success feedback element shown after a successful update (exact text must be confirmed by E2E Writer during implementation by inspecting the network response or console).

---

## Test Data

```
Author A:
  firstName: faker.person.firstName()
  lastName:  faker.person.lastName()

Author B:
  firstName: faker.person.firstName()
  lastName:  faker.person.lastName()

Book:
  title:     faker.lorem.words(3)
  year:      faker.number.int({ min: 1990, max: 2024 })
  price:     faker.number.float({ min: 1, max: 999, fractionDigits: 2 })
  available: faker.number.int({ min: 1, max: 100 })
  authors:   [authorA.id]   ← only Author A at creation time
```

---

## Assertions

### API Setup Verification
- `GET /books/{id}` returns status `200`
- `book.authors.length === 1`
- `book.authors[0].id === authorA.id`

### UI — Edit Panel
- `EditBookFormComponent.panelHeading` is visible after clicking ✏️
- Author A checkbox (`getAuthorCheckbox(authorA.fullName)`) is checked
- Author B checkbox (`getAuthorCheckbox(authorB.fullName)`) is not checked

### UI — After Submit
- `EditBookFormComponent.panelHeading` is not visible (panel closed)
- Success toast is visible
- `BooksManagementPage.getBookAuthorCell(...)` shows both authors

### API Post-Action Verification
- `GET /books/{id}` returns status `200`
- `book.authors.length === 2`
- `book.authors` contains `{ id: authorA.id }`
- `book.authors` contains `{ id: authorB.id }`
- `book.title`, `book.year`, `book.price`, `book.available` are unchanged from creation

---

## Notes

1. **Authors list in Edit panel is a flat list of ALL authors in the system.** The list is alphabetically sorted by first name (confirmed via UI inspection). The checkbox state reflects the current assignment. This is the same pattern as `AddNewBookFormComponent.getAuthorCheckboxLocator()`.

2. **No dedicated `GET /books/{id}` spec file exists** (`books-get-positive.spec.ts`). This is not a blocker since the method `BooksAPISteps.getBookById()` is fully implemented and used in other specs, making it safe to use in E2E verification.

3. **`EditBookFormComponent` does not exist yet.** It must be created by the E2E Writer before implementing the test. The component structure closely mirrors `AddNewBookFormComponent` — the author checkbox helper method can reuse the same pattern.

4. **`BooksManagementPage` needs extension.** Two new locator helpers must be added: `getEditButtonForBook(title)` and `updateSuccessToast`. The exact success toast text must be determined by the E2E Writer at implementation time (either by running the app or inspecting the source).

5. **Shared data risk.** The test creates its own isolated book and authors via API, ensuring no interference with pre-existing data on the shared `bookstoreapi.up.railway.app` backend.

6. **Tag suggestion**: `@e2e @books-management @smoke`
