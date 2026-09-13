# PATCH /authors/{id} - Schema Validation Scenarios

---

# Endpoint Information

- Method: PATCH
- Endpoint: `/authors/{id}`
- Description: `partialUpdateAuthor` partially updates an author resource identified by `{id}`. OpenAPI documents the request body as a generic JSON object with object-valued additional properties and the success response as a generic object.

---

# Preconditions

- API server is reachable at the base URL configured for the test environment.
- An author resource exists and its `id` is available for successful PATCH requests.
- Request body is sent as `application/json`.
- No authentication requirement is documented for this operation.

---

# Test Data

```json
// Existing author path parameter
{ "id": 1 }

// Valid payload per documented PATCH schema: object with object-valued additional properties
{
  "firstName": { "value": "Jane" }
}

// Valid empty JSON object per documented PATCH schema: no required fields are defined
{}
```

---

# Test Cases

## Test Case ID

TC-SCHEMA-AUTHORS-ID-PATCH-001

## Scenario

Successful PATCH returns the documented status code.

## Purpose

Validate that the operation returns the OpenAPI-documented success status for a schema-valid request.

## Request

### Headers

- `Content-Type: application/json`

### Path Params

- `id`: existing author ID, integer, int64

### Query Params

- None documented

### Request Body

```json
{
  "firstName": { "value": "Jane" }
}
```

## Expected Status Code

`200`

## Expected Response

- Body is a JSON object.
- Response schema is documented as `{ "type": "object" }`.

## Assertions

- Status code is `200`.
- Response body is parseable as JSON.
- Response body is an object.
- Response body is not `null`.
- Response body is not an array.

---

## Test Case ID

TC-SCHEMA-AUTHORS-ID-PATCH-002

## Scenario

Path parameter `id` follows the documented integer int64 contract.

## Purpose

Validate that the request uses the documented required path parameter type.

## Request

### Headers

- `Content-Type: application/json`

### Path Params

- `id`: existing author ID, integer, int64

### Query Params

- None documented

### Request Body

```json
{}
```

## Expected Status Code

`200`

## Expected Response

- Body is a JSON object.

## Assertions

- Request path contains a numeric integer `id` value.
- Status code is `200`.
- Response body is a non-null JSON object.

---

## Test Case ID

TC-SCHEMA-AUTHORS-ID-PATCH-003

## Scenario

Request body accepts an empty JSON object.

## Purpose

Validate that no required request properties are enforced by the documented PATCH schema.

## Request

### Headers

- `Content-Type: application/json`

### Path Params

- `id`: existing author ID, integer, int64

### Query Params

- None documented

### Request Body

```json
{}
```

## Expected Status Code

`200`

## Expected Response

- Body is a JSON object.

## Assertions

- Status code is `200`.
- Response body is parseable as JSON.
- Response body matches the documented top-level object response schema.

---

## Test Case ID

TC-SCHEMA-AUTHORS-ID-PATCH-004

## Scenario

Request body allows additional properties with object values.

## Purpose

Validate the documented `additionalProperties` contract for the PATCH request body.

## Request

### Headers

- `Content-Type: application/json`

### Path Params

- `id`: existing author ID, integer, int64

### Query Params

- None documented

### Request Body

```json
{
  "lastName": { "value": "Austen" },
  "metadata": { "source": "contract-test" }
}
```

## Expected Status Code

`200`

## Expected Response

- Body is a JSON object.

## Assertions

- Status code is `200`.
- Request body is a JSON object.
- Every supplied top-level property value in the request body is an object.
- Response body is a non-null JSON object.

---

## Test Case ID

TC-SCHEMA-AUTHORS-ID-PATCH-005

## Scenario

Request body content type is `application/json`.

## Purpose

Validate the documented request content type for PATCH.

## Request

### Headers

- `Content-Type: application/json`

### Path Params

- `id`: existing author ID, integer, int64

### Query Params

- None documented

### Request Body

```json
{
  "firstName": { "value": "Charlotte" }
}
```

## Expected Status Code

`200`

## Expected Response

- Body is a JSON object.

## Assertions

- Request is sent with `Content-Type: application/json`.
- Status code is `200`.
- Response body is parseable as JSON.

---

# Notes

- OpenAPI documents PATCH for authors as `/authors/{id}`; no other PATCH operation for `/authors` is documented.
- Response content type is documented as `*/*`, so a stricter response `Content-Type` assertion is not defined by the contract.
- The PATCH request schema does not reference `CreateAuthorPayload`, `UpdateAuthorPayload`, or `Author`; it is a generic object with object-valued additional properties.
- No required request fields, nullable rules, enums, min/max constraints, regex patterns, examples, pagination, response headers, or authentication requirements are documented for this operation.