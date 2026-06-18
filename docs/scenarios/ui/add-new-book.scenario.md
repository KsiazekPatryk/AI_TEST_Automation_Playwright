# Add New Book via Manage Books Form

## 1. Scenario Title

Add a new book using the Add New Book side panel form on the Manage Books page and verify it appears in the books table.

---

## 2. Steps

1. Navigate to `https://ksiegarnia.up.railway.app/books-management`
2. Verify the "📚 Books Management" heading is visible and the books table is loaded
3. Click the "➕ Add New Book" button
4. Verify the "➕ Add New Book" side panel opens
5. Fill in the Title field with "The Art of Unit Testing"
6. Clear the Year field and type "2013"
7. Clear the Price ($) field and type "79.99"
8. Clear the Available Quantity field and type "50"
9. Select the checkbox for author "Kent Beck"
10. Click the "Add Book" button
11. Verify the success toast message appears
12. Verify the side panel closes automatically
13. Verify the new book row appears in the table with correct data
14. Verify the navigation link counter has incremented by 1

---

## 3. Expected Results

- **Step 1:** Page loads at URL `/books-management`; h1 heading "📚 Books Management" is visible
- **Step 2:** Table with columns ID, Cover, Title, Authors, Year, Price, Available, Actions is fully rendered
- **Step 3:** Clicking "➕ Add New Book" triggers the side panel to slide in
- **Step 4:** Side panel with h3 heading "➕ Add New Book" is visible; all form fields and buttons are present
- **Steps 5–9:** Each field accepts the provided input; Kent Beck checkbox becomes checked
- **Step 10:** Form is submitted to the API
- **Step 11:** Toast notification "✅ Book added successfully!" is visible
- **Step 12:** Side panel with heading "➕ Add New Book" is no longer visible
- **Step 13:** A new row appears in the table with title "The Art of Unit Testing", author "Kent Beck", year "2013", price "$79.99", available "50", and Edit/Delete action buttons
- **Step 14:** Navigation link updates from "Books (N)" to "Books (N+1)"

---

## 4. Key UI Elements

| Element | Description |
|---------|-------------|
| Navigation link "Books (N)" | Shows total book count; updates after adding |
| Navigation link "Manage Books" | Navigates to `/books-management` |
| Page heading (h1) | "📚 Books Management" |
| Button "➕ Add New Book" | Opens the Add New Book side panel |
| Side panel heading (h3) | "➕ Add New Book" |
| Title input | Required text field |
| Year input | Required number field; pre-filled with current year |
| Price ($) input | Required number field; pre-filled with 0 |
| Available Quantity input | Required number field; pre-filled with 0 |
| Authors checkbox list | At least one author must be selected |
| Button "Add Book" | Submits the form |
| Button "Cancel" | Closes the panel without submitting |
| Toast notification | Transient success/error feedback banner |
| Books table | Lists all books with ID, Cover, Title, Authors, Year, Price, Available, Actions columns |

---

## 5. Test Data

| Field              | Value                   |
|--------------------|-------------------------|
| Title              | The Art of Unit Testing |
| Year               | 2013                    |
| Price ($)          | 79.99                   |
| Available Quantity | 50                      |
| Author             | Kent Beck               |

---

## 6. Assertions

1. `page.url()` contains `/books-management`
2. h1 with text "📚 Books Management" is visible
3. Button "➕ Add New Book" is visible and enabled
4. After clicking "➕ Add New Book": side panel h3 "➕ Add New Book" is visible
5. Title input is visible and empty
6. Year input is visible and has value `2026` (current year default)
7. Price input is visible and has value `0`
8. Available Quantity input is visible and has value `0`
9. Checkbox for "Kent Beck" is visible and unchecked before selection
10. After selecting Kent Beck: checkbox is checked
11. "Add Book" button is visible and enabled
12. After clicking "Add Book": toast with text "Book added successfully!" is visible
13. Side panel with heading "➕ Add New Book" is NOT visible (after toast appears)
14. Table row with text "The Art of Unit Testing" is visible
15. That row contains "Kent Beck" in the Authors column
16. That row contains "2013" in the Year column
17. That row contains "$79.99" in the Price column
18. That row contains "50" in the Available column
19. That row contains Edit (✏️) and Delete (🗑️) buttons
20. Navigation link text matches `Books (N+1)` where N was the count before adding

---

## 7. Notes

- **Pre-filled fields:** Year, Price, and Available Quantity all have default values. Use Playwright `fill()` (not `type()`) to replace the entire value atomically.
- **Authors field:** Rendered as a scrollable list of checkboxes — at least one must be checked or the form will not submit.
- **Toast is transient:** Use a web-first auto-retrying assertion (`expect(locator).toBeVisible()`) to catch the toast before it auto-dismisses.
- **Book ID:** The assigned ID depends on the current database state and is not stable across test runs. Do NOT assert on a hardcoded ID value. Assert on the combination of title + author + year + price instead.
- **Books counter:** The navigation counter (e.g. "Books (29)" → "Books (30)") is environment-dependent. In a shared environment prefer asserting a relative increment (+1) rather than an absolute value.
- **Railway cold start:** The Railway-hosted API may be slow on first request. If the form does not close within the default timeout, increase the `not.toBeVisible()` timeout to 15 000 ms.
