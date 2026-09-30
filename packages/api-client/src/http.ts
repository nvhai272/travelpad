import type { ApiError } from '@travelpad/contracts';

export class ApiClientError extends Error {
  constructor(public readonly error: ApiError) {
    super(error.message);
  }
}

export interface ApiClientOptions {
  baseUrl: string;
  /** Web: đọc từ memory; mobile: đọc từ SecureStore. */
  getAccessToken?: () => string | null | Promise<string | null>;
  /** 'include' cho web để gửi cookie refresh token. */
  credentials?: RequestCredentials;
  fetch?: typeof fetch;
  /** Tuỳ chọn cache của Next.js (revalidate, tags) khi gọi từ Server Components. */
  next?: { revalidate?: number | false; tags?: string[] };
}

type Query = Record<string, string | number | boolean | readonly (string | number)[] | undefined>;

/** Tạo hàm `request` có kiểu – mọi resource dùng chung (token, credentials, cache Next). */
export function createRequest(opts: ApiClientOptions) {
  const doFetch = opts.fetch ?? fetch;

  async function request<T>(method: string, path: string, body?: unknown, query?: Query): Promise<T> {
    // baseUrl tương đối ('/v1' khi web proxy API qua cùng domain – docs/deploy.md) → ghép với origin của trang.
    const origin = typeof location === 'undefined' ? undefined : location.origin;
    const url = new URL(opts.baseUrl.replace(/\/$/, '') + path, origin);
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v === undefined || (Array.isArray(v) && v.length === 0)) continue;
      url.searchParams.set(k, Array.isArray(v) ? v.join(',') : String(v)); // mảng → "a,b" (khớp csv() trong contracts)
    }

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    const token = await opts.getAccessToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await doFetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: opts.credentials,
      ...(opts.next ? { next: opts.next } : {}),
    } as RequestInit);

    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as ApiError | null;
      throw new ApiClientError(err ?? { statusCode: res.status, code: 'UNKNOWN', message: res.statusText });
    }
    return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
  }

  return request;
}

export type Request = ReturnType<typeof createRequest>;
