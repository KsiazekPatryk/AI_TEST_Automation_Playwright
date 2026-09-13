import { APIResponse } from '@playwright/test';
import { APIPayload, APIRequest, QueryParams } from '@api/requests/api.request';
import { API_ENDPOINTS } from '@api/consts/api.endpoints.const';
import { CreateAuthorPayload, PatchAuthorPayload, UpdateAuthorPayload } from '@api/models/author.model';

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

  async update(id: number, payload: UpdateAuthorPayload): Promise<APIResponse> {
    return this.api.put(API_ENDPOINTS.authors.byId(id), payload);
  }

  async patch(id: number | string, payload?: PatchAuthorPayload | APIPayload): Promise<APIResponse> {
    return this.api.patch(API_ENDPOINTS.authors.byId(id), payload, { 'Content-Type': 'application/json' });
  }

  async delete(id: number | string): Promise<APIResponse> {
    return this.api.delete(API_ENDPOINTS.authors.byId(id));
  }
}
