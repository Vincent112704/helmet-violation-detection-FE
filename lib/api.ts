import { createCombinedPayloadStream } from 'next/dist/server/app-render/instant-validation/instant-validation';
import { type Methods } from '../schema/enums'


/**
 * TODO:
 * Write a function that will be used by all services to make API calls to the backend. 
 * This function should handle errors and return the response data.
 */
interface ApiError {
  status: number;
  statusText: string;
  body: unknown;
}

type BodyInput =
  | Record<string, unknown>  // plain object -> JSON
  | FormData
  | Blob
  | ArrayBuffer
  | URLSearchParams
  | string
  | undefined;

export class FetchApiError extends Error {
  constructor(public info: ApiError) {
    super(`API error ${info.status}: ${info.statusText}`);
    this.name = "FetchApiError";
  }
}


function serializeBody(body: BodyInput): {
  payload: BodyInit | undefined;
  contentType?: string;
} {
  if (body === undefined) return { payload: undefined };

  // Let these pass through untouched — they know how to encode themselves,
  // and for FormData specifically, we must NOT set Content-Type ourselves.
  if (
    body instanceof FormData ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    body instanceof URLSearchParams ||
    typeof body === "string"
  ) {
    return { payload: body };
  }

  // Fallback: treat as JSON-serializable object
  return {
    payload: JSON.stringify(body),
    contentType: "application/json",
  };
}



export async function fetchApi<TResponse = unknown>(
  url: string,
  method: Methods = "GET",
  body?: BodyInput,
  headers?: Record<string, string>
): Promise<TResponse> {
  const { payload, contentType } = serializeBody(body);

  const response = await fetch(url, {
    method,
    headers: {
      ...(contentType ? { "Content-Type": contentType } : {}),
      ...headers, // caller-supplied headers can still override
    },
    body: payload,
  });

  if (!response.ok) {
    let errorBody: unknown = null;
    try {
      errorBody = await response.json();
    } catch {
      // not JSON, ignore
    }
    throw new FetchApiError({
      status: response.status,
      statusText: response.statusText,
      body: errorBody,
    });
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return response.json() as Promise<TResponse>;
}