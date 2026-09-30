import { z } from 'zod';
import { GeoPointSchema } from './common.js';
import { PlaceCategorySchema, PlaceSummarySchema } from './place.js';

/** Ghim trên quả cầu: chỉ dữ liệu nhẹ để tải nhanh (kể cả chế độ tiết kiệm dữ liệu). */
export const MapPinSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  location: GeoPointSchema,
  categories: z.array(PlaceCategorySchema),
  hotScore: z.number(),
});
export type MapPin = z.infer<typeof MapPinSchema>;

export const MapPinsQuerySchema = z.object({
  mode: z.enum(['hot', 'mine']).default('hot'),
  category: PlaceCategorySchema.optional(),
});
export type MapPinsQuery = z.infer<typeof MapPinsQuerySchema>;

/** Thẻ nổi khi chọn một ghim: thông tin vùng + danh sách vị trí hot tại đó. */
export const DestinationCardSchema = z.object({
  place: PlaceSummarySchema,
  bestSeason: z.string().nullable(),
  checkinsThisWeek: z.number().int(),
  weather: z.object({ tempC: z.number(), condition: z.string() }).nullable(),
  hotSpots: z.array(PlaceSummarySchema),
});
export type DestinationCard = z.infer<typeof DestinationCardSchema>;

/** Dấu chân ("Của tôi"): điểm đã check-in + đường nối theo thời gian. */
export const FootprintSchema = z.object({
  placeId: z.string(),
  name: z.string(),
  location: GeoPointSchema,
  visitedAt: z.string(),
  stayDays: z.number().int().nullable(),
  photoUrl: z.string().nullable(),
});
export type Footprint = z.infer<typeof FootprintSchema>;
