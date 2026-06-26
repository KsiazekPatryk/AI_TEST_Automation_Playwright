# POST /books — Negative Scenarios & Business Validations

---

## Endpoint Information

- **Method:** POST
- **Endpoint:** `/books`
- **Description:** Creates a new book. Returns 400 for validation errors or non-existent authors, and 409 for duplicate title.

---

## Preconditions

- At least one author exists in the system with a known ID.
- A book with the title `"Duplicate Title Book"` already exists in the system (required for TC-NEG-BOOKS-POST-15).
- Author ID `999999` does NOT exist in the system.

---

## Test Data

```json
// Valid base (for reference and mutation)
{
  "title": "Valid Book Title",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 49.99,
  "available": 100
}

// Pre-existing duplicate
{ "title": "Duplicate Title Book" }  // created in precondition

// Out-of-range values
{ "year": 1899 }         // below minimum 1900
{ "price": 0 }           // below minimum 1 (per docs) / 0.01 (per OpenAPI)
{ "price": 1001 }        // above maximum 1000
{ "available": 0 }       // below minimum 1
{ "available": 10001 }   // above maximum 10000

// Non-existent author
{ "authors": [999999] }
```

---

## Test Cases

---

### TC-NEG-BOOKS-POST-01

#### Scenario
Missing `title` field — 400 Bad Request

#### Purpose
Verify that omitting the `title` field results in a validation error.

#### Request

##### Headers
```
Content-Type: application/json
```

##### Request Body
```json
{
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`
- `response.body.status === 400`
- Error message mentions `title`

---

### TC-NEG-BOOKS-POST-02

#### Scenario
`title` is an empty string — 400 Bad Request

#### Purpose
Verify that an empty string for `title` is rejected as invalid.

#### Request

##### Request Body
```json
{
  "title": "",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`
- Error message mentions `title`

---

### TC-NEG-BOOKS-POST-03

#### Scenario
Completely empty request body — 400 Bad Request

#### Purpose
Verify that an empty JSON object results in all-fields validation errors.

#### Request

##### Headers
```
Content-Type: application/json
```

##### Request Body
```json
{}
```

#### Expected Status Code
`400 Bad Request`

#### Expected Response
```json
{
  "timestamp": "<datetime>",
  "status": 400,
  "error": "Bad Request",
  "message": [
    "price incorrect input data",
    "year incorrect input data",
    "available incorrect input data",
    "title incorrect input data",
    "authors incorrect input data"
  ]
}
```

#### Assertions
- `response.status() === 400`
- `Array.isArray(response.body.message)` is true
- `response.body.message` contains entry for `price`
- `response.body.message` contains entry for `year`
- `response.body.message` contains entry for `available`
- `response.body.message` contains entry for `title`
- `response.body.message` contains entry for `authors`

---

### TC-NEG-BOOKS-POST-04

#### Scenario
Missing `authors` field — 400 Bad Request

#### Purpose
Verify that omitting the `authors` field results in a validation error.

#### Request

##### Request Body
```json
{
  "title": "Book Without Authors",
  "year": 2022,
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`
- Error message mentions `authors`

---

### TC-NEG-BOOKS-POST-05

#### Scenario
`authors` is an empty array — 400 Bad Request

#### Purpose
Verify that an empty `authors` list is rejected. The list must contain at least one author ID.

#### Request

##### Request Body
```json
{
  "title": "Book With Empty Authors",
  "authors": [],
  "year": 2022,
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`
- Error message mentions `authors`

---

### TC-NEG-BOOKS-POST-06

#### Scenario
`authors` contains a non-existent author ID — 400 Bad Request

#### Purpose
Verify that referencing a non-existent author ID is rejected with a descriptive error.

#### Request

