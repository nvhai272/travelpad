import { vi } from './messages/vi/index.js';
import { en } from './messages/en/index.js';

export type { Messages } from './messages/vi/index.js';
export const locales = ['vi', 'en'] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = 'vi';
export const messages = { vi, en } as const;
