import { test, expect } from '@fixtures/test.fixture';
import { z } from 'zod';
import { HTTP_200_OK } from '@api/consts/http.status.codes.const';
import { AuthorResponse } from '@api/models/author.model';
import { parseResponse } from '@utils/parse.response.utils';

const AuthorSchema = z.object({
  id: z.number().int(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
});

const AuthorArraySchema = z.array(AuthorSchema);

test.describe('GET /authors schema', { tag: ['@api', '@authors', '@schema', '@smoke'] }, () => {
  test('should return 200 with Content-Type application/json', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.getAll();

    expect(response.status()).toBe(HTTP_200_OK);

    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');

    const body = await parseResponse<AuthorResponse[]>(response);
    expect(body).not.toBeNull();
  });

  test('should return a JSON array as response body', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.getAll();

    expect(response.status()).toBe(HTTP_200_OK);

    const body = await parseResponse<AuthorResponse[]>(response);

    expect(Array.isArray(body)).toBeTruthy();
    expect(body).not.toBeNull();
    expect(typeof body).not.toBe('string');
    expect(body).not.toMatchObject(expect.objectContaining({ id: expect.anything() }));
  });

  test('should contain only documented fields in each author object', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.getAll();

    expect(response.status()).toBe(HTTP_200_OK);

    const body = await parseResponse<AuthorResponse[]>(response);

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    const allowedKeys = new Set(['id', 'firstName', 'lastName']);

    for (const author of body) {
      const extraKeys = Object.keys(author as Record<string, unknown>).filter(k => !allowedKeys.has(k));
      expect(extraKeys, `Unexpected fields found: ${extraKeys.join(', ')}`).toHaveLength(0);
    }
  });

  test('should have an integer id field in every author object', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.getAll();

    expect(response.status()).toBe(HTTP_200_OK);

    const body = await parseResponse<AuthorResponse[]>(response);

    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);

    for (const author of body) {
      if (author.id !== undefined) {
        expect(Number.isInteger(author.id), `id should be integer, got: ${typeof author.id} (${author.id})`).toBeTruthy();
      }
    }
  });

  test('should have firstName as string or null in every author object', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.getAll();

    expect(response.status()).toBe(HTTP_200_OK);

    const body = await parseResponse<AuthorResponse[]>(response);

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

  test('should have lastName as string or null in every author object', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.getAll();

    expect(response.status()).toBe(HTTP_200_OK);

    const body = await parseResponse<AuthorResponse[]>(response);

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

  test('should return schema-valid array when firstName query param is provided', async ({ authorsApiRequest }) => {
    const response = await authorsApiRequest.getAll({ firstName: 'Jane' });

    expect(response.status()).toBe(HTTP_200_OK);

    const body = await parseResponse<AuthorResponse[]>(response);

    expect(Array.isArray(body)).toBeTruthy();

    const result = AuthorArraySchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBeTruthy();
  });

  test('should pass full Zod schema validation for GET /authors response', async ({ authorsApiRequest }) => {
    // fakerestapi does NOT support query filtering — it returns all authors regardless of params.
    // This test validates the full Zod schema on an unfiltered response.
    const response = await authorsApiRequest.getAll();

    expect(response.status()).toBe(HTTP_200_OK);

    const body = await parseResponse<AuthorResponse[]>(response);

    expect(Array.isArray(body)).toBeTruthy();

    const result = AuthorArraySchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBeTruthy();
  });
});