##### Request Body
```json
{
  "title": "Book With Ghost Author",
  "authors": [999999],
  "year": 2022,
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Expected Response
```json
{
  "timestamp": "<datetime>",
  "status": 400,
  "errors": ["Can not find author with given id: 999999"]
}
```

#### Assertions
- `response.status() === 400`
- `response.body.errors` is an array
- `response.body.errors[0]` contains `"Can not find author with given id: 999999"`

---

### TC-NEG-BOOKS-POST-07

#### Scenario
Missing `year` field — 400 Bad Request

#### Purpose
Verify that omitting the `year` field results in a validation error.

#### Request

##### Request Body
```json
{
  "title": "Book Without Year",
  "authors": [<existing_author_id>],
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`
- Error message mentions `year`

---

### TC-NEG-BOOKS-POST-08

#### Scenario
`year` below minimum — year 1899 is before the documented minimum of 1900

#### Purpose
Verify that a year value before 1900 is rejected.

#### Request

##### Request Body
```json
{
  "title": "Too Old Book Test",
  "authors": [<existing_author_id>],
  "year": 1899,
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`
- Error message mentions `year`

---

### TC-NEG-BOOKS-POST-09

#### Scenario
Missing `price` field — 400 Bad Request

#### Purpose
Verify that omitting the `price` field results in a validation error.

#### Request

##### Request Body
```json
{
  "title": "Book Without Price",
  "authors": [<existing_author_id>],
  "year": 2022,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`
- Error message mentions `price`

---

### TC-NEG-BOOKS-POST-10

#### Scenario
`price` below minimum — value 0

#### Purpose
Verify that a price value of 0 is rejected (minimum is 1 per documentation / 0.01 per OpenAPI).

#### Request

##### Request Body
```json
{
  "title": "Zero Price Book Test",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 0,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`
- Error message mentions `price`

---

### TC-NEG-BOOKS-POST-11

#### Scenario
`price` above maximum — value 1001

#### Purpose
Verify that a price value exceeding the maximum (1000) is rejected.

#### Request

##### Request Body
```json
{
  "title": "Over Max Price Book Test",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 1001,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`
- Error message mentions `price`

---

### TC-NEG-BOOKS-POST-12

#### Scenario
Missing `available` field — 400 Bad Request

#### Purpose
Verify that omitting the `available` field results in a validation error.

#### Request

##### Request Body
```json
{
  "title": "Book Without Available",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 49.99
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`
- Error message mentions `available`

---

### TC-NEG-BOOKS-POST-13

#### Scenario
`available` below minimum — value 0

#### Purpose
Verify that `available` value of 0 is rejected (minimum is 1).

#### Request

##### Request Body
```json
{
  "title": "Zero Available Book Test",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 49.99,
  "available": 0
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`
- Error message mentions `available`

---

### TC-NEG-BOOKS-POST-14

#### Scenario
`available` above maximum — value 10001

#### Purpose
Verify that an `available` value exceeding the maximum (10000) is rejected.

#### Request

##### Request Body
```json
{
  "title": "Over Max Available Book Test",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 49.99,
  "available": 10001
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`
- Error message mentions `available`

---

### TC-NEG-BOOKS-POST-15

#### Scenario
Duplicate `title` — 409 Conflict

#### Purpose
Verify that creating a book with a title that already exists in the system returns 409 Conflict.

#### Preconditions
A book with the title `"Duplicate Title Book"` was previously created (e.g., in test setup via POST /books).

#### Request

##### Request Body
```json
{
  "title": "Duplicate Title Book",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`409 Conflict`

#### Assertions
- `response.status() === 409`

---

### TC-NEG-BOOKS-POST-16

#### Scenario
`price` as a string instead of number — 400 Bad Request

#### Purpose
Verify that a wrong data type for `price` is rejected.

#### Request

##### Request Body
```json
{
  "title": "Wrong Price Type Book",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": "forty-nine",
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`

---

### TC-NEG-BOOKS-POST-17

#### Scenario
`year` as a string instead of integer — 400 Bad Request

#### Purpose
Verify that a wrong data type for `year` is rejected.

#### Request

##### Request Body
```json
{
  "title": "Wrong Year Type Book",
  "authors": [<existing_author_id>],
  "year": "twenty twenty-two",
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`

---

### TC-NEG-BOOKS-POST-18

#### Scenario
`authors` contains duplicate IDs (uniqueItems violation) — 400 Bad Request

#### Purpose
Verify that the `authors` array with duplicate IDs is rejected (OpenAPI defines `uniqueItems: true`).

#### Request

##### Request Body
```json
{
  "title": "Duplicate Author IDs Book",
  "authors": [<existing_author_id>, <existing_author_id>],
  "year": 2022,
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`

> **Note:** Actual behavior may differ — the API might deduplicate the array instead of rejecting the request. If the response is `201`, verify only one author entry is present in the response `authors` array.

---

### TC-NEG-BOOKS-POST-19

#### Scenario
Malformed JSON body — 400 Bad Request

#### Purpose
Verify that a syntactically invalid JSON body is rejected.

#### Request

##### Headers
```
Content-Type: application/json
```

##### Raw Request Body (malformed)
```
{ "title": "Bad JSON", "year": 2022, "price": 49.99, "available": 100 "authors": [49] }
```
(missing comma after `available` value)

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`

---

### TC-NEG-BOOKS-POST-20

#### Scenario
`authors` field is not an array (scalar value) — 400 Bad Request

#### Purpose
Verify that a non-array value for `authors` is rejected.

#### Request

##### Request Body
```json
{
  "title": "Authors Not Array Book",
  "authors": 49,
  "year": 2022,
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`400 Bad Request`

#### Assertions
- `response.status() === 400`

---

## Notes

- **OpenAPI discrepancy — `price` minimum:** OpenAPI spec minimum is `0.01`; documentation says `1`. TC-NEG-BOOKS-POST-10 uses `0` to test both boundaries. If the actual enforced minimum is `1`, a separate test with `price: 0.01` should be added and expected to return `400`.
- **Dual error response structures:** Validation errors return `message` array; author-not-found errors return `errors` array. Assertions are adapted per test case.
- **TC-NEG-BOOKS-POST-18 — uniqueItems behavior:** The OpenAPI defines `uniqueItems: true` for the `authors` array, but actual API behavior (reject vs. deduplicate) is undocumented. Observe actual behavior and update expected assertion accordingly.
- **`title` not in OpenAPI required array:** Despite `title` not appearing in the `required` array in `CreateBookPayload`, TC-NEG-BOOKS-POST-01 verifies the documented requirement. If it passes without `title`, the API diverges from documentation.
