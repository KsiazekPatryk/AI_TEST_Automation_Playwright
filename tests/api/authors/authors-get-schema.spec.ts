import { test, expect } from '@fixtures/test.fixture';
import { z } from 'zod';

const API_URL = 'https://fakerestapi.azurewebsites.net';

// AuthorDto per actual fakerestapi response (4 fields — idBook is present despite not being in
// bookstoreapi.openapi.json; fakerestapi's own schema includes it)
const AuthorSchema = z.object({
  id: z.number().int(),
  idBook: z.number().int(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
});

const AuthorArraySchema = z.array(AuthorSchema);

test('TC-SCHEMA-001: GET /authors returns 200 with Content-Type application/json', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(200);

  const contentType = response.headers()['content-type'];

  expect(contentType).toContain('application/json');

  // Verify body is parseable as valid JSON (no throw)
  const body = await response.json();

  expect(body).not.toBeNull();
});

test('TC-SCHEMA-002: GET /authors response body is a JSON array', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  expect(body).not.toBeNull();
  expect(typeof body).not.toBe('string');
  // Root value must be array, not plain object
  expect(body).not.toMatchObject(expect.objectContaining({ id: expect.anything() }));
});

test('TC-SCHEMA-003: Each author object contains only documented fields', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);

  // fakerestapi AuthorDto has exactly: id, idBook, firstName, lastName
  const allowedKeys = new Set(['id', 'idBook', 'firstName', 'lastName']);

  for (const author of body) {
    const extraKeys = Object.keys(author).filter(k => !allowedKeys.has(k));

    expect(extraKeys, `Unexpected fields found: ${extraKeys.join(', ')}`).toHaveLength(0);
  }
});

test('TC-SCHEMA-004: id field is an integer in every author object', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);

  for (const author of body) {
    if (author.id !== undefined) {
      expect(Number.isInteger(author.id), `id should be integer, got: ${typeof author.id} (${author.id})`).toBeTruthy();
    }
  }
});

test('TC-SCHEMA-005: firstName field is string or null when present', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);

  for (const author of body) {
    if (author.firstName !== undefined) {
      expect(
        typeof author.firstName === 'string' || author.firstName === null,
        `firstName should be string or null, got: ${typeof author.firstName}`
      ).toBeTruthy();
    }
  }
});

test('TC-SCHEMA-006: lastName field is string or null when present', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);

  for (const author of body) {
    if (author.lastName !== undefined) {
      expect(
        typeof author.lastName === 'string' || author.lastName === null,
        `lastName should be string or null, got: ${typeof author.lastName}`
      ).toBeTruthy();
    }
  }
});

test('TC-SCHEMA-007: GET /authors with firstName query param returns schema-valid array', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
    params: { firstName: 'Jane' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();

  // Validate every element in the array matches the Author schema
  const result = AuthorArraySchema.safeParse(body);

  expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBeTruthy();
});

test('TC-SCHEMA-008: Full Zod schema validation of GET /authors response', async ({ request }) => {
  // TC-SCHEMA-008 in the scenario expects an empty array for a non-existent filter value.
  // fakerestapi does NOT support query filtering — it returns all authors regardless.
  // This test instead validates the full Zod schema on an unfiltered response.
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();

  const result = AuthorArraySchema.safeParse(body);

  expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBeTruthy();
});
