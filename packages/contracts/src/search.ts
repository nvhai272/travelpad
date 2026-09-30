import { z } from 'zod';
import { PlaceCategorySchema } from './place.js';

/** Gợi ý khi gõ (autocomplete): địa điểm, tỉnh/vùng, hoạt động. */
export const SuggestionSchema = z.object({
  type: z.enum(['place', 'province', 'activity']),
  id: z.string(),
  label: z.string(),
  sublabel: z.string().nullable(),
  slug: z.string().nullable(),
  category: PlaceCategorySchema.nullable(),
  rating: z.number().nullable(),
  /** Vị trí [start, end) cần highlight trong label. */
  highlight: z.array(z.tuple([z.number(), z.number()])),
});
export type Suggestion = z.infer<typeof SuggestionSchema>;

export const SuggestQuerySchema = z.object({ q: z.string().min(1).max(100), limit: z.coerce.number().int().max(10).default(8) });
export type SuggestQuery = z.infer<typeof SuggestQuerySchema>;

export const TrendingSchema = z.object({ keyword: z.string(), category: PlaceCategorySchema.nullable() });
export type Trending = z.infer<typeof TrendingSchema>;

/** Giới hạn lịch sử tìm kiếm lưu local (khách) / đồng bộ server (thành viên). */
export const SEARCH_HISTORY_LIMIT = 8;
