import type { User } from '@prisma/client';
import { recentCheckins } from '../data/community.data.js';
import { daysAgo, prisma } from '../shared.js';

/** Dấu chân "Của tôi" của Minh Anh (điểm đến) + check-in gần đây ở các địa điểm con. */
export async function seedCheckins(minhAnh: User, people: User[], destId: Map<string, string>) {
  await prisma.checkin.deleteMany({ where: { userId: minhAnh.id } });
  for (const [i, slug] of ['ha-noi', 'sa-pa', 'da-nang', 'tp-hcm'].entries()) {
    await prisma.checkin.create({
      data: { userId: minhAnh.id, placeId: destId.get(slug)!, visitedAt: new Date(Date.UTC(2026, 2 + i * 2, 10)), stayDays: 2 + i },
    });
  }
  const spotIds = (await prisma.place.findMany({ where: { kind: 'spot' }, select: { id: true } })).map((p) => p.id);
  await prisma.checkin.deleteMany({ where: { placeId: { in: spotIds } } });
  for (const [i, [slug, n]] of recentCheckins.entries()) {
    const place = await prisma.place.findUniqueOrThrow({ where: { slug } });
    for (const p of people.slice(0, n)) await prisma.checkin.create({ data: { userId: p.id, placeId: place.id, visitedAt: daysAgo((i % 5) + 1) } });
  }
}
