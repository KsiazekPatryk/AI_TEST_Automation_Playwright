# POST /books Schema Validation

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
- Use unique integer values in `authors` because OpenAPI defines `uniqueItems: true`.

---

# Test Data

Valid payload for schema checks:

```json
{
  "title": "Schema Contract Book",
  "authors": [1],
  "year": 2026,
  "price": 49.99,
  "available": 10
}
```

Boundary values documented in `CreateBookPayload`:

```json
{
  "priceMinimum": 0.01,
  "priceMaximum": 1000,
  "availableMinimum": 1,
  "availableMaximum": 10000
}
```

---

# Test Cases

## Test Case ID
TC-SCHEMA-BOOKS-POST-001

## Scenario
Validate documented success status and response media type.

## Purpose
Confirm that a valid `CreateBookPayload` returns the only success response documented for `POST /books`.

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
  "title": "Schema Contract Book 001",
  "authors": [1],
  "year": 2026,
  "price": 49.99,
  "available": 10
}
```

## Expected Status Code
`201 Created`

## Expected Response
Response body is a JSON object. OpenAPI defines the response schema only as `type: object` and does not document response properties.

## Assertions
- Assert status code is `201`.
- Assert response body is an object.
- Assert response body is not an array.
- Assert response body is not `null`.
- Assert response `Content-Type` is compatible with the documented `*/*` response content and can be parsed as JSON when body is returned as JSON.

---

## Test Case ID
TC-SCHEMA-BOOKS-POST-002

## Scenario
Validate request schema required fields.

## Purpose
Confirm automation sends every field required by `CreateBookPayload`.

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
Response body is a JSON object.

## Assertions
- Assert request body includes required field `authors`.
- Assert request body includes required field `year`.
- Assert request body includes required field `price`.
- Assert request body includes required field `available`.
- Assert `title` is not treated as required because it is not listed in the OpenAPI `required` array.
- Assert status code is `201`.

---

## Test Case ID
TC-SCHEMA-BOOKS-POST-003

## Scenario
Validate request field types and formats.

## Purpose
Confirm `CreateBookPayload` values match documented primitive types and integer formats.

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
  "title": "Schema Contract Book 003",
  "authors": [1, 2],
  "year": 2026,
  "price": 49.99,
  "available": 10
}
```

## Expected Status Code
`201 Created`

## Expected Response
Response body is a JSON object.

## Assertions
- Assert `title` is a string when provided.
- Assert `authors` is an array.
- Assert each `authors` item is an integer compatible with `int64`.
- Assert `authors` contains unique items.
- Assert `year` is an integer compatible with `int32`.
- Assert `price` is a number.
- Assert `available` is an integer compatible with `int32`.
- Assert status code is `201`.

---

## Test Case ID
TC-SCHEMA-BOOKS-POST-004

## Scenario
Validate documented numeric boundaries in request schema.

## Purpose
Confirm boundary values documented in OpenAPI are represented in contract-level schema checks.

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
  "title": "Schema Contract Book 004",
  "authors": [1],
  "year": 2026,
  "price": 0.01,
  "available": 1
}
```

## Expected Status Code
`201 Created`

## Expected Response
Response body is a JSON object.

## Assertions
- Assert `price` is greater than or equal to `0.01` because `exclusiveMinimum` is `false`.
- Assert `price` is less than or equal to `1000` because `exclusiveMaximum` is `false`.
- Assert `available` is greater than or equal to `1`.
- Assert `available` is less than or equal to `10000`.
- Assert status code is `201`.

---

# Notes

- OpenAPI documents `POST /books` exactly as `/books`; no endpoint path adjustment was needed.
- The `201` response schema is only `type: object`; no response fields such as `id`, `title`, `authors`, or timestamps are documented for this operation.
- OpenAPI does not mark any fields as nullable and does not define enums, pagination, response headers, or `additionalProperties` behavior for this operation.
- `title` is optional according to OpenAPI because it is present in `properties` but absent from `required`.
- OpenAPI documents no authentication requirement and no non-2xx responses for this operation.
