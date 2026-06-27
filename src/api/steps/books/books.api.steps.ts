import { expect } from '@playwright/test';
import { BooksAPIRequest } from '@api/requests/books/books.api.request';
import { BookPayload, BookResponse } from '@api/models/book.model';
import { parseResponse } from '@utils/parse.response.utils';
import { HTTP_200_OK, HTTP_201_CREATED, HTTP_204_NO_CONTENT } from '@api/consts/http.status.codes.const';

export class BooksAPISteps {
  constructor(private readonly booksRequest: BooksAPIRequest) {}

  async createBook(payload: BookPayload): Promise<BookResponse> {
    const response = await this.booksRequest.createBook(payload);
    expect(response.status()).toBe(HTTP_201_CREATED);
    const body = await parseResponse<BookResponse>(response);
    expect(body).toHaveProperty('id');
    return body;
  }

  async getBookById(id: number): Promise<BookResponse> {
    const response = await this.booksRequest.getBookById(id);
    expect(response.status()).toBe(HTTP_200_OK);
    return parseResponse<BookResponse>(response);
  }

  async deleteBook(id: number): Promise<void> {
    const response = await this.booksRequest.deleteBook(id);
    expect(response.status()).toBe(HTTP_204_NO_CONTENT);
  }
}
