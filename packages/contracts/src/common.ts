import { z } from 'zod';

export const IdSchema = z.string().min(1);
export const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

/** Phân trang dạng cursor – ổn định cho feed vô hạn trên web & mobile. */
export const CursorQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type CursorQuery = z.infer<typeof CursorQuerySchema>;

export const paginated = <T extends z.ZodTypeAny>(item: T) =>
  z.object({ items: z.array(item), nextCursor: z.string().nullable() });
export type Paginated<T> = { items: T[]; nextCursor: string | null };

export const GeoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type GeoPoint = z.infer<typeof GeoPointSchema>;

/** Định dạng lỗi thống nhất mọi endpoint trả về. */
export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

export const LocaleSchema = z.enum(['vi', 'en']);
export type Locale = z.infer<typeof LocaleSchema>;
