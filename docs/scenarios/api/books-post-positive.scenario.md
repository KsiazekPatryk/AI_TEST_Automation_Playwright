# POST /books — Positive Scenarios

---

## Endpoint Information

- **Method:** POST
- **Endpoint:** `/books`
- **Description:** Creates a new book in the bookstore system. Returns 201 with the created book object on success.

---

## Preconditions

- At least one author exists in the system.
- For multi-author tests: at least two authors exist in the system.
- Author IDs are known before test execution (retrieved via `GET /authors` or created in test setup).
- Each test uses a unique book title to avoid 409 Conflict interference between tests.

---

## Test Data

```json
// Base valid payload
{
  "title": "Testowanie REST API dla początkujących",
  "authors": [49],
  "year": 2022,
  "price": 49.99,
  "available": 100
}

// Boundary: price minimum
{ "price": 0.01 }   // OpenAPI minimum
{ "price": 1 }      // Documentation minimum (screenshot)

// Boundary: price maximum
{ "price": 1000 }

// Boundary: available minimum
{ "available": 1 }

// Boundary: available maximum
{ "available": 10000 }

// Boundary: year minimum
{ "year": 1900 }

// Multi-author
{ "authors": [<id_1>, <id_2>] }
```

---

## Test Cases

---

### TC-POS-BOOKS-POST-01

#### Scenario
Create a book with all required fields — happy path

#### Purpose
Verify that a valid request with all required fields creates a book and returns correct data.

#### Request

##### Headers
```
Content-Type: application/json
Accept: */*
```

