import { APIResponse } from '@playwright/test';
import { APIPayload, APIRequest, QueryParams, RequestHeaders } from '@api/requests/api.request';
import { API_ENDPOINTS } from '@api/consts/api.endpoints.const';
import { BookPayload, PatchBookPayload } from '@api/models/book.model';

export class BooksAPIRequest {
  constructor(private readonly api: APIRequest) {}

  async createBook(payload: BookPayload | APIPayload, headers: RequestHeaders = {}): Promise<APIResponse> {
    return this.api.post(API_ENDPOINTS.books.base, payload, headers);
  }

  async getBooks(params?: QueryParams, headers: RequestHeaders = {}): Promise<APIResponse> {
    return this.api.get(API_ENDPOINTS.books.base, params, headers);
  }

  async getBookById(id: number | string): Promise<APIResponse> {
    return this.api.get(API_ENDPOINTS.books.byId(id));
  }

  async updateBook(id: number, payload: BookPayload): Promise<APIResponse> {
    return this.api.put(API_ENDPOINTS.books.byId(id), payload);
  }

  async patchBook(id: number | string, payload?: PatchBookPayload | APIPayload): Promise<APIResponse> {
    return this.api.patch(API_ENDPOINTS.books.byId(id), payload, { 'Content-Type': 'application/json', Accept: '*/*' });
  }

  async deleteBook(id: number | string, headers: RequestHeaders = {}): Promise<APIResponse> {
    return this.api.delete(API_ENDPOINTS.books.byId(id), headers);
  }
}
