# POST /books Positive Scenarios

---

# Endpoint Information

- Method: POST
- Endpoint: `/books`
- Description: `createBook` operation from `books-controller`. Creates a book request resource according to `CreateBookPayload`. OpenAPI documents only `201 Created` with response schema `type: object`.

---

# Preconditions

- Use the OpenAPI server URL: `http://bookstoreapi.up.railway.app`.
- No authentication requirements are documented for this operation.
- Send request body as `application/json`.
- Use unique `authors` integer IDs in each payload because OpenAPI defines `uniqueItems: true`.

---

# Test Data

Reusable valid payload:

```json
{
  "title": "Positive Contract Book",
  "authors": [1],
  "year": 2026,
  "price": 49.99,
  "available": 10
}
```

Positive boundary values documented in OpenAPI:

```json
{
  "price": [0.01, 1000],
  "available": [1, 10000]
}
```

---

# Test Cases

## Test Case ID
TC-POS-BOOKS-POST-001

## Scenario
Create a book with all documented request properties.

## Purpose
Verify successful creation when request body includes all fields defined in `CreateBookPayload`.

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
  "title": "Positive Contract Book 001",
  "authors": [1],
  "year": 2026,
  "price": 49.99,
  "available": 10
}
```

## Expected Status Code
`201 Created`

## Expected Response
Response body is an object. No response properties are documented in OpenAPI for `201`.

## Assertions
- Assert status code is `201`.
- Assert response body is an object.
- Assert request included documented optional field `title` as a string.
- Assert request included required fields `authors`, `year`, `price`, and `available`.

---

## Test Case ID
TC-POS-BOOKS-POST-002

## Scenario
Create a book without optional `title`.

## Purpose
Verify OpenAPI contract behavior when only required fields are sent.

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
  "authors": [1],
  "year": 2026,
  "price": 49.99,
  "available": 10
}
```

## Expected Status Code
`201 Created`

## Expected Response
Response body is an object.

## Assertions
- Assert status code is `201` because `title` is not required by OpenAPI.
- Assert response body is an object.
- Assert no test assertion requires `title` to exist in the response because the `201` response properties are undocumented.

---

## Test Case ID
TC-POS-BOOKS-POST-003

## Scenario
Create a book with multiple unique authors.

## Purpose
Verify a valid `authors` array containing unique `int64` values is accepted.

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
  "title": "Positive Contract Book 003",
  "authors": [1, 2],
  "year": 2026,
  "price": 49.99,
  "available": 10
}
```

## Expected Status Code
`201 Created`

## Expected Response
Response body is an object.

## Assertions
- Assert status code is `201`.
- Assert `authors` request array contains unique integer values.
- Assert response body is an object.

---

## Test Case ID
TC-POS-BOOKS-POST-004

## Scenario
Create a book using minimum documented boundaries.

## Purpose
Verify inclusive minimum values documented in OpenAPI are accepted.

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
  "title": "Positive Contract Book 004",
  "authors": [1],
  "year": 2026,
  "price": 0.01,
  "available": 1
}
```

## Expected Status Code
`201 Created`

## Expected Response
Response body is an object.

## Assertions
- Assert status code is `201`.
- Assert request `price` equals documented inclusive minimum `0.01`.
- Assert request `available` equals documented minimum `1`.
- Assert response body is an object.

---

## Test Case ID
TC-POS-BOOKS-POST-005

## Scenario
Create a book using maximum documented boundaries.

## Purpose
Verify inclusive maximum values documented in OpenAPI are accepted.

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
  "title": "Positive Contract Book 005",
  "authors": [1],
  "year": 2026,
  "price": 1000,
  "available": 10000
}
```

## Expected Status Code
`201 Created`

## Expected Response
Response body is an object.

## Assertions
- Assert status code is `201`.
- Assert request `price` equals documented inclusive maximum `1000`.
- Assert request `available` equals documented maximum `10000`.
- Assert response body is an object.

---

# Notes

- OpenAPI documents no response body fields for `201`, so these scenarios do not assert persistence, generated IDs, echoed payload fields, author details, or cover data.
- OpenAPI documents no pagination, filtering, sorting, search, idempotency, authentication, state transition, or conflict behavior for `POST /books`; those were excluded.
- OpenAPI defines no minimum or maximum for `year`, so no year boundary success case is included.
