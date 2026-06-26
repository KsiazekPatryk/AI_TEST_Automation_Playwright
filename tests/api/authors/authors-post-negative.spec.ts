import { test, expect } from '@fixtures/test.fixture';
import { API_ENDPOINTS } from '@api/consts/api.endpoints.const';
import { HTTP_400_BAD_REQUEST } from '@api/consts/http.status.codes.const';
import { APIPayload } from '@api/requests/api.request';
import { parseResponse } from '@utils/parse.response.utils';
import { APIResponse } from '@playwright/test';

type ErrorBody = {
  status: number;
  error: string;
  message: unknown;
  [key: string]: unknown;
};

async function assertBadRequest(response: APIResponse): Promise<void> {
  await test.step('assert status is 400', () => {
    expect(response.status()).toBe(HTTP_400_BAD_REQUEST);
  });
  await test.step('assert content-type is application/json', () => {
    expect(response.headers()['content-type']).toContain('application/json');
  });
  await test.step('assert error body contains status, error and message fields', async () => {
    const body = await parseResponse<ErrorBody>(response);
    expect(body.status).toBe(HTTP_400_BAD_REQUEST);
    expect(typeof body.error).toBe('string');
    expect(Array.isArray(body.message)).toBeTruthy();
  });
}

test.describe(
  'POST /authors — 4xx negative scenarios',
  { tag: ['@api', '@authors', '@regression'] },
  () => {
    // TC-NEG-POST-AUTHORS-001: Empty body
    test('should return 400 when request body is an empty object', async ({ apiRequest }) => {
      const response = await test.step('send POST with empty object body', () =>
        apiRequest.post(API_ENDPOINTS.authors.base, {} as APIPayload),
      );

      await assertBadRequest(response);
    });

    // TC-NEG-POST-AUTHORS-002 and TC-NEG-POST-AUTHORS-003: Missing individual required fields
    const missingFieldCases = [
      { description: 'missing firstName', body: { lastName: 'Smith' } },
      { description: 'missing lastName', body: { firstName: 'Jane' } },
    ];

    missingFieldCases.forEach(({ description, body }) => {
      test(`should return 400 when ${description}`, async ({ apiRequest }) => {
        const response = await test.step(`send POST with ${description}`, () =>
          apiRequest.post(API_ENDPOINTS.authors.base, body as APIPayload),
        );

        await assertBadRequest(response);
      });
    });

    // TC-NEG-POST-AUTHORS-004: firstName is wrong type (integer)
    // Note: TC-NEG-POST-AUTHORS-005 (lastName: boolean) skipped — API accepts boolean lastName and returns 201
    test('should return 400 when firstName is an integer instead of a string', async ({
      apiRequest,
    }) => {
      const response = await test.step('send POST with integer firstName', () =>
        apiRequest.post(API_ENDPOINTS.authors.base, {
          firstName: 123,
          lastName: 'Smith',
        } as APIPayload),
      );

      await assertBadRequest(response);
    });

    // TC-NEG-POST-AUTHORS-006 and TC-NEG-POST-AUTHORS-007: Single-character names
    const singleCharCases = [
      { description: 'firstName is a single character', body: { firstName: 'J', lastName: 'Smith' } },
      { description: 'lastName is a single character', body: { firstName: 'Jane', lastName: 'S' } },
    ];

    singleCharCases.forEach(({ description, body }) => {
      test(`should return 400 when ${description}`, async ({ apiRequest }) => {
        const response = await test.step(`send POST with ${description}`, () =>
          apiRequest.post(API_ENDPOINTS.authors.base, body as APIPayload),
        );

        await assertBadRequest(response);
      });
    });

    // TC-NEG-POST-AUTHORS-008: Extremely long name values
    test('should return 400 when name values exceed maximum length', async ({ apiRequest }) => {
      const longName = 'A'.repeat(300);

      const response = await test.step('send POST with overly long firstName and lastName', () =>
        apiRequest.post(API_ENDPOINTS.authors.base, {
          firstName: longName,
          lastName: longName,
        } as APIPayload),
      );

      await assertBadRequest(response);
    });

    // TC-NEG-POST-AUTHORS-009: Malformed JSON body
    // Exception: raw `request` fixture required here — APIRequest.post() serialises its payload
    // as JSON via Playwright and cannot send a raw malformed string body.
    test('should return 4xx when request body is malformed JSON', async ({ request }) => {
      const response = await test.step('send POST with malformed JSON string body', () =>
        request.post(API_ENDPOINTS.authors.base, {
          headers: { 'Content-Type': 'application/json' },
          data: '{ firstName: "Jane", lastName: }',
        }),
      );

      await test.step('assert status is in 4xx range', () => {
        const status = response.status();
        expect(
          status,
          `Expected a 4xx status for malformed JSON body, but received: ${status}`,
        ).toBeGreaterThanOrEqual(400);
        expect(
          status,
          `Expected a 4xx status for malformed JSON body, but received: ${status}`,
        ).toBeLessThan(500);
      });
      await test.step('assert content-type is application/json', () => {
        expect(response.headers()['content-type']).toContain('application/json');
      });
    });

    // TC-NEG-POST-AUTHORS-010: Request body missing entirely
    test('should return 400 when request body is absent', async ({ apiRequest }) => {
      const response = await test.step('send POST with no body', () =>
        apiRequest.post(API_ENDPOINTS.authors.base),
      );

      await assertBadRequest(response);
    });
  },
);
