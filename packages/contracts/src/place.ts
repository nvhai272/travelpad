import { z } from 'zod';
import { GeoPointSchema } from './common.js';
import { UserSummarySchema } from './user.js';

/** Danh mục trải nghiệm (chip lọc trên bản đồ & tìm kiếm). */
export const PlaceCategorySchema = z.enum(['food', 'stay', 'camping', 'hiking', 'sightseeing', 'other']);
export type PlaceCategory = z.infer<typeof PlaceCategorySchema>;

/** Vùng miền dùng cho bộ lọc khu vực. */
export const RegionSchema = z.enum(['north', 'central', 'highlands', 'south']);
export type Region = z.infer<typeof RegionSchema>;

/** 1 = $ tiết kiệm (<300k/miễn phí), 2 = $$ hợp lý (300k–1tr), 3 = $$$ cao cấp (>1tr). */
export const PriceLevelSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type PriceLevel = z.infer<typeof PriceLevelSchema>;

/**
 * destination = một vùng/điểm đến lớn (Sapa, Đà Lạt) – là "ghim" trên quả cầu.
 * spot = vị trí cụ thể thuộc một destination (Đỉnh Fansipan, Bản Cát Cát).
 */
export const PlaceKindSchema = z.enum(['destination', 'spot']);
export type PlaceKind = z.infer<typeof PlaceKindSchema>;

export const PlaceSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  province: z.string(),
  region: RegionSchema,
  kind: PlaceKindSchema,
  parentId: z.string().nullable(),
  category: PlaceCategorySchema,
  priceLevel: PriceLevelSchema.nullable(),
  coverUrl: z.string().nullable(),
  location: GeoPointSchema,
  ratingAvg: z.number(),
  reviewCount: z.number().int(),
  /** Mùa đẹp nhất, dạng chữ biên tập ("Tháng 9 – 11"); đọc thành tháng bằng `seasonMonths`. */
  bestSeason: z.string().nullable(),
});
export type PlaceSummary = z.infer<typeof PlaceSummarySchema>;

export const PlaceDetailSchema = PlaceSummarySchema.extend({
  description: z.string(),
  address: z.string().nullable(),
  gallery: z.array(z.string()),
  tags: z.array(z.string()),
  checkinsThisWeek: z.number().int(),
  /** Số lượt vote theo từng mức sao: [1★, 2★, 3★, 4★, 5★] */
  ratingDistribution: z.array(z.number().int()).length(5),
  parent: z.object({ id: z.string(), slug: z.string(), name: z.string() }).nullable(),
  viewer: z.object({ saved: z.boolean(), visited: z.boolean() }),
});
export type PlaceDetail = z.infer<typeof PlaceDetailSchema>;

const csv = <T extends z.ZodTypeAny>(item: T) =>
  z.preprocess((v) => (typeof v === 'string' ? v.split(',').filter(Boolean) : v), z.array(item));

/** Bộ lọc đa tiêu chí – dùng chung cho trang tìm kiếm, bản đồ và app mobile. */
export const PlaceQuerySchema = z.object({
  q: z.string().optional(),
  kind: PlaceKindSchema.optional(),
  parentId: z.string().optional(),
  region: csv(RegionSchema).optional(),
  category: csv(PlaceCategorySchema).optional(),
  price: csv(z.coerce.number().int().min(1).max(3)).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  province: z.string().optional(),
  sort: z.enum(['featured', 'rating', 'newest', 'nearby', 'relevance']).default('featured'),
  near: z.string().optional(), // "lat,lng"
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type PlaceQuery = z.infer<typeof PlaceQuerySchema>;

export const ReviewSchema = z.object({
  id: z.string(),
  rating: z.number().int().min(1).max(5),
  content: z.string(),
  author: UserSummarySchema,
  helpfulCount: z.number().int(),
  createdAt: z.string(),
});
export type Review = z.infer<typeof ReviewSchema>;

/** Dưới ngưỡng này địa điểm hiện nhãn "Mới" thay cho điểm sao và không vào BXH (BR-PLACE-03). */
export const MIN_VOTES_TO_SHOW_RATING = 3;

/**
 * Vote sao của người dùng cho địa điểm (BR-REV-01/02): mỗi người 1 vote/địa điểm, sửa được.
 * Lời nhận xét không bắt buộc; nếu có thì 10–2000 ký tự.
 */
export const CreateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  content: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .refine((v) => !v || v.length >= 10, { message: 'Nhận xét cần ít nhất 10 ký tự' }),
});
export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;

/** Kết quả sau khi vote: vote của tôi + điểm mới của địa điểm (client cập nhật ngay, không chờ cache). */
export const MyRatingSchema = z.object({
  myReview: z.object({ id: z.string(), rating: z.number().int(), content: z.string() }).nullable(),
  ratingAvg: z.number(),
  reviewCount: z.number().int(),
  ratingDistribution: z.array(z.number().int()).length(5),
});
export type MyRating = z.infer<typeof MyRatingSchema>;
