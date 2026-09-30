import { spotDescriptions } from '../data/place-descriptions.data.js';
import { destinations, FEATURED, spots } from '../data/places.data.js';
import { placeImage, prisma } from '../shared.js';

/** Điểm đến + địa điểm con. Trả về map slug điểm đến → id. */
export async function seedPlaces() {
  const destId = new Map<string, string>();
  for (const [i, d] of destinations.entries()) {
    const data = { ...d, coverUrl: placeImage(d.slug), kind: 'destination' as const, category: 'sightseeing' as const, isFeatured: true, hotScore: 100 - i, gallery: [], tags: [] };
    const p = await prisma.place.upsert({ where: { slug: d.slug }, update: data, create: data });
    destId.set(d.slug, p.id);
  }
  for (const [i, [slug, name, dest, category, , , price, hot, lat, lng]] of spots.entries()) {
    const d = destinations.find((x) => x.slug === dest)!;
    const data = {
      slug, name, category, lat, lng, kind: 'spot' as const, parentId: destId.get(dest)!, province: d.province, region: d.region,
      priceLevel: price, coverUrl: placeImage(slug),
      isFeatured: FEATURED.has(slug), hotScore: hot ? 100 - i : 0, bestSeason: d.bestSeason,
      description: spotDescriptions[slug] ?? d.description, gallery: [], tags: [],
    };
    await prisma.place.upsert({ where: { slug }, update: data, create: data });
  }
  return destId;
}
