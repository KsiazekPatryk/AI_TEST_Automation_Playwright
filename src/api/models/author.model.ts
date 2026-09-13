export interface CreateAuthorPayload {
  readonly firstName: string;
  readonly lastName: string;
  readonly [key: string]: unknown;
}

export interface UpdateAuthorPayload {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly [key: string]: unknown;
}

export interface PatchAuthorPayload {
  readonly [key: string]: Record<string, unknown>;
}

export interface AuthorResponse {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly [key: string]: unknown;
}
