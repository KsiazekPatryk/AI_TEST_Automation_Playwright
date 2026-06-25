# POST /authors — Positive Scenarios

---

## Endpoint Information

- **Method:** POST
- **Endpoint:** /authors
- **Operation ID:** createAuthor
- **API:** Bookstore API (`https://bookstoreapi.up.railway.app`)
- **Description:** Create a new author. Returns the created `Author` resource with HTTP 201.

---

## Preconditions

- API server is reachable at `API_URL` from `.env`.
- No authentication is required.
- Each test that creates an author must delete it after execution via `DELETE /authors/{id}`.

---

## Test Data

```json
// Payload A — typical names
{ "firstName": "George", "lastName": "Orwell" }

// Payload B — hyphenated first name
{ "firstName": "Jean-Paul", "lastName": "Sartre" }

// Payload C — faker-generated random data (use faker in automation)
{ "firstName": "<faker.person.firstName()>", "lastName": "<faker.person.lastName()>" }
```

---

## Test Cases

---

### TC-POS-POST-AUTHORS-001

**Scenario:** Create author with required fields — happy path

**Purpose:** Verify the happy path — an author is created with firstName and lastName, returning 201 with the correct body.

**Request**
- Headers: `Content-Type: application/json`
- Request Body: `{ "firstName": "George", "lastName": "Orwell" }`

**Expected Status Code:** 201

**Expected Response:**
```json
{ "id": "<positive integer>", "firstName": "George", "lastName": "Orwell" }
```

**Assertions:**
- Status code equals 201.
- `Content-Type` response header contains `application/json`.
- `id` is a positive integer.
- `firstName` equals `"George"`.
- `lastName` equals `"Orwell"`.

**Teardown:** DELETE /authors/{id}

---

### TC-POS-POST-AUTHORS-002

**Scenario:** Submitted firstName and lastName are echoed back in the response

**Purpose:** Verify the API stores and returns exactly the values provided in the request, without modification.

**Request**
- Request Body (faker-generated): `{ "firstName": "<random>", "lastName": "<random>" }`

**Expected Status Code:** 201

**Assertions:**
- `body.firstName` equals the value sent in the request.
- `body.lastName` equals the value sent in the request.

**Teardown:** DELETE /authors/{id}

---

### TC-POS-POST-AUTHORS-003

**Scenario:** Created author is retrievable via GET /authors/{id}

**Purpose:** Verify data persistence — the newly created author can be fetched by its `id`.

**Steps:**
1. POST /authors with a valid payload. Record `id`.
2. GET /authors/{id}.

**Expected Status Code (step 1):** 201
**Expected Status Code (step 2):** 200

**Assertions:**
- GET response `id` equals the POST response `id`.
- GET response `firstName` equals the posted value.
- GET response `lastName` equals the posted value.

**Teardown:** DELETE /authors/{id}

---

### TC-POS-POST-AUTHORS-004

**Scenario:** Two consecutively created authors receive unique IDs

**Purpose:** Verify the server generates distinct `id` values for each author creation.

**Steps:**
1. POST /authors (first author). Record `id1`.
2. POST /authors (second author). Record `id2`.

**Expected Status Code (both):** 201

**Assertions:**
- Both `id1` and `id2` are positive integers.
- `id1` is not equal to `id2`.

**Teardown:** DELETE /authors/{id1}, DELETE /authors/{id2}

---

### TC-POS-POST-AUTHORS-005

**Scenario:** Create author with a hyphenated first name

**Purpose:** Verify the API accepts and preserves hyphens in name fields, which are common in real author names.

**Request**
- Request Body: `{ "firstName": "Jean-Paul", "lastName": "Sartre" }`

**Expected Status Code:** 201

**Assertions:**
- Status code equals 201.
- `firstName` equals `"Jean-Paul"`.
- `lastName` equals `"Sartre"`.

**Teardown:** DELETE /authors/{id}

---

## Notes

- Single-character names (`"A"`, `"B"`) return 400 — the API enforces an undocumented minimum length constraint. These are covered in negative scenarios.
- Very long names (100+ chars) return 400 — the API enforces an undocumented maximum length constraint. Covered in negative scenarios.
- No `bio` field exists in this API's `Author` schema.
- No authentication is required for POST /authors.
