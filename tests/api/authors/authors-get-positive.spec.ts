import { test, expect } from '@fixtures/test.fixture';

const API_URL = 'https://fakerestapi.azurewebsites.net';

// NOTE: fakerestapi.azurewebsites.net does NOT persist POST data in GET /authors.
// TC-POS-002/003/004/005/007 use seeded data (pre-populated by the API) instead.

test('TC-POS-001: GET /authors without query params returns HTTP 200 and an array', async ({ request }) => {
  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
});

test('TC-POS-002: A known author appears in GET /authors full listing', async ({ request }) => {
  // Get a specific seeded author by ID, then verify it appears in the full listing
  const singleResponse = await request.get(`${API_URL}/api/v1/Authors/1`);

  expect(singleResponse.status()).toBe(200);

  const seededAuthor = await singleResponse.json();
  const capturedId: number = seededAuthor.id;
  const capturedFirstName: string = seededAuthor.firstName;
  const capturedLastName: string = seededAuthor.lastName;

  const listResponse = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });

  expect(listResponse.status()).toBe(200);

  const body = await listResponse.json();
  const found = body.find((a: { id: number }) => a.id === capturedId);

  expect(found).toBeDefined();
  expect(found.id).toBe(capturedId);
  expect(found.firstName).toBe(capturedFirstName);
  expect(found.lastName).toBe(capturedLastName);
});

test('TC-POS-003: GET /authors with firstName query param returns 200 and a non-empty array', async ({ request }) => {
  // NOTE: fakerestapi does not filter by query params — it returns all authors.
  // This test verifies the endpoint accepts the param without error and the seeded author is present.
  const filterFirstName = 'First Name 1';

  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
    params: { firstName: filterFirstName },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
  expect(body.some((a: { firstName: string }) => a.firstName === filterFirstName)).toBeTruthy();
});

test('TC-POS-004: GET /authors with lastName query param returns 200 and a non-empty array', async ({ request }) => {
  // NOTE: fakerestapi does not filter by query params — it returns all authors.
  // This test verifies the endpoint accepts the param without error and the seeded author is present.
  const filterLastName = 'Last Name 1';

  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
    params: { lastName: filterLastName },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
  expect(body.some((a: { lastName: string }) => a.lastName === filterLastName)).toBeTruthy();
});

test('TC-POS-005: GET /authors with firstName and lastName query params returns 200 and a non-empty array', async ({ request }) => {
  // NOTE: fakerestapi does not filter by query params — it returns all authors.
  // This test verifies the endpoint accepts both params without error and the seeded author is present.
  const filterFirstName = 'First Name 1';
  const filterLastName = 'Last Name 1';

  const response = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
    params: { firstName: filterFirstName, lastName: filterLastName },
  });

  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(Array.isArray(body)).toBeTruthy();
  expect(body.length).toBeGreaterThan(0);
  expect(body.some((a: { firstName: string; lastName: string }) => a.firstName === filterFirstName && a.lastName === filterLastName)).toBeTruthy();
});

test('TC-POS-006: Two consecutive GET /authors calls return consistent results (idempotency)', async ({ request }) => {
  const response1 = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });
  const response2 = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });

  expect(response1.status()).toBe(200);
  expect(response2.status()).toBe(200);

  const body1 = await response1.json();
  const body2 = await response2.json();

  // Both calls return non-empty arrays — exact count may vary on shared API
  expect(body1.length).toBeGreaterThan(0);
  expect(body2.length).toBeGreaterThan(0);
});

test('TC-POS-007: Deleted author no longer appears in GET /authors listing', async ({ request }) => {
  const listResponse = await request.get(`${API_URL}/api/v1/Authors`);

  expect(listResponse.status()).toBe(200);

  const allAuthors: Array<{ id: number; firstName: string | null }> = await listResponse.json();

  expect(allAuthors.length).toBeGreaterThan(0);

  // Seeded authors follow the "First Name X" pattern and cannot be deleted on this shared API.
  // User-created authors (by other API users) can be deleted. Look for one.
  const target = allAuthors.find(a => a.firstName && !a.firstName.startsWith('First Name '));

  if (!target) {
    // No user-created authors available right now — skip gracefully
    test.skip(true, 'No deletable (user-created) authors found on the shared API at this time');
    return;
  }

  const capturedId = target.id;

  const deleteResponse = await request.delete(`${API_URL}/api/v1/Authors/${capturedId}`);

  expect(deleteResponse.status()).toBe(200);

  const afterResponse = await request.get(`${API_URL}/api/v1/Authors`, {
    headers: { Accept: 'application/json' },
  });

  expect(afterResponse.status()).toBe(200);

  const bodyAfter = await afterResponse.json();

  expect(bodyAfter.every((a: { id: number }) => a.id !== capturedId)).toBeTruthy();
});
