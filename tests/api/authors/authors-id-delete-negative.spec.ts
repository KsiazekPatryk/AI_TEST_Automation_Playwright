import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@fixtures/test.fixture';
import { HTTP_400_BAD_REQUEST, HTTP_204_NO_CONTENT } from '@api/consts/http.status.codes.const';
import { parseResponse } from '@utils/parse.response.utils';
import { z } from 'zod';

const MIN_INT64 = -9223372036854775808n;
const MAX_INT64 = 9223372036854775807n;

function isInt64String(value: string): boolean {
  if (!/^-?\d+$/.test(value)) {
    return false;
  }

  const parsed = BigInt(value);

  return parsed >= MIN_INT64 && parsed <= MAX_INT64;
}

const OpenApiPathParamSchema = z.union([
  z.number().int().refine((value) => BigInt(value) >= MIN_INT64 && BigInt(value) <= MAX_INT64),
  z.string().refine(isInt64String),
]);

type ErrorBody = {
  status: number;
  error: string;
  message: unknown;
};

const ErrorBodySchema = z.object({
  status: z.number().int(),
  error: z.string(),
  message: z.union([z.string(), z.array(z.string())]),
});

type OpenApiOperation = {
  responses?: Record<string, unknown>;
};

type OpenApiPathItem = {
  get?: OpenApiOperation;
  post?: OpenApiOperation;
  put?: OpenApiOperation;
  delete?: OpenApiOperation;
  patch?: OpenApiOperation;
};

type OpenApiDocument = {
  paths: Record<string, OpenApiPathItem>;
};

const invalidAuthorIds = [
  { description: 'non-integer id', id: 'abc' },
  { description: 'decimal id', id: '1.5' },
];

test.describe('DELETE /authors/{id} 4xx', { tag: ['@api', '@authors', '@regression'] }, () => {
  invalidAuthorIds.forEach(({ description, id }) => {
    test(`should return 400 for ${description}`, async ({ authorsApiRequest }) => {
      const invalidId = id;
      const pathParamResult = OpenApiPathParamSchema.safeParse(invalidId);

      expect(pathParamResult.success).toBe(false);

      const response = await authorsApiRequest.delete(invalidId);

      expect(response.status()).toBe(HTTP_400_BAD_REQUEST);
      expect(response.headers()['content-type']).toContain('application/json');

      const body = await parseResponse<ErrorBody>(response);
      const result = ErrorBodySchema.safeParse(body);
      expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
      expect(body.status).toBe(HTTP_400_BAD_REQUEST);
      expect(JSON.stringify(body).toLowerCase()).not.toContain('stack');
      expect(JSON.stringify(body).toLowerCase()).not.toContain('token');
      expect(JSON.stringify(body).toLowerCase()).not.toContain('password');
    });
  });

  test('should return 204 for non-existing numeric id', async ({ authorsApiRequest }) => {
    const nonExistingAuthorId = 999999999;
    const pathParamResult = OpenApiPathParamSchema.safeParse(nonExistingAuthorId);

    expect(pathParamResult.success).toBe(true);

    const response = await authorsApiRequest.delete(nonExistingAuthorId);

    expect(response.status()).toBe(HTTP_204_NO_CONTENT);
    expect(response.headers()['content-type']).toBeUndefined();
    expect(await response.text()).toBe('');
  });

  test('should document that DELETE /authors without an id is not an OpenAPI operation', () => {
    const openApiSpecPath = process.env.OPENAPI_SPEC ?? 'docs/openapi/bookstoreapi.openapi.json';
    const openApi = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), openApiSpecPath), 'utf-8')) as OpenApiDocument;

    expect(openApi.paths['/authors/{id}']?.delete).toBeDefined();
    expect(openApi.paths['/authors']?.delete).toBeUndefined();
  });
});