##### Request Body
```json
{
  "title": "Testowanie REST API dla początkujących",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`201 Created`

#### Expected Response
```json
{
  "id": <generated_integer>,
  "title": "Testowanie REST API dla początkujących",
  "year": 2022,
  "price": 49.99,
  "coverId": null,
  "available": 100,
  "authors": [
    {
      "id": <existing_author_id>,
      "firstName": "<author_firstName>",
      "lastName": "<author_lastName>"
    }
  ]
}
```

#### Assertions
- `response.status() === 201`
- `response.body.id` is a positive integer
- `response.body.title === "Testowanie REST API dla początkujących"`
- `response.body.year === 2022`
- `response.body.price === 49.99`
- `response.body.coverId === null`
- `response.body.available === 100`
- `response.body.authors.length === 1`
- `response.body.authors[0].id === <existing_author_id>`
- `response.body.authors[0].firstName` is a non-empty string
- `response.body.authors[0].lastName` is a non-empty string

---

### TC-POS-BOOKS-POST-02

#### Scenario
Create a book with multiple authors

#### Purpose
Verify that the `authors` field accepts multiple valid author IDs and all are reflected in the response.

#### Request

##### Headers
```
Content-Type: application/json
```

##### Request Body
```json
{
  "title": "Multi-Author Book Test",
  "authors": [<author_id_1>, <author_id_2>],
  "year": 2023,
  "price": 89.99,
  "available": 50
}
```

#### Expected Status Code
`201 Created`

#### Assertions
- `response.status() === 201`
- `response.body.authors.length === 2`
- `response.body.authors` contains author with `id === <author_id_1>`
- `response.body.authors` contains author with `id === <author_id_2>`

---

### TC-POS-BOOKS-POST-03

#### Scenario
Create a book with `price` at minimum boundary (0.01)

#### Purpose
Verify that the minimum allowed price value is accepted. Tests the OpenAPI-defined minimum of `0.01`.

#### Request

##### Request Body
```json
{
  "title": "Min Price Book 001",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 0.01,
  "available": 1
}
```

#### Expected Status Code
`201 Created`

#### Assertions
- `response.status() === 201`
- `response.body.price === 0.01`

---

### TC-POS-BOOKS-POST-04

#### Scenario
Create a book with `price` at maximum boundary (1000)

#### Purpose
Verify that the maximum allowed price value (1000) is accepted.

#### Request

##### Request Body
```json
{
  "title": "Max Price Book Test",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 1000,
  "available": 1
}
```

#### Expected Status Code
`201 Created`

#### Assertions
- `response.status() === 201`
- `response.body.price === 1000`

---

### TC-POS-BOOKS-POST-05

#### Scenario
Create a book with `available` at minimum boundary (1)

#### Purpose
Verify that the minimum allowed available quantity (1) is accepted.

#### Request

##### Request Body
```json
{
  "title": "Min Available Book Test",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 49.99,
  "available": 1
}
```

#### Expected Status Code
`201 Created`

#### Assertions
- `response.status() === 201`
- `response.body.available === 1`

---

### TC-POS-BOOKS-POST-06

#### Scenario
Create a book with `available` at maximum boundary (10000)

#### Purpose
Verify that the maximum allowed available quantity (10000) is accepted.

#### Request

##### Request Body
```json
{
  "title": "Max Available Book Test",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 49.99,
  "available": 10000
}
```

#### Expected Status Code
`201 Created`

#### Assertions
- `response.status() === 201`
- `response.body.available === 10000`

---

### TC-POS-BOOKS-POST-07

#### Scenario
Create a book with `year` at minimum boundary (1900)

#### Purpose
Verify that year value 1900 — the documented minimum — is accepted.

#### Request

##### Request Body
```json
{
  "title": "Oldest Book Boundary Test",
  "authors": [<existing_author_id>],
  "year": 1900,
  "price": 29.99,
  "available": 10
}
```

#### Expected Status Code
`201 Created`

#### Assertions
- `response.status() === 201`
- `response.body.year === 1900`

---

### TC-POS-BOOKS-POST-08

#### Scenario
Create a book with `year` set to current year

#### Purpose
Verify that the current year is accepted as a valid value.

#### Request

##### Request Body
```json
{
  "title": "Current Year Book Test",
  "authors": [<existing_author_id>],
  "year": 2026,
  "price": 59.99,
  "available": 20
}
```

#### Expected Status Code
`201 Created`

#### Assertions
- `response.status() === 201`
- `response.body.year === 2026`

---

### TC-POS-BOOKS-POST-09

#### Scenario
Created book data persists — verify via GET /books/{id}

#### Purpose
Verify that the book returned in the POST response can be retrieved via GET and contains identical data.

#### Request

**Step 1 — POST /books:**
```json
{
  "title": "Persistence Test Book",
  "authors": [<existing_author_id>],
  "year": 2021,
  "price": 35.00,
  "available": 25
}
```

**Step 2 — GET /books/{id}** using `id` from POST response.

#### Expected Status Code
- POST: `201 Created`
- GET: `200 OK`

#### Assertions
- `POST response.body.id` is present
- `GET response.body.id === POST response.body.id`
- `GET response.body.title === "Persistence Test Book"`
- `GET response.body.year === 2021`
- `GET response.body.price === 35.00`
- `GET response.body.available === 25`
- `GET response.body.authors[0].id === <existing_author_id>`

---

### TC-POS-BOOKS-POST-10

#### Scenario
`price` accepts decimal value (number type, not integer-only)

#### Purpose
Verify that a decimal price value is stored and returned correctly.

#### Request

##### Request Body
```json
{
  "title": "Decimal Price Book Test",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 19.95,
  "available": 5
}
```

#### Expected Status Code
`201 Created`

#### Assertions
- `response.status() === 201`
- `response.body.price === 19.95`

---

## Notes

- **OpenAPI discrepancy — `price` minimum:** OpenAPI spec defines minimum as `0.01`, documentation screenshot states minimum as `1`. TC-POS-03 uses `0.01` to test the OpenAPI-defined value. If the API rejects `0.01`, the actual enforced minimum is likely `1` — update negative tests accordingly.
- **`title` uniqueness:** Each test case uses a distinct title to prevent 409 Conflict errors from interfering with unrelated test runs.
- **Cleanup:** Test setup should delete created books after test completion to keep the environment clean (via `DELETE /books/{id}`).
