import { z } from 'zod';

/** Kết nối du lịch – nhà cung cấp dịch vụ (docs/business-rules.md §10b). */
export const ProviderTypeSchema = z.enum([
  'hotel', 'guesthouse', 'homestay', 'resort', 'restaurant', 'cafe', 'tour_guide', 'tour_operator', 'car_rental', 'motorbike_rental', 'shuttle',
]);
export type ProviderType = z.infer<typeof ProviderTypeSchema>;

/** 4 nhóm hiển thị trên UI, theo thứ tự này (BR-CONN-01). */
export const ProviderGroupSchema = z.enum(['stay', 'food', 'transport', 'guide']);
export type ProviderGroup = z.infer<typeof ProviderGroupSchema>;
export const PROVIDER_GROUPS: Record<ProviderGroup, ProviderType[]> = {
  stay: ['hotel', 'guesthouse', 'homestay', 'resort'],
  food: ['restaurant', 'cafe'],
  guide: ['tour_guide', 'tour_operator'],
  transport: ['car_rental', 'motorbike_rental', 'shuttle'],
};

export const PriceUnitSchema = z.enum(['night', 'day', 'trip', 'person']);

export const ProviderSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  type: ProviderTypeSchema,
  destination: z.object({ id: z.string(), slug: z.string(), name: z.string(), province: z.string() }),
  priceFrom: z.number().int(),
  priceUnit: PriceUnitSchema,
  languages: z.array(z.string()),
  coverUrl: z.string().nullable(),
  verified: z.boolean(),
  ratingAvg: z.number(),
  reviewCount: z.number().int(),
  /** Liên hệ đã che (VD "0912 ••• 678") – khách chỉ thấy bản này (BR-CONN-03). */
  maskedPhone: z.string(),
});
export type ProviderSummary = z.infer<typeof ProviderSummarySchema>;

export const ProviderDetailSchema = ProviderSummarySchema.extend({
  description: z.string(),
  address: z.string().nullable(),
  /** Số vote theo mức sao [1★..5★] */
  ratingDistribution: z.array(z.number().int()).length(5),
});
export type ProviderDetail = z.infer<typeof ProviderDetailSchema>;

export const ProviderContactSchema = z.object({ phone: z.string(), zalo: z.string().nullable(), website: z.string().nullable() });
export type ProviderContact = z.infer<typeof ProviderContactSchema>;

export const ProviderQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  destination: z.string().optional(), // slug điểm đến
  group: ProviderGroupSchema.optional(),
  type: ProviderTypeSchema.optional(),
  limit: z.coerce.number().int().min(1).max(50).default(24),
});
export type ProviderQuery = z.infer<typeof ProviderQuerySchema>;

/** BR-CONN-04: yêu cầu kết nối. */
export const CreateConnectRequestSchema = z.object({
  message: z.string().trim().min(10).max(1000),
  travelDate: z.string().date().optional(),
  people: z.coerce.number().int().min(1).max(50).optional(),
  contactPhone: z.string().trim().regex(/^[0-9+ ]{9,15}$/).optional(),
});
export type CreateConnectRequestInput = z.infer<typeof CreateConnectRequestSchema>;
/** Mỗi thành viên tối đa ngần này yêu cầu/ngày (chống spam nhà cung cấp). */
export const CONNECT_REQUESTS_PER_DAY = 10;
