import type { Messages } from '@travelpad/i18n';

/** Kiểm tra key dịch lúc biên dịch: t('map.hot') sai key → lỗi TypeScript thay vì lỗi runtime. */
declare module 'next-intl' {
  interface AppConfig {
    Messages: Messages;
  }
}
