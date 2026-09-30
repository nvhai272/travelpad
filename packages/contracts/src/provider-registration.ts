import { z } from 'zod';
import { PriceUnitSchema, ProviderSummarySchema, ProviderTypeSchema } from './provider.js';
import { UserSummarySchema } from './user.js';

/** Mỗi thành viên tối đa ngần này hồ sơ đang chờ duyệt (chống spam – BR-CONN-06). */
export const MAX_PENDING_REGISTRATIONS = 3;

export const ProviderStatusSchema = z.enum(['pending', 'active', 'rejected', 'suspended']);
export type ProviderStatus = z.infer<typeof ProviderStatusSchema>;

const phone = z.string().trim().regex(/^[0-9+ ]{9,15}$/, 'Số điện thoại không hợp lệ');

/** Hồ sơ đăng ký nhà cung cấp (BR-CONN-06) – dùng cho cả tạo mới và sửa rồi gửi lại. */
export const RegisterProviderSchema = z.object({
  name: z.string().trim().min(3).max(120),
  type: ProviderTypeSchema,
  destinationSlug: z.string().min(1),
  address: z.string().trim().max(200).optional(),
  description: z.string().trim().min(30).max(2000),
  priceFrom: z.coerce.number().int().min(0).max(100_000_000),
  priceUnit: PriceUnitSchema,
  languages: z.array(z.string().min(2).max(5)).max(10).default([]),
  phone,
  zalo: phone.optional(),
  website: z.string().trim().url().max(200).optional(),
  /** Giấy phép kinh doanh / thẻ hướng dẫn viên / đăng ký xe – để quản trị xác minh, không hiện công khai. */
  licenseNumber: z.string().trim().min(3).max(50),
  acceptTerms: z.literal(true),
});
export type RegisterProviderInput = z.infer<typeof RegisterProviderSchema>;

/** Dịch vụ của tôi: thêm trạng thái duyệt và lý do từ chối. */
export const MyProviderSchema = ProviderSummarySchema.extend({
  status: ProviderStatusSchema,
  rejectReason: z.string().nullable(),
  submittedAt: z.string(),
});
export type MyProvider = z.infer<typeof MyProviderSchema>;

/** Bản đầy đủ để chủ sửa hồ sơ. */
export const MyProviderDetailSchema = MyProviderSchema.extend({
  description: z.string(), address: z.string().nullable(), phone: z.string(), zalo: z.string().nullable(),
  website: z.string().nullable(), licenseNumber: z.string().nullable(),
});
export type MyProviderDetail = z.infer<typeof MyProviderDetailSchema>;

/** Hàng đợi duyệt của quản trị: thêm thông tin chủ + liên hệ + giấy phép. */
export const AdminProviderSchema = MyProviderDetailSchema.extend({ owner: UserSummarySchema.nullable() });
export type AdminProvider = z.infer<typeof AdminProviderSchema>;

export const ApproveProviderSchema = z.object({ verified: z.boolean().default(false) });
export type ApproveProviderInput = z.infer<typeof ApproveProviderSchema>;

export const RejectProviderSchema = z.object({ reason: z.string().trim().min(10).max(500) });
export type RejectProviderInput = z.infer<typeof RejectProviderSchema>;
