import fs from 'node:fs/promises';
import path from 'node:path';
import { test, expect } from '@fixtures/test.fixture';
import { HTTP_400_BAD_REQUEST } from '@api/consts/http.status.codes.const';
import { parseResponse } from '@utils/parse.response.utils';
import { z } from 'zod';

const DeleteErrorSchema = z.object({
  status: z.number().int(),
  error: z.string(),
  message: z.union([z.string(), z.array(z.string())]),
}).passthrough();

type DeleteErrorBody = z.infer<typeof DeleteErrorSchema>;

type OpenApiDocument = {
  paths?: Record<string, Record<string, unknown>>;
};

const invalidPathIds = [
  {
    description: 'non-integer id path value',
    id: 'abc',
    testCaseId: 'TC-NEG-BOOKS-ID-DELETE-001',
  },
  {
    description: 'decimal id path value',
    id: '1.5',
    testCaseId: 'TC-NEG-BOOKS-ID-DELETE-002',
  },
];

test.describe('DELETE /books/{id} 4xx negative contract coverage', { tag: ['@api', '@books', '@regression'] }, () => {
  invalidPathIds.forEach(({ description, id, testCaseId }) => {
    test(`should return 400 for ${description} [${testCaseId}]`, async ({
      booksApiRequest,
    }) => {
      const numericId = Number(id);

      expect(Number.isInteger(numericId)).toBe(false);

      const response = await booksApiRequest.deleteBook(id);

      expect(response.status()).toBe(HTTP_400_BAD_REQUEST);
      expect(response.headers()['content-type']).toContain('application/json');

      const body = await parseResponse<DeleteErrorBody>(response);
      const result = DeleteErrorSchema.safeParse(body);
      expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
      expect(body.status).toBe(HTTP_400_BAD_REQUEST);
      expect(JSON.stringify(body)).not.toMatch(/stack|exception|trace|password|token|secret/i);
    });
  });

  test('should document missing path id as outside the OpenAPI DELETE contract [TC-NEG-BOOKS-ID-DELETE-003]', async () => {
    const openApiSpecPath = process.env.OPENAPI_SPEC ?? 'docs/openapi/bookstoreapi.openapi.json';
    const rawOpenApi = await fs.readFile(path.resolve(process.cwd(), openApiSpecPath), 'utf-8');
    const openApi = JSON.parse(rawOpenApi) as OpenApiDocument;

    expect(openApi.paths?.['/books/{id}']?.delete).toBeDefined();
    expect(openApi.paths?.['/books']?.delete).toBeUndefined();
  });
});