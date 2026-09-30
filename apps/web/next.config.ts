import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Deploy (Vercel + Render – docs/deploy.md): NEXT_PUBLIC_API_URL='/v1' → trình duyệt gọi API cùng domain web,
 * Next proxy sang API_INTERNAL_URL; cookie refresh `travelpad_rt` vẫn là first-party. Dev dùng URL tuyệt đối nên không bật.
 */
const apiProxyTarget = process.env.NEXT_PUBLIC_API_URL?.startsWith('/') ? process.env.API_INTERNAL_URL?.replace(/\/$/, '') : undefined;

const config: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return apiProxyTarget ? [{ source: '/v1/:path*', destination: `${apiProxyTarget}/:path*` }] : [];
  },
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8333' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default withNextIntl(config);
