import { expect } from '@playwright/test';
import { BooksAPIRequest } from '@api/requests/books/books.api.request';
import { BookPayload, BookResponse } from '@api/models/book.model';
import { parseResponse } from '@utils/parse.response.utils';
import { HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT } from '@api/consts/http.status.codes.const';
import { BookSchema } from '@api/schemas/book.schema';

export class BooksAPISteps {
  constructor(private readonly booksRequest: BooksAPIRequest) {}

  async createBook(payload: BookPayload): Promise<BookResponse> {
    const response = await this.booksRequest.createBook(payload);
    expect(response.status()).toBe(HTTP_201_CREATED);
    expect(response.headers()['content-type']).toContain('application/json');
    const body = await parseResponse<BookResponse>(response);
    const result = BookSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
    expect(body).toHaveProperty('id');
    return body;
  }

  async updateBook(id: number, payload: BookPayload): Promise<BookResponse> {
    const response = await this.booksRequest.updateBook(id, payload);
    expect(response.status()).toBe(HTTP_200_OK);
    expect(response.headers()['content-type']).toContain('application/json');
    const body = await parseResponse<BookResponse>(response);
    const result = BookSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
    expect(body.id).toBe(id);
    return body;
  }

  async getBookById(id: number): Promise<BookResponse> {
    const response = await this.booksRequest.getBookById(id);
    expect(response.status()).toBe(HTTP_200_OK);
    expect(response.headers()['content-type']).toContain('application/json');
    const body = await parseResponse<BookResponse>(response);
    const result = BookSchema.safeParse(body);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.issues)).toBe(true);
    return body;
  }

  async deleteBook(id: number): Promise<void> {
    const response = await this.booksRequest.deleteBook(id);
    expect(response.status()).toBe(HTTP_204_NO_CONTENT);
  }
}
