import { APIResponse } from '@playwright/test';

export async function parseResponse<T>(response: APIResponse): Promise<T> {
  return (await response.json()) as T;
}
