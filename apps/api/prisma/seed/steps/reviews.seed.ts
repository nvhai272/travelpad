import type { User } from '@prisma/client';
import { reviews } from '../data/community.data.js';
import { spots } from '../data/places.data.js';
import { daysAgo, prisma } from '../shared.js';
import type { SeedUsers } from './users.seed.js';

/** Nhận xét có nội dung + lượt "Hữu ích" (BXH Đánh giá hữu ích nhất). */
export async function seedWrittenReviews({ people }: SeedUsers) {
  for (const [u, slug, rating, content, ago, votes] of reviews) {
    const author = people.find((p) => p.username === u) ?? (await prisma.user.findUniqueOrThrow({ where: { username: u } }));
    const place = await prisma.place.findUniqueOrThrow({ where: { slug } });
    const review = await prisma.review.upsert({
      where: { placeId_authorId: { placeId: place.id, authorId: author.id } },
      update: { rating, content, createdAt: daysAgo(ago) },
      create: { placeId: place.id, authorId: author.id, rating, content, createdAt: daysAgo(ago) },
    });
    await prisma.reviewHelpful.deleteMany({ where: { reviewId: review.id } });
    const helpers = people.filter((p) => p.id !== author.id).slice(0, votes);
    for (const h of helpers) await prisma.reviewHelpful.create({ data: { reviewId: review.id, userId: h.id, createdAt: daysAgo(Math.max(0, ago - 1)) } });
    await prisma.review.update({ where: { id: review.id }, data: { helpfulCount: helpers.length } });
  }
}

/** Vote chỉ-sao của lữ khách: trung bình ≈ "sao mục tiêu", số vote theo độ phổ biến. */
export async function seedStarVotes(voters: User[]) {
  for (const [slug, , , , target, popularity] of spots) {
    const place = await prisma.place.findUniqueOrThrow({ where: { slug } });
    const n = Math.min(voters.length, 3 + Math.round(popularity / 150));
    const fives = Math.round((target - 4) * n); // phần còn lại vote 4★
    for (const [i, v] of voters.slice(0, n).entries()) {
      const rating = i < fives ? 5 : 4;
      await prisma.review.upsert({
        where: { placeId_authorId: { placeId: place.id, authorId: v.id } },
        update: {}, // đã có nhận xét (kèm sao) thì giữ nguyên
        create: { placeId: place.id, authorId: v.id, rating, content: '', createdAt: daysAgo(40 + i) },
      });
    }
  }
  await recalcPlaceRatings();
}

/** Điểm = trung bình vote (BR-REV-03): địa điểm con trước, điểm đến gộp vote của chính nó + các con. */
async function recalcPlaceRatings() {
  await prisma.$executeRaw`
    UPDATE "Place" p SET "ratingAvg" = COALESCE(s.avg, 0), "reviewCount" = COALESCE(s.n, 0)
    FROM (SELECT pl.id, AVG(r.rating)::float AS avg, COUNT(r.id)::int AS n FROM "Place" pl LEFT JOIN "Review" r ON r."placeId" = pl.id
          WHERE pl.kind = 'spot' GROUP BY pl.id) s WHERE p.id = s.id`;
  await prisma.$executeRaw`
    UPDATE "Place" p SET "ratingAvg" = COALESCE(s.avg, 0), "reviewCount" = COALESCE(s.n, 0)
    FROM (SELECT d.id, AVG(r.rating)::float AS avg, COUNT(r.id)::int AS n FROM "Place" d
          LEFT JOIN "Place" c ON c."parentId" = d.id OR c.id = d.id LEFT JOIN "Review" r ON r."placeId" = c.id
          WHERE d.kind = 'destination' GROUP BY d.id) s WHERE p.id = s.id`;
}
