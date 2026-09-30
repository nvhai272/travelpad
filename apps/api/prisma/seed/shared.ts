import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// Ảnh thật (Wikimedia Commons, giấy phép tự do) trong apps/web/public/images/places/<slug>.jpg.
// Ghi công tác giả: apps/web/src/lib/photo-credits.ts – thêm ảnh mới phải thêm ghi công.
export const placeImage = (slug: string) => `/images/places/${slug}.jpg`;

export const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000);
export const emailOf = (username: string) => `${username}@travelpad.local`;
/** Mật khẩu dev chung cho mọi tài khoản mẫu. */
export const DEV_PASSWORD = 'password123';
