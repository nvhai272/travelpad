import { z } from 'zod';
import { UserSummarySchema } from './user.js';
import { PlaceSummarySchema } from './place.js';
import { CursorQuerySchema } from './common.js';

export const PostSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  coverUrl: z.string().nullable(),
  author: UserSummarySchema,
  place: PlaceSummarySchema.pick({ id: true, slug: true, name: true, province: true }).nullable(),
  likeCount: z.number().int(),
  commentCount: z.number().int(),
  viewer: z.object({ liked: z.boolean(), saved: z.boolean() }),
  publishedAt: z.string(),
});
export type PostSummary = z.infer<typeof PostSummarySchema>;

export const PostDetailSchema = PostSummarySchema.extend({
  /** Nội dung dạng Markdown (đã sanitize khi render). */
  content: z.string(),
  gallery: z.array(z.string()),
  tags: z.array(z.string()),
});
export type PostDetail = z.infer<typeof PostDetailSchema>;

export const CreatePostSchema = z.object({
  title: z.string().min(5).max(150),
  content: z.string().min(20),
  placeId: z.string().optional(),
  journeyId: z.string().optional(),
  mediaIds: z.array(z.string()).max(20).default([]),
  tags: z.array(z.string().max(30)).max(10).default([]),
  status: z.enum(['draft', 'published']).default('published'),
});
export type CreatePostInput = z.infer<typeof CreatePostSchema>;

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: UserSummarySchema,
  parentId: z.string().nullable(),
  createdAt: z.string(),
});
export type Comment = z.infer<typeof CommentSchema>;

export const CreateCommentSchema = z.object({
  content: z.string().min(1).max(1000),
  parentId: z.string().optional(),
});
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

/** Tìm bài viết (ô tìm kiếm trang chủ – BR-SRCH-01): khớp tiêu đề/nội dung, không phân biệt hoa thường. */
export const PostQuerySchema = CursorQuerySchema.extend({ q: z.string().trim().max(100).optional() });
export type PostQuery = z.infer<typeof PostQuerySchema>;
