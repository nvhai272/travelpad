import { createApiClient } from '@travelpad/api-client';

let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => {
  accessToken = t;
};

/** Client dùng trong trình duyệt: gửi cookie refresh (credentials) + Bearer token trong memory. */
export const browserApi = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/v1',
  credentials: 'include',
  getAccessToken: () => accessToken,
});
