import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

/** Bỏ qua `v1/` – đường proxy sang API khi deploy (next.config.ts rewrites). */
export const config = { matcher: ['/((?!api|v1/|_next|_vercel|.*\\..*).*)'] };
