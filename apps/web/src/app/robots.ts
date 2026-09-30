import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/me/', '/admin/', '/following', '/en/me/', '/en/admin/', '/en/following'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
