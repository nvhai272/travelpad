import type { Place } from '@prisma/client';
import type { PlaceSummary } from '@travelpad/contracts';

export const toPlaceSummary = (p: Place): PlaceSummary => ({
  id: p.id, slug: p.slug, name: p.name, province: p.province, region: p.region, kind: p.kind, parentId: p.parentId,
  category: p.category, priceLevel: (p.priceLevel as 1 | 2 | 3 | null) ?? null, coverUrl: p.coverUrl,
  location: { lat: p.lat, lng: p.lng },
  ratingAvg: Math.round(p.ratingAvg * 10) / 10, reviewCount: p.reviewCount, bestSeason: p.bestSeason,
});
