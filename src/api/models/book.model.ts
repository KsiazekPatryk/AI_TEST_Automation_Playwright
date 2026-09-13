export interface BookPayload {
  readonly title?: string;
  readonly authors: number[];
  readonly year: number;
  readonly price: number;
  readonly available: number;
  [key: string]: unknown;
}

export interface BookAuthor {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  [key: string]: unknown;
}

export interface BookResponse {
  readonly id: number;
  readonly title: string;
  readonly year: number;
  readonly price: number;
  readonly coverId: number | null;
  readonly available: number;
  readonly authors: BookAuthor[];
  [key: string]: unknown;
}

export interface RestBookAuthorResponse {
  readonly firstName?: string;
  readonly lastName?: string;
  [key: string]: unknown;
}

export interface RestBookResponse {
  readonly id?: number;
  readonly title?: string;
  readonly year?: number;
  readonly price?: number;
  readonly coverUrl?: string | null;
  readonly available?: number;
  readonly authors?: RestBookAuthorResponse[];
  [key: string]: unknown;
}
