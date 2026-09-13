# PATCH /authors/{id} - Negative Scenarios & Business Validations

---

# Endpoint Information

- Method: PATCH
- Endpoint: `/authors/{id}`
- Description: `partialUpdateAuthor` partially updates an author resource identified by `{id}`. OpenAPI documents only `200` for success and does not document error responses.

---

# Preconditions

- API server is reachable at the base URL configured for the test environment.
- An author resource exists for request-body validation probes where an existing `id` is required.
- Request body is sent as `application/json` unless a content-type validation scenario intentionally omits or changes it.
- No authentication requirement is documented for this operation.

---

# Test Data

```json
// Existing author path parameter
{ "id": 1 }

// Invalid path parameter type per OpenAPI
{ "id": "abc" }

// Invalid request body: top-level array, but schema requires object
[
  { "firstName": { "value": "Jane" } }
]

// Invalid request body: property value is string, but additionalProperties requires object values
{
  "firstName": "Jane"
}

// Invalid request body: property value is null, but nullable is not documented
{
  "firstName": null
}

// Missing request body: requestBody.required is true
```

---

# Test Cases

## Test Case ID

TC-NEG-AUTHORS-ID-PATCH-001

## Scenario

PATCH with non-integer `id` path parameter.

## Purpose

Validate the documented path parameter type constraint: `id` must be an integer with int64 format.

## Request

### Headers

- `Content-Type: application/json`

### Path Params

- `id`: `abc`

### Query Params

- None documented

### Request Body

```json
{}
```

## Expected Status Code

No negative status code is documented in OpenAPI for this operation.

## Expected Response

- Error response schema is not documented.
- Automation must not assert a specific error body until the contract documents it.

## Assertions

- Request is invalid against the OpenAPI path parameter schema.
- Do not assert undocumented `400`, `404`, or other error status as contract truth.
- Record the actual runtime status as a contract gap if automation executes this scenario.

---

## Test Case ID

TC-NEG-AUTHORS-ID-PATCH-002

## Scenario

PATCH without request body.

## Purpose

Validate the documented request body requirement: `requestBody.required` is `true`.

## Request

### Headers

- `Content-Type: application/json`

### Path Params

- `id`: existing author ID, integer, int64

### Query Params

- None documented

### Request Body

- Omitted

## Expected Status Code

No negative status code is documented in OpenAPI for this operation.

## Expected Response

- Error response schema is not documented.
- Automation must not assert a specific error body until the contract documents it.

## Assertions

- Request is invalid against the OpenAPI operation contract because the body is required.
- Do not assert undocumented `400`, `415`, or other error status as contract truth.
- Record the actual runtime status as a contract gap if automation executes this scenario.

---

## Test Case ID

TC-NEG-AUTHORS-ID-PATCH-003

## Scenario

PATCH with array request body.

## Purpose

Validate that the request body must be a JSON object, not an array.

## Request

### Headers

- `Content-Type: application/json`

### Path Params

- `id`: existing author ID, integer, int64

### Query Params

- None documented

### Request Body

```json
[
  { "firstName": { "value": "Jane" } }
]
```

## Expected Status Code

No negative status code is documented in OpenAPI for this operation.

## Expected Response

- Error response schema is not documented.

## Assertions

- Request body is invalid against the documented schema because the top-level type is array, not object.
- Do not assert an undocumented concrete error status.
- Record the actual runtime status as a contract gap if automation executes this scenario.

---

## Test Case ID

TC-NEG-AUTHORS-ID-PATCH-004

## Scenario

PATCH with string-valued additional property.

## Purpose

Validate the documented `additionalProperties` rule: top-level property values must be objects.

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
  "firstName": "Jane"
}
```

## Expected Status Code

No negative status code is documented in OpenAPI for this operation.

## Expected Response

- Error response schema is not documented.

## Assertions

- Request body is invalid against the documented schema because `firstName` value is a string, not an object.
- Do not assert an undocumented concrete error status.
- Record the actual runtime status as a contract gap if automation executes this scenario.

---

## Test Case ID

TC-NEG-AUTHORS-ID-PATCH-005

## Scenario

PATCH with null-valued additional property.

## Purpose

Validate that `null` values are not documented as allowed for additional properties.

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
  "firstName": null
}
```

## Expected Status Code

No negative status code is documented in OpenAPI for this operation.

## Expected Response

- Error response schema is not documented.

## Assertions

- Request body is invalid against the documented schema because the property value is `null`, while the schema requires an object value and does not document `nullable: true`.
- Do not assert an undocumented concrete error status.
- Record the actual runtime status as a contract gap if automation executes this scenario.

---

## Test Case ID

TC-NEG-AUTHORS-ID-PATCH-006

## Scenario

PATCH with malformed JSON body.

## Purpose

Validate that malformed JSON cannot satisfy the documented `application/json` request body contract.

## Request

### Headers

- `Content-Type: application/json`

### Path Params

- `id`: existing author ID, integer, int64

### Query Params

- None documented

### Request Body

```text
{ "firstName": { "value": "Jane" }
```

## Expected Status Code

No negative status code is documented in OpenAPI for this operation.

## Expected Response

- Error response schema is not documented.

## Assertions

- Request body is invalid JSON and cannot be validated as the documented JSON object schema.
- Do not assert an undocumented concrete error status.
- Record the actual runtime status as a contract gap if automation executes this scenario.

---

# Notes

- OpenAPI documents no `400`, `401`, `403`, `404`, `409`, `415`, or validation-error response for `PATCH /authors/{id}`.
- Negative runtime scenarios are therefore listed as contract-invalid requests, but deterministic expected error status codes and error-body assertions cannot be defined from OpenAPI alone.
- No authentication, authorization, not-found, conflict, boundary, enum, format, or business-rule validations are documented for this operation.
- A non-existing author ID scenario is not included as an executable negative contract case because OpenAPI does not document a not-found response for this operation.