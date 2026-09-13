# PATCH /authors/{id} - Positive Scenarios

---

# Endpoint Information

- Method: PATCH
- Endpoint: `/authors/{id}`
- Description: `partialUpdateAuthor` partially updates an author resource identified by `{id}`. OpenAPI documents only a generic JSON object request body and a generic object response for successful requests.

---

# Preconditions

- API server is reachable at the base URL configured for the test environment.
- A dedicated author resource exists for each scenario and its `id` is available.
- Request body is sent as `application/json`.
- No authentication requirement is documented for this operation.

---

# Test Data

```json
// Existing author path parameter
{ "id": 1 }

// Object-valued single-property payload
{
  "firstName": { "value": "Jane" }
}

// Object-valued multi-property payload
{
  "firstName": { "value": "Jane" },
  "lastName": { "value": "Austen" }
}

// Empty payload accepted by documented schema because no required fields are defined
{}
```

---

# Test Cases

## Test Case ID

TC-POS-AUTHORS-ID-PATCH-001

## Scenario

Partially update an existing author with one object-valued property.

## Purpose

Validate the primary successful PATCH path using a request body that conforms to the documented schema.

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

## Assertions

- Status code is `200`.
- Response body is parseable as JSON.
- Response body is a non-null object.
- No array or primitive response body is returned.

---

## Test Case ID

TC-POS-AUTHORS-ID-PATCH-002

## Scenario

Partially update an existing author with multiple object-valued properties.

## Purpose

Validate that the documented `additionalProperties` object contract supports multiple patch properties.

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
  "firstName": { "value": "Jane" },
  "lastName": { "value": "Austen" }
}
```

## Expected Status Code

`200`

## Expected Response

- Body is a JSON object.

## Assertions

- Status code is `200`.
- Response body is a non-null JSON object.
- Request body top-level properties are accepted when each value is an object.

---

## Test Case ID

TC-POS-AUTHORS-ID-PATCH-003

## Scenario

PATCH existing author with an empty object body.

## Purpose

Validate the successful boundary allowed by the documented schema: no required fields are defined.

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
- Response body is a non-null object.

---

## Test Case ID

TC-POS-AUTHORS-ID-PATCH-004

## Scenario

PATCH existing author with an undocumented object-valued property.

## Purpose

Validate that arbitrary additional property names are allowed by the documented `additionalProperties` request schema.

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
  "metadata": { "source": "api-contract" }
}
```

## Expected Status Code

`200`

## Expected Response

- Body is a JSON object.

## Assertions

- Status code is `200`.
- Request body is valid against the documented PATCH request schema.
- Response body is a non-null JSON object.

---

# Notes

- OpenAPI does not document which author fields can be partially updated or how field values should be represented semantically.
- Because the PATCH request schema is generic, these positive scenarios validate only the documented object shape and successful `200` contract.
- Data persistence validation after PATCH is not included because OpenAPI does not define response fields or patch semantics for `firstName` and `lastName` in this operation.
- Filtering, sorting, pagination, idempotency, and state transitions are not documented for this operation.