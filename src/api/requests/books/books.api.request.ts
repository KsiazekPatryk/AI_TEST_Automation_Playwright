import { APIResponse } from '@playwright/test';
import { APIRequest } from '@api/requests/api.request';
import { API_ENDPOINTS } from '@api/consts/api.endpoints.const';
import { BookPayload } from '@api/models/book.model';

export class BooksAPIRequest {
  constructor(private readonly api: APIRequest) {}

  async createBook(payload: BookPayload): Promise<APIResponse> {
    return this.api.post(API_ENDPOINTS.books.base, payload);
  }

  async getBookById(id: number): Promise<APIResponse> {
    return this.api.get(API_ENDPOINTS.books.byId(id));
  }

  async updateBook(id: number, payload: BookPayload): Promise<APIResponse> {
    return this.api.put(API_ENDPOINTS.books.byId(id), payload);
  }

  async deleteBook(id: number): Promise<APIResponse> {
    return this.api.delete(API_ENDPOINTS.books.byId(id));
  }
}
