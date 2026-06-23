import { APIResponse } from '@playwright/test';
import { APIRequest, QueryParams } from '@api/requests/api.request';
import { API_ENDPOINTS } from '@api/consts/api.endpoints.const';
import { CreateAuthorPayload } from '@api/models/author.model';

export class AuthorsAPIRequest {
  constructor(private readonly api: APIRequest) {}

  async getAll(params?: QueryParams): Promise<APIResponse> {
    return this.api.get(API_ENDPOINTS.authors.base, params, { Accept: 'application/json' });
  }

  async getById(id: number): Promise<APIResponse> {
    return this.api.get(API_ENDPOINTS.authors.byId(id));
  }

  async create(payload: CreateAuthorPayload): Promise<APIResponse> {
    return this.api.post(API_ENDPOINTS.authors.base, payload);
  }

  async delete(id: number): Promise<APIResponse> {
    return this.api.delete(API_ENDPOINTS.authors.byId(id));
  }
}
