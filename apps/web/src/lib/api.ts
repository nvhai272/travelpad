import { createApiClient } from '@travelpad/api-client';

/**
 * Client cho Server Components: cache ISR 60s → trang công khai (địa điểm, bài viết) tốt cho SEO.
 * Dữ liệu theo người dùng (like, saved) được hydrate phía client bằng TanStack Query.
 */
export const serverApi = createApiClient({
  baseUrl: process.env.API_INTERNAL_URL ?? 'http://localhost:4000/v1',
  next: { revalidate: 60 },
});

/** Gọi API nhưng không làm sập trang khi backend chưa chạy (dev) – trả về fallback. */
export async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}
