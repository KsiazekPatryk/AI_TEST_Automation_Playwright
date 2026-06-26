# POST /books — Schema Validation Scenarios

---

## Endpoint Information

- **Method:** POST
- **Endpoint:** `/books`
- **Description:** Creates a new book in the bookstore system. Returns 201 with the created book object on success.

---

## Preconditions

- At least one author exists in the system (required to build valid `authors` payload).
- Note the ID of an existing author (e.g., retrieved via `GET /authors`).

---

## Test Data

```json
// Valid base payload (use existing author ID)
{
  "title": "Schema Test Book",
  "authors": [49],
  "year": 2022,
  "price": 49.99,
  "available": 100
}
```

---

## Test Cases

---

### TC-SCHEMA-BOOKS-POST-01

#### Scenario
Successful creation returns HTTP 201

#### Purpose
Verify that a valid request returns the correct HTTP status code.

#### Request

##### Headers
```
Content-Type: application/json
Accept: */*
```

##### Request Body
```json
{
  "title": "Schema Test Book 01",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`201 Created`

#### Expected Response
JSON body of created book.

#### Assertions
- `response.status() === 201`

---

### TC-SCHEMA-BOOKS-POST-02

#### Scenario
Response Content-Type is application/json

#### Purpose
Verify that the API returns the correct Content-Type header.

#### Request

##### Headers
```
Content-Type: application/json
```

##### Request Body
Same as TC-SCHEMA-BOOKS-POST-01.

#### Expected Status Code
`201 Created`

#### Expected Response
Header present in response.

#### Assertions
- `response.headers()['content-type']` contains `application/json`

---

### TC-SCHEMA-BOOKS-POST-03

#### Scenario
Response body contains all expected top-level fields

#### Purpose
Verify the response schema matches the documented `Book` object.

#### Request

##### Headers
```
Content-Type: application/json
```

##### Request Body
Same as TC-SCHEMA-BOOKS-POST-01.

#### Expected Status Code
`201 Created`

#### Expected Response
```json
{
  "id": <integer>,
  "title": <string>,
  "year": <integer>,
  "price": <number>,
  "coverId": null,
  "available": <integer>,
  "authors": [...]
}
```

#### Assertions
- Response body contains field `id`
- Response body contains field `title`
- Response body contains field `year`
- Response body contains field `price`
- Response body contains field `coverId`
- Response body contains field `available`
- Response body contains field `authors`
- Total number of top-level keys is 7

---

### TC-SCHEMA-BOOKS-POST-04

#### Scenario
`id` field is of type integer (int64)

#### Purpose
Validate the type of the `id` field in the response.

#### Request

##### Headers
```
Content-Type: application/json
```

##### Request Body
Same as TC-SCHEMA-BOOKS-POST-01.

#### Expected Status Code
`201 Created`

#### Assertions
- `typeof response.body.id === 'number'`
- `Number.isInteger(response.body.id)` is true
- `response.body.id > 0`

---

### TC-SCHEMA-BOOKS-POST-05

#### Scenario
`title` field is of type string

#### Purpose
Validate the type of the `title` field in the response.

#### Request

##### Request Body
Same as TC-SCHEMA-BOOKS-POST-01.

#### Expected Status Code
`201 Created`

#### Assertions
- `typeof response.body.title === 'string'`
- `response.body.title` is not empty

---

### TC-SCHEMA-BOOKS-POST-06

#### Scenario
`year` field is of type integer (int32)

#### Purpose
Validate the type of the `year` field in the response.

#### Expected Status Code
`201 Created`

#### Assertions
- `typeof response.body.year === 'number'`
- `Number.isInteger(response.body.year)` is true

---

### TC-SCHEMA-BOOKS-POST-07

#### Scenario
`price` field is of type number

#### Purpose
Validate the type of the `price` field in the response.

#### Expected Status Code
`201 Created`

#### Assertions
- `typeof response.body.price === 'number'`

---

### TC-SCHEMA-BOOKS-POST-08

#### Scenario
`coverId` field is nullable — returns null for a newly created book

#### Purpose
Verify that `coverId` is null when no cover has been assigned yet.

#### Expected Status Code
`201 Created`

#### Assertions
- `response.body.coverId === null`

---

### TC-SCHEMA-BOOKS-POST-09

#### Scenario
`available` field is of type integer (int32)

#### Purpose
Validate the type of the `available` field in the response.

#### Expected Status Code
`201 Created`

#### Assertions
- `typeof response.body.available === 'number'`
- `Number.isInteger(response.body.available)` is true

---

### TC-SCHEMA-BOOKS-POST-10

#### Scenario
`authors` field is a non-empty array with uniqueItems

#### Purpose
Validate the structure of the `authors` field.

#### Request

##### Request Body
```json
{
  "title": "Schema Test Book 10",
  "authors": [<existing_author_id>],
  "year": 2022,
  "price": 49.99,
  "available": 100
}
```

#### Expected Status Code
`201 Created`

#### Assertions
- `Array.isArray(response.body.authors)` is true
- `response.body.authors.length >= 1`

---

### TC-SCHEMA-BOOKS-POST-11

#### Scenario
Each object in `authors` array contains expected fields with correct types

#### Purpose
Validate the `Author` object schema within the response `authors` array.

#### Expected Status Code
`201 Created`

#### Expected Response — Author object structure
```json
{
  "id": <integer>,
  "firstName": <string>,
  "lastName": <string>
}
```

#### Assertions
For each author in `response.body.authors`:
- `typeof author.id === 'number'` and `Number.isInteger(author.id)`
- `typeof author.firstName === 'string'`
- `typeof author.lastName === 'string'`
- Author object contains exactly 3 fields: `id`, `firstName`, `lastName`

---

### TC-SCHEMA-BOOKS-POST-12

#### Scenario
400 error response structure — validation errors on empty body

#### Purpose
Verify the error response schema for validation failures.

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
  "timestamp": "<ISO 8601 datetime>",
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
- `response.body.status === 400`
- `response.body.error === 'Bad Request'`
- `response.body.timestamp` is present and not empty
- `Array.isArray(response.body.message)` is true
- `response.body.message.length >= 1`

---

### TC-SCHEMA-BOOKS-POST-13

#### Scenario
400 error response structure — non-existent author ID

#### Purpose
Verify the alternative error response schema (uses `errors` key, not `message`).

#### Request

##### Request Body
```json
{
  "title": "Schema Test Book 13",
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
  "timestamp": "<ISO 8601 datetime>",
  "status": 400,
  "errors": ["Can not find author with given id: 999999"]
}
```

#### Assertions
- `response.status() === 400`
- `response.body.status === 400`
- `response.body.timestamp` is present
- `Array.isArray(response.body.errors)` is true
- `response.body.errors[0]` contains `"Can not find author with given id"`

---

### TC-SCHEMA-BOOKS-POST-14

#### Scenario
409 Conflict response structure — duplicate title

#### Purpose
Verify the error response schema for duplicate book title.

#### Preconditions
A book with the title "Existing Book Title" has already been created.

#### Request

##### Request Body
```json
{
  "title": "Existing Book Title",
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

## Notes

- **OpenAPI discrepancy — `title` required field:** `title` is NOT listed in the `required` array of `CreateBookPayload` in the OpenAPI spec, but the API documentation (screenshots) and actual behavior indicate it is required. Tests should treat `title` as required.
- **OpenAPI discrepancy — `price` minimum:** OpenAPI spec defines `price` minimum as `0.01`, but the API documentation states the minimum is `1`. Boundary tests should cover both values to detect the actual enforced limit.
- **Dual error response structures:** Two different error response shapes are documented (`message` array vs `errors` array). The key used depends on the error type — this must be accounted for in schema assertions.
- **`coverId` nullability:** Not explicitly marked as nullable in OpenAPI, but example response shows `null`. Treat as nullable.
