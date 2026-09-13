# Schema Validation — GET /books

---

# Endpoint Information

- **Method:** GET
- **Endpoint:** /books
- **Description:** Returns a list of books. Supports optional filtering by `title` and `author` query parameters.

---

# Preconditions

- API server is running and reachable using the configured API base URL.
- No authentication requirement is documented in OpenAPI for this operation.
- At least one book exists when validating item-level schema assertions; if the response array is empty, item-level assertions are skipped or executed after test data setup.

---

# Test Data

**Valid headers:**
```http
Accept: application/json
```

**Request body:** None. `GET /books` has no documented request body.

**Optional query parameters:**
```text
title=<string>
author=<string>
```

**Documented response item schema:** `RestBook`

**Documented `RestBook` fields:**
```json
{
  "id": 1,
  "title": "Example title",
  "year": 2024,
  "price": 49.99,
  "coverUrl": "https://example.test/cover.jpg",
  "available": 10,
  "authors": [
    {
      "firstName": "Jane",
      "lastName": "Doe"
    }
  ]
}
```

---

# Test Cases

---

## Test Case ID
SCHEMA-BOOKS-GET-001

## Scenario
Successful response has documented HTTP status and JSON-compatible content type

## Purpose
Validate the operation-level response contract for `GET /books`.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
None

### Request Body
None

## Expected Status Code
200

## Expected Response
- Response body is valid JSON.
- Response represents an array of `RestBook` objects.
- Response content type is compatible with JSON, despite OpenAPI documenting response media type as `*/*`.

## Assertions
- Status code equals `200`.
- `Content-Type` response header contains `application/json` when present.
- Response body can be parsed as JSON.
- Parsed response body is not `null`.

---

## Test Case ID
SCHEMA-BOOKS-GET-002

## Scenario
Response body is a JSON array

## Purpose
Validate the top-level schema documented in OpenAPI: `type: array`, `items: RestBook`.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
None

### Request Body
None

## Expected Status Code
200

## Expected Response
Top-level response value is an array. The array may be empty because OpenAPI does not define a minimum item count.

## Assertions
- Status code equals `200`.
- Parsed response body is an array.
- Response body is not an object, string, number, boolean, or `null`.

---

## Test Case ID
SCHEMA-BOOKS-GET-003

## Scenario
Each book item contains only documented `RestBook` fields

## Purpose
Validate that book objects do not expose undocumented fields beyond the `RestBook` schema.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
None

### Request Body
None

## Expected Status Code
200

## Expected Response
Each array item is an object with no keys outside:
```text
id, title, year, price, coverUrl, available, authors
```

## Assertions
- Status code equals `200`.
- For each book item, value type is object and not array.
- For each book item, `Object.keys(item)` contains no keys outside the documented `RestBook` field list.

---

## Test Case ID
SCHEMA-BOOKS-GET-004

## Scenario
Scalar `RestBook` fields match documented data types

## Purpose
Validate primitive field types for each returned book.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
None

### Request Body
None

## Expected Status Code
200

## Expected Response
When present, fields use these documented types:
- `id`: integer, int64
- `title`: string
- `year`: integer, int32
- `price`: number
- `coverUrl`: string
- `available`: integer, int32

## Assertions
- Status code equals `200`.
- For each book where `id` is present, `id` is an integer.
- For each book where `title` is present, `title` is a string.
- For each book where `year` is present, `year` is an integer.
- For each book where `price` is present, `price` is a number.
- For each book where `coverUrl` is present, `coverUrl` is a string.
- For each book where `available` is present, `available` is an integer.

---

## Test Case ID
SCHEMA-BOOKS-GET-005

## Scenario
`authors` field matches documented array of `RestAuthor` objects

## Purpose
Validate nested array structure and nested author field types.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
None

### Request Body
None

## Expected Status Code
200

## Expected Response
When present, `authors` is an array of objects. Each author object may contain only:
```text
firstName, lastName
```

## Assertions
- Status code equals `200`.
- For each book where `authors` is present, `authors` is an array.
- For each nested author item, value type is object and not array.
- For each nested author item, `Object.keys(author)` contains no keys outside `firstName` and `lastName`.
- For each nested author where `firstName` is present, `firstName` is a string.
- For each nested author where `lastName` is present, `lastName` is a string.

---

## Test Case ID
SCHEMA-BOOKS-GET-006

## Scenario
`authors` array respects documented uniqueness

## Purpose
Validate `uniqueItems: true` on the `authors` field in `RestBook`.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
None

### Request Body
None

## Expected Status Code
200

## Expected Response
Each returned book has no duplicate author objects in the `authors` array when `authors` is present.

## Assertions
- Status code equals `200`.
- For each book where `authors` is present, serialized nested author objects are unique within that book.

---

## Test Case ID
SCHEMA-BOOKS-GET-007

## Scenario
No undocumented enum, date, UUID, pagination, or metadata structures are required

## Purpose
Explicitly validate absence of schema requirements not declared by OpenAPI for this operation.

## Request

### Headers
```http
Accept: application/json
```

### Path Params
None

### Query Params
None

### Request Body
None

## Expected Status Code
200

## Expected Response
Response is only an array of `RestBook` items. OpenAPI does not document enums, date fields, UUID fields, pagination object, metadata object, or response headers for this endpoint.

## Assertions
- Status code equals `200`.
- Parsed response body is an array.
- Do not assert enum values, date formats, UUID formats, pagination fields, metadata fields, or custom headers because they are not documented for `GET /books`.

---

# Notes

- OpenAPI documents response media type as `*/*`; JSON parsing is still required because the schema is an array/object contract.
- `RestBook` and `RestAuthor` schemas do not declare `required` fields, `nullable`, `additionalProperties`, minimum or maximum values, regex patterns, or formats for `coverUrl`.
- OpenAPI does not document pagination, sorting, authentication, custom response headers, or error responses for `GET /books`.
