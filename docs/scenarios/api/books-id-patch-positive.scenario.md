# PATCH /books/{id} Positive Scenarios

# Endpoint Information

- Method: PATCH
- Endpoint: /books/{id}
- Description: Partial update of a book. OpenAPI operationId: `partialUpdateBook`. No textual operation description is documented.

# Preconditions

- A book resource exists and its `id` value is known.
- Test setup can create or select a stable existing book before execution.
- No authentication requirement is documented in OpenAPI.

# Test Data

- Existing book id: integer int64.
- Valid minimal request body: `{}`.
- Valid object-valued patch payload: `{ "metadata": { "source": "positive-contract-test" } }`.
- Required request content type: `application/json`.
- Expected success status: `200`.

# Test Cases

## Test Case ID

PATCH-BOOKS-ID-POS-001

## Scenario

Send a documented minimal partial update request for an existing book.

## Purpose

Validate the successful behavior that is explicitly supported by the OpenAPI request contract: required request body is present and contains no required fields.

## Request

### Headers

- Content-Type: application/json
- Accept: */*

### Path Params

- id: existing book id, integer int64, required

### Query Params

- None documented

### Request Body

```json
{}
```

## Expected Status Code

200

## Expected Response

- Body is an object.

## Assertions

- Assert status code is `200`.
- Assert response body is an object.
- Assert request body is present.
- Assert no required request field is missing because no PATCH body properties are documented as required.
- Do not assert persistence of any book field because updateable PATCH fields are not documented.

## Test Case ID

PATCH-BOOKS-ID-POS-002

## Scenario

Send a documented object-valued partial update request for an existing book.

## Purpose

Validate successful handling of a request body that conforms to `additionalProperties: { type: object }`.

## Request

### Headers

- Content-Type: application/json
- Accept: */*

### Path Params

- id: existing book id, integer int64, required

### Query Params

- None documented

### Request Body

```json
{
  "metadata": {
    "source": "positive-contract-test"
  }
}
```

## Expected Status Code

200

## Expected Response

- Body is an object.

## Assertions

- Assert status code is `200`.
- Assert response body is an object.
- Assert request body is an object.
- Assert each provided additional property value is an object, matching the documented request schema.
- Do not assert field-level update results because OpenAPI does not document PATCH field names or response properties.

# Notes

- Positive scenarios are limited to contract-valid request shapes because OpenAPI does not document specific partial-update fields such as `title`, `authors`, `year`, `price`, or `available` for PATCH.
- OpenAPI does not document idempotency, filtering, sorting, pagination, search, state transitions, or data persistence expectations for this PATCH operation.
- No positive authentication variant is included because no authentication requirement is documented.