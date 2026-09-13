# POST /books Negative Scenarios & Business Validations

---

# Endpoint Information

- Method: POST
- Endpoint: `/books`
- Description: `createBook` operation from `books-controller`. Creates a book request resource according to `CreateBookPayload`. OpenAPI documents only `201 Created` and does not document error responses.

---

# Preconditions

- Use the OpenAPI server URL: `http://bookstoreapi.up.railway.app`.
- No authentication requirements are documented for this operation.
- Send request body as `application/json` unless the test case explicitly validates malformed input.
- Treat expected error status codes and error body shapes as undocumented contract gaps because OpenAPI defines no non-2xx responses for `POST /books`.

---

# Test Data

Valid base payload for mutation:

```json
{
  "title": "Negative Contract Book",
  "authors": [1],
  "year": 2026,
  "price": 49.99,
  "available": 10
}
```

Invalid values derived from documented `CreateBookPayload` constraints:

```json
{
  "missingRequiredFields": ["authors", "year", "price", "available"],
  "duplicateAuthors": [1, 1],
  "priceBelowMinimum": 0,
  "priceAboveMaximum": 1000.01,
  "availableBelowMinimum": 0,
  "availableAboveMaximum": 10001
}
```

---

# Test Cases

## Test Case ID
TC-NEG-BOOKS-POST-001

## Scenario
Missing required field `authors`.

## Purpose
Validate documented required-field enforcement for `authors`.

## Request

### Headers

```http
Content-Type: application/json
Accept: */*
```

### Path Params
None.

### Query Params
None.

### Request Body

```json
{
  "title": "Negative Contract Book 001",
  "year": 2026,
  "price": 49.99,
  "available": 10
}
```

## Expected Status Code
Not documented in OpenAPI. Automation should assert that the actual status is not `201` and report a contract gap until OpenAPI defines the expected error status.

## Expected Response
Error response schema is not documented in OpenAPI.

## Assertions
- Assert request omits documented required field `authors`.
- Assert response status is not `201`.
- Capture actual status code and response body for contract-gap reporting.
- Do not assert an error field name or message because no error schema is documented.

---

## Test Case ID
TC-NEG-BOOKS-POST-002

## Scenario
Missing required field `year`.

## Purpose
Validate documented required-field enforcement for `year`.

## Request

### Headers

```http
Content-Type: application/json
Accept: */*
```

### Path Params
None.

### Query Params
None.

### Request Body

```json
{
  "title": "Negative Contract Book 002",
  "authors": [1],
  "price": 49.99,
  "available": 10
}
```

## Expected Status Code
Not documented in OpenAPI. Automation should assert that the actual status is not `201` and report a contract gap until OpenAPI defines the expected error status.

## Expected Response
Error response schema is not documented in OpenAPI.

## Assertions
- Assert request omits documented required field `year`.
- Assert response status is not `201`.
- Capture actual status code and response body for contract-gap reporting.

---

## Test Case ID
TC-NEG-BOOKS-POST-003

## Scenario
Missing required field `price`.

## Purpose
Validate documented required-field enforcement for `price`.

## Request

### Headers

```http
Content-Type: application/json
Accept: */*
```

### Path Params
None.

### Query Params
None.

### Request Body

```json
{
  "title": "Negative Contract Book 003",
  "authors": [1],
  "year": 2026,
  "available": 10
}
```

## Expected Status Code
Not documented in OpenAPI. Automation should assert that the actual status is not `201` and report a contract gap until OpenAPI defines the expected error status.

## Expected Response
Error response schema is not documented in OpenAPI.

## Assertions
- Assert request omits documented required field `price`.
- Assert response status is not `201`.
- Capture actual status code and response body for contract-gap reporting.

---

## Test Case ID
TC-NEG-BOOKS-POST-004

## Scenario
Missing required field `available`.

## Purpose
Validate documented required-field enforcement for `available`.

## Request

### Headers

```http
Content-Type: application/json
Accept: */*
```

### Path Params
None.

### Query Params
None.

### Request Body

```json
{
  "title": "Negative Contract Book 004",
  "authors": [1],
  "year": 2026,
  "price": 49.99
}
```

## Expected Status Code
Not documented in OpenAPI. Automation should assert that the actual status is not `201` and report a contract gap until OpenAPI defines the expected error status.

## Expected Response
Error response schema is not documented in OpenAPI.

## Assertions
- Assert request omits documented required field `available`.
- Assert response status is not `201`.
- Capture actual status code and response body for contract-gap reporting.

---

## Test Case ID
TC-NEG-BOOKS-POST-005

## Scenario
`authors` contains duplicate items.

## Purpose
Validate documented `uniqueItems: true` constraint for `authors`.

## Request

### Headers

```http
Content-Type: application/json
Accept: */*
```

### Path Params
None.

### Query Params
None.

### Request Body

```json
{
  "title": "Negative Contract Book 005",
  "authors": [1, 1],
  "year": 2026,
  "price": 49.99,
  "available": 10
}
```

## Expected Status Code
Not documented in OpenAPI. Automation should assert that the actual status is not `201` and report a contract gap until OpenAPI defines the expected error status.

## Expected Response
Error response schema is not documented in OpenAPI.

