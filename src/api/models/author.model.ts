export interface CreateAuthorPayload {
  readonly firstName: string;
  readonly lastName: string;
}

export interface AuthorResponse {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  [key: string]: unknown;
}
