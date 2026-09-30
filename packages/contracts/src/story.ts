import { z } from 'zod';
import { UserSummarySchema } from './user.js';

/**
 * "Câu chuyện" = bài đánh giá có nội dung của người dùng cho một địa điểm (BR-STORY-01).
 * Trang chủ hiện 6 bài mới nhất; trang /stories liệt kê tất cả, mới → cũ, phân trang theo số trang.
 */
export const StorySchema = z.object({
  id: z.string(),
  rating: z.number().int(),
  content: z.string(),
  helpfulCount: z.number().int(),
  createdAt: z.string(),
  author: UserSummarySchema,
  place: z.object({ id: z.string(), slug: z.string(), name: z.string(), coverUrl: z.string().nullable(), destinationName: z.string().nullable() }),
});
export type Story = z.infer<typeof StorySchema>;

export const STORIES_PAGE_SIZE = 9;
export const HOME_STORIES_LIMIT = 6;

export const StoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(24).default(STORIES_PAGE_SIZE),
  /** true = chỉ câu chuyện của những người tôi theo dõi (cần đăng nhập). */
  following: z.enum(['true', 'false']).transform((v) => v === 'true').optional(),
  /** Câu chuyện của một người (trang hồ sơ). */
  author: z.string().optional(),
});
export type StoryQuery = z.infer<typeof StoryQuerySchema>;

/** Kết quả phân trang theo số trang (khác cursor): dùng cho danh sách có nút trang 1, 2, 3… */
export type PagedResult<T> = { items: T[]; page: number; pageSize: number; total: number; totalPages: number };
