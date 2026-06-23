import { test, expect } from '@fixtures/test.fixture';

const API_URL = 'https://fakerestapi.azurewebsites.net';

// NOTE: fakerestapi.azurewebsites.net does NOT support query parameter filtering.
// TC-NEG-001, 002, 003 verify the endpoint accepts filter params without error (200 + array).
// The API returns all authors regardless of filter values — empty array assertions are omitted.

test('TC-NEG-001: GET /authors with non-matching firstName returns 200 and an array', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
    params: { firstName: '__nonexistent_xyz_12345__' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  // API does not filter — all authors are returned; no author has this firstName
  expect(body.every((a: { firstName: string | null }) => a.firstName !== '__nonexistent_xyz_12345__')).toBeTruthy();
});

test('TC-NEG-002: GET /authors with non-matching lastName returns 200 and an array', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
    params: { lastName: '__nonexistent_xyz_12345__' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  expect(body.every((a: { lastName: string | null }) => a.lastName !== '__nonexistent_xyz_12345__')).toBeTruthy();
});

test('TC-NEG-003: GET /authors with non-matching firstName+lastName combination returns 200 and an array', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
    params: { firstName: 'Jane', lastName: 'Smith' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  // No seeded author has firstName=Jane AND lastName=Smith
  expect(body.every((a: { firstName: string | null; lastName: string | null }) => !(a.firstName === 'Jane' && a.lastName === 'Smith'))).toBeTruthy();
});

test('TC-NEG-004: GET /authors with unknown query param returns 200 and a non-empty array', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
    params: { foo: 'bar' },
  });

  expect(response.status()).not.toBe(500);
  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
});

test('TC-NEG-005: DELETE /authors collection (no ID) returns 405', async ({ request }) => {
  const response = await request.delete(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(405);
});

test('TC-NEG-006: PUT /authors collection (no ID) returns 405', async ({ request }) => {
  const response = await request.put(`${API_URL}/api/v1/Authors`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: { firstName: 'Test', lastName: 'Author' },
  });

  expect(response.status()).toBe(405);
});

test('TC-NEG-007: GET /authors with Accept: application/xml falls back to application/json (not 500)', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/xml' },
  });

  expect(response.status()).not.toBe(500);
  // This API falls back to application/json instead of returning 406
  expect(response.status()).toBe(200);

  const contentType = response.headers()['content-type'];

  expect(contentType).toContain('application/json');
});

test('TC-NEG-008: GET /authors with empty firstName param returns 200 and an array', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors?firstName=`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).not.toBe(500);
  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
});
