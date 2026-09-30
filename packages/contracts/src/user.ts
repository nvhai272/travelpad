import { z } from 'zod';

/** BR-USER-01: người trải nghiệm (du khách) hoặc nhà cung cấp dịch vụ du lịch. */
export const AccountTypeSchema = z.enum(['traveler', 'provider']);
export type AccountType = z.infer<typeof AccountTypeSchema>;

export const UserSummarySchema = z.object({
  id: z.string(),
  username: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().nullable(),
  level: z.number().int(),
  accountType: AccountTypeSchema,
});
export type UserSummary = z.infer<typeof UserSummarySchema>;

export const UserProfileSchema = UserSummarySchema.extend({
  bio: z.string().nullable(),
  coverUrl: z.string().nullable(),
  xp: z.number().int(),
  stats: z.object({
    posts: z.number().int(),
    journeys: z.number().int(),
    places: z.number().int(),
    reviews: z.number().int(),
    followers: z.number().int(),
    following: z.number().int(),
  }),
  /** Quan hệ với người đang xem (BR-FOL-01). Khách: cả hai false. */
  viewer: z.object({ isSelf: z.boolean(), following: z.boolean() }),
  currentlyTraveling: z.boolean(),
  /** Chỉ có ý nghĩa với chính mình (/users/me): dùng để hiện lối vào trang quản trị. */
  role: z.enum(['USER', 'MODERATOR', 'ADMIN']),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  bio: z.string().max(300).optional(),
  avatarMediaId: z.string().optional(),
  coverMediaId: z.string().optional(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
