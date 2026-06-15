import { APIRequestContext, APIResponse } from '@playwright/test';

export type APIPayload = Record<string, unknown> | unknown[];
export type RequestHeaders = Record<string, string>;
export type QueryParams = Record<string, string | number | boolean>;

export class APIRequest {
  constructor(private readonly api: APIRequestContext) {}

  async get(endpoint: string, params?: QueryParams, headers: RequestHeaders = {}): Promise<APIResponse> {
    return this.api.get(endpoint, {
      params,
      headers,
    });
  }

  async post(endpoint: string, payload?: APIPayload, headers: RequestHeaders = {}): Promise<APIResponse> {
    return this.api.post(endpoint, {
      data: payload,
      headers,
    });
  }

  async put(endpoint: string, payload?: APIPayload, headers: RequestHeaders = {}): Promise<APIResponse> {
    return this.api.put(endpoint, {
      data: payload,
      headers,
    });
  }

  async patch(endpoint: string, payload?: APIPayload | FormData, headers: RequestHeaders = {}): Promise<APIResponse> {
    const isFormData = payload instanceof FormData;

    return this.api.patch(endpoint, {
      ...(isFormData ? { multipart: payload } : { data: payload }),
      headers,
    });
  }

  async delete(endpoint: string, headers: RequestHeaders = {}): Promise<APIResponse> {
    return this.api.delete(endpoint, {
      headers,
    });
  }

  async head(endpoint: string, headers: RequestHeaders = {}): Promise<APIResponse> {
    return this.api.head(endpoint, {
      headers,
    });
  }

  async options(endpoint: string, headers: RequestHeaders = {}): Promise<APIResponse> {
    return this.api.fetch(endpoint, {
      method: 'OPTIONS',
      headers,
    });
  }
}
