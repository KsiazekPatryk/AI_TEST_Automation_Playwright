# Add New Author

## 1. Scenario Title

Navigate to the Authors section, add a new author using the inline form, and verify the new author appears in the authors table.

---

## 2. Steps

1. Navigate to `https://ksiegarnia.up.railway.app/`.
2. Click the "Authors" link in the top navigation bar.
3. Verify the Authors page is loaded with the heading "Authors" and the authors table is visible.
4. Click the "Add Author" button.
5. Verify the "Add New Author" form appears above the authors table with "First Name" and "Last Name" input fields, a "Save" button, and a "Cancel" button.
6. Click the "First Name" input field and type a dynamically generated first name.
7. Click the "Last Name" input field and type a dynamically generated last name.
8. Click the "Save" button.
9. Verify the "Add New Author" form is no longer visible.
10. Verify the authors table contains a new row with the entered First Name and Last Name.
11. Verify the new row includes an "Edit" button and a "Delete" button in the Actions column.

---

## 3. Expected Results

| Step | Expected Behavior |
|------|-------------------|
| 2 | Browser navigates to the Authors page. The page displays the heading "Authors". |
| 3 | The page heading "Authors" is visible. The authors table is visible with columns: ID, First Name, Last Name, Actions. The "Add Author" button is visible. |
| 4 | Clicking "Add Author" reveals the inline "Add New Author" form above the authors table without a page reload. |
| 5 | The form heading "Add New Author" is visible. Two labeled text inputs ("First Name:" and "Last Name:") are empty and ready for input. "Save" and "Cancel" buttons are visible. |
| 6–7 | The First Name and Last Name fields display the typed values after input. |
| 8 | Clicking "Save" submits the form without a full page reload. |
| 9 | The "Add New Author" form section is no longer visible on the page. |
| 10 | The authors table contains a new row with the entered first and last name appended at the bottom. |
| 11 | The new row's Actions cell contains both an "Edit" button and a "Delete" button. |

---

## 4. Key UI Elements

- **Top navigation bar** — contains links: Home, Books, Authors, Categories.
- **"Authors" navigation link** — navigates to the Authors section.
- **Page heading "Authors"** — confirms the Authors page is active.
- **"Add Author" button** — visible above the authors table; triggers the inline add form.
- **"Add New Author" form heading** — confirms the form is open.
- **"First Name:" labeled text input** — accepts the author's first name.
- **"Last Name:" labeled text input** — accepts the author's last name.
- **"Save" button (inside the form)** — submits the new author data.
- **"Cancel" button (inside the form)** — discards the form without saving.
- **Authors table** — contains columns: ID, First Name, Last Name, Actions.
- **"Edit" button (per row)** — visible in the Actions column of each author row.
- **"Delete" button (per row)** — visible in the Actions column of each author row.

---

## 5. Test Data

| Field | Value |
|-------|-------|
| First Name | dynamically generated via `faker.person.firstName()` |
| Last Name | dynamically generated via `faker.person.lastName()` |

> Note: Use faker to ensure uniqueness and avoid collisions with pre-existing seed authors: Jan Kowalski, Maria Nowak, Piotr Wiśniewski, Anna Wójcik, Tomasz Kowalczyk.

---

## 6. Assertions

| # | Assertion | Type |
|---|-----------|------|
| A1 | The "Authors" page heading is visible after clicking the navigation link. | Visibility |
| A2 | The authors table is visible with column headers: ID, First Name, Last Name, Actions. | Visibility + Text match |
| A3 | The "Add Author" button is visible on the Authors page. | Visibility |
| A4 | After clicking "Add Author", the heading "Add New Author" is visible. | Visibility |
| A5 | After clicking "Add Author", the "First Name:" input is visible and empty. | Visibility + Value match (empty) |
| A6 | After clicking "Add Author", the "Last Name:" input is visible and empty. | Visibility + Value match (empty) |
| A7 | After clicking "Add Author", the "Save" button is visible. | Visibility |
| A8 | After clicking "Add Author", the "Cancel" button is visible. | Visibility |
| A9 | The "First Name:" input contains the entered value after typing. | Value match |
| A10 | The "Last Name:" input contains the entered value after typing. | Value match |
| A11 | After clicking "Save", the "Add New Author" form heading is no longer visible. | Not visible |
| A12 | The authors table contains a row with the entered first name. | Text match |
| A13 | The authors table contains a row with the entered last name. | Text match |
| A14 | The new author row contains an "Edit" button. | Visibility |
| A15 | The new author row contains a "Delete" button. | Visibility |

---

## 7. Notes

- The "Add New Author" form renders **inline** on the same page as the table — it is not a modal or a separate page. It appears between the "Add Author" button and the authors table.
- After saving, the table updates in-place **without a full page reload**. There is no visible success/confirmation message — the only confirmation is the new row appearing in the table.
- The ID assigned to the new author is **auto-generated** by the backend and must not be asserted as a hard-coded number.
- The URL did not change when navigating to Authors during exploration — possible client-side routing. Assertions on navigation should verify the "Authors" heading is visible rather than relying on a specific URL.
- The application is hosted on Railway (cloud platform). Allow for potential cold-start latency on the first navigation request.
