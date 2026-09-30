import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { defaultLocale, locales } from '@travelpad/i18n';

/**
 * vi là mặc định, không có tiền tố: /places/sa-pa ; tiếng Anh: /en/places/sa-pa.
 * Không tự đoán theo Accept-Language (sản phẩm cho người Việt) – đổi ngôn ngữ trong Cài đặt, next-intl nhớ bằng cookie.
 */
export const routing = defineRouting({ locales, defaultLocale, localePrefix: 'as-needed', localeDetection: false });
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
