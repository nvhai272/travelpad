import type { MetadataRoute } from 'next';
import { serverApi, safe } from '@/lib/api';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

// TODO(Phase 2): khi dữ liệu lớn, chuyển sang generateSitemaps() + endpoint /sitemap riêng ở API.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [places, posts] = await Promise.all([
    safe(serverApi.places.list({ sort: 'newest', limit: 50 }), { items: [], nextCursor: null }),
    safe(serverApi.posts.feed(), { items: [], nextCursor: null }),
  ]);
  return [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    ...places.items.map((p) => ({ url: `${SITE_URL}/places/${p.slug}`, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...posts.items.map((p) => ({ url: `${SITE_URL}/posts/${p.slug}`, lastModified: p.publishedAt, priority: 0.6 })),
  ];
}
