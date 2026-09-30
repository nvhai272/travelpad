import { z } from 'zod';
import { PlaceSummarySchema } from './place.js';
import { UserSummarySchema } from './user.js';
import { ProviderGroupSchema, ProviderSummarySchema } from './provider.js';

/**
 * Mọi bảng xếp hạng tính trên TOÀN BỘ thời gian (không cửa sổ ngày) – chốt 26/09/2026.
 * Xem docs/business-rules.md §7.
 */
export const RankingQuerySchema = z.object({ limit: z.coerce.number().int().min(1).max(20).default(5) });
export type RankingQuery = z.infer<typeof RankingQuerySchema>;

/** BR-RANK-01: địa điểm xếp theo TỔNG SỐ NGƯỜI VOTE sao, hoà thì sao trung bình cao hơn. */
export const PlaceRankingItemSchema = z.object({
  rank: z.number().int(),
  place: PlaceSummarySchema,
  destinationName: z.string().nullable(),
  votes: z.number().int(),
});
export type PlaceRankingItem = z.infer<typeof PlaceRankingItemSchema>;

/**
 * BR-RANK-03: top người đóng góp, 2 loại:
 * - `likes`   – tổng lượt tim trên các bài chia sẻ (không tính tự thả tim)
 * - `helpful` – tổng lượt "Hữu ích" trên các đánh giá (không tự vote được)
 */
export const CreatorRankingBySchema = z.enum(['likes', 'helpful']);
export type CreatorRankingBy = z.infer<typeof CreatorRankingBySchema>;

export const CreatorRankingQuerySchema = RankingQuerySchema.extend({ by: CreatorRankingBySchema.default('likes') });
export type CreatorRankingQuery = z.infer<typeof CreatorRankingQuerySchema>;

export const CreatorRankingItemSchema = z.object({
  rank: z.number().int(),
  user: UserSummarySchema,
  /** Tổng tim hoặc tổng "Hữu ích" */
  total: z.number().int(),
  /** Số bài chia sẻ hoặc số đánh giá có nhận xét */
  contributions: z.number().int(),
  /** Bài/đánh giá được yêu thích (hữu ích) nhất của người này */
  top: z.object({ title: z.string(), href: z.string(), count: z.number().int() }).nullable(),
});
export type CreatorRankingItem = z.infer<typeof CreatorRankingItemSchema>;

export type Ranking<T> = { items: T[] };

/** BR-RANK-09: dịch vụ du lịch uy tín – nhà cung cấp xếp theo tổng số người vote sao (≥ 3), hoà thì sao TB. */
export const ProviderRankingItemSchema = z.object({
  rank: z.number().int(),
  provider: ProviderSummarySchema,
  votes: z.number().int(),
});
export type ProviderRankingItem = z.infer<typeof ProviderRankingItemSchema>;

/** BXH dịch vụ theo từng nhóm (lưu trú, ăn uống, di chuyển, hướng dẫn viên/tour); bỏ trống = tất cả. */
export const ProviderRankingQuerySchema = RankingQuerySchema.extend({ group: ProviderGroupSchema.optional() });
export type ProviderRankingQuery = z.infer<typeof ProviderRankingQuerySchema>;
