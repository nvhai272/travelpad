import { z } from 'zod';
import { LocaleSchema } from './common.js';

/**
 * Cài đặt người dùng. Khách: lưu localStorage/AsyncStorage.
 * Thành viên: đồng bộ server (GET/PATCH /me/settings) để dùng chung web + app.
 */
export const UserSettingsSchema = z.object({
  locale: LocaleSchema.default('vi'),
  theme: z.enum(['system', 'light', 'dark']).default('system'),
  mapStyle: z.enum(['classic', 'terrain', 'satellite']).default('classic'),
  largeText: z.boolean().default(false),
  dataSaver: z.boolean().default(false),
  notifications: z
    .object({ friends: z.boolean().default(true), weeklyHot: z.boolean().default(true), postActivity: z.boolean().default(true) })
    .default({ friends: true, weeklyHot: true, postActivity: true }),
  privacy: z
    .object({ shareLocation: z.enum(['off', 'friends', 'public']).default('friends'), profileVisibility: z.enum(['public', 'friends']).default('public') })
    .default({ shareLocation: 'friends', profileVisibility: 'public' }),
});
export type UserSettings = z.infer<typeof UserSettingsSchema>;

export const UpdateUserSettingsSchema = UserSettingsSchema.partial();
export type UpdateUserSettingsInput = z.infer<typeof UpdateUserSettingsSchema>;