## Assertions
- Assert request violates `authors.uniqueItems: true`.
- Assert response status is not `201`.
- Capture actual status code and response body for contract-gap reporting.

---

## Test Case ID
TC-NEG-BOOKS-POST-006

## Scenario
`price` below documented minimum.

## Purpose
Validate documented inclusive minimum constraint `price >= 0.01`.

## Request

### Headers

```http
Content-Type: application/json
Accept: */*
```

### Path Params
None.

### Query Params
None.

### Request Body

```json
{
  "title": "Negative Contract Book 006",
  "authors": [1],
  "year": 2026,
  "price": 0,
  "available": 10
}
```

## Expected Status Code
Not documented in OpenAPI. Automation should assert that the actual status is not `201` and report a contract gap until OpenAPI defines the expected error status.

## Expected Response
Error response schema is not documented in OpenAPI.

## Assertions
- Assert request `price` is below documented minimum `0.01`.
- Assert response status is not `201`.
- Capture actual status code and response body for contract-gap reporting.

---

## Test Case ID
TC-NEG-BOOKS-POST-007

## Scenario
`price` above documented maximum.

## Purpose
Validate documented inclusive maximum constraint `price <= 1000`.

## Request

### Headers

```http
Content-Type: application/json
Accept: */*
```

### Path Params
None.

### Query Params
None.

### Request Body

```json
{
  "title": "Negative Contract Book 007",
  "authors": [1],
  "year": 2026,
  "price": 1000.01,
  "available": 10
}
```

## Expected Status Code
Not documented in OpenAPI. Automation should assert that the actual status is not `201` and report a contract gap until OpenAPI defines the expected error status.

## Expected Response
Error response schema is not documented in OpenAPI.

## Assertions
- Assert request `price` is above documented maximum `1000`.
- Assert response status is not `201`.
- Capture actual status code and response body for contract-gap reporting.

---

## Test Case ID
TC-NEG-BOOKS-POST-008

## Scenario
`available` below documented minimum.

## Purpose
Validate documented minimum constraint `available >= 1`.

## Request

### Headers

```http
Content-Type: application/json
Accept: */*
```

### Path Params
None.

### Query Params
None.

### Request Body

```json
{
  "title": "Negative Contract Book 008",
  "authors": [1],
  "year": 2026,
  "price": 49.99,
  "available": 0
}
```

## Expected Status Code
Not documented in OpenAPI. Automation should assert that the actual status is not `201` and report a contract gap until OpenAPI defines the expected error status.

## Expected Response
Error response schema is not documented in OpenAPI.

## Assertions
- Assert request `available` is below documented minimum `1`.
- Assert response status is not `201`.
- Capture actual status code and response body for contract-gap reporting.

---

## Test Case ID
TC-NEG-BOOKS-POST-009

## Scenario
`available` above documented maximum.

## Purpose
Validate documented maximum constraint `available <= 10000`.

## Request

### Headers

```http
Content-Type: application/json
Accept: */*
```

### Path Params
None.

### Query Params
None.

### Request Body

```json
{
  "title": "Negative Contract Book 009",
  "authors": [1],
  "year": 2026,
  "price": 49.99,
  "available": 10001
}
```

## Expected Status Code
Not documented in OpenAPI. Automation should assert that the actual status is not `201` and report a contract gap until OpenAPI defines the expected error status.

## Expected Response
Error response schema is not documented in OpenAPI.

## Assertions
- Assert request `available` is above documented maximum `10000`.
- Assert response status is not `201`.
- Capture actual status code and response body for contract-gap reporting.

---

## Test Case ID
TC-NEG-BOOKS-POST-010

## Scenario
Invalid primitive types in request body.

## Purpose
Validate documented type constraints for `CreateBookPayload`.

## Request

### Headers

```http
Content-Type: application/json
Accept: */*
```

### Path Params
None.

### Query Params
None.

### Request Body

```json
{
  "title": 123,
  "authors": "1",
  "year": "2026",
  "price": "49.99",
  "available": "10"
}
```

## Expected Status Code
Not documented in OpenAPI. Automation should assert that the actual status is not `201` and report a contract gap until OpenAPI defines the expected error status.

## Expected Response
Error response schema is not documented in OpenAPI.

## Assertions
- Assert request violates documented type `title: string`.
- Assert request violates documented type `authors: array`.
- Assert request violates documented type `year: integer`.
- Assert request violates documented type `price: number`.
- Assert request violates documented type `available: integer`.
- Assert response status is not `201`.
- Capture actual status code and response body for contract-gap reporting.

---

# Notes

- OpenAPI documents no `400`, `401`, `403`, `404`, `409`, or other error response for `POST /books`; therefore exact negative expected status codes and error schemas are intentionally marked as undocumented.
- `title` is not included in negative required-field scenarios because OpenAPI does not list `title` as required and defines no min length, max length, pattern, or uniqueness rule.
- OpenAPI defines no business validations for existing author IDs, duplicate titles, authorization, malformed JSON responses, state transitions, pagination, filtering, sorting, or search for this operation; those were excluded.
- OpenAPI defines no minimum or maximum for `year`; only type validation is covered.
