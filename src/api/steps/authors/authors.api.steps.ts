import { expect } from '@playwright/test';
import { AuthorsAPIRequest } from '@api/requests/authors/authors.api.request';
import { AuthorResponse, CreateAuthorPayload } from '@api/models/author.model';
import { parseResponse } from '@utils/parse.response.utils';
import { QueryParams } from '@api/requests/api.request';
import { HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT } from '@api/consts/http.status.codes.const';
import { AuthorArraySchema } from '@api/schemas/author.schema';

export class AuthorsAPISteps {
  constructor(private readonly authorsRequest: AuthorsAPIRequest) {}

  async getAll(params?: QueryParams): Promise<AuthorResponse[]> {
    const response = await this.authorsRequest.getAll(params);
    expect(response.status()).toBe(HTTP_200_OK);
    expect(response.headers()['content-type']).toContain('application/json');
    const body = await parseResponse<AuthorResponse[]>(response);
    const result = AuthorArraySchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error?.issues)).toBe(true);
    return body;
  }

  async create(payload: CreateAuthorPayload): Promise<AuthorResponse> {
    const response = await this.authorsRequest.create(payload);
    expect(response.status()).toBe(HTTP_201_CREATED);
    return parseResponse<AuthorResponse>(response);
  }

  async delete(id: number): Promise<void> {
    const response = await this.authorsRequest.delete(id);
    expect(response.status()).toBe(HTTP_204_NO_CONTENT);
  }
}
