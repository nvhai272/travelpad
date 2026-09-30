import { Injectable } from '@nestjs/common';
import type { CreatorRankingItem, Ranking } from '@travelpad/contracts';
import { MemoryCache } from '../../common/cache/memory-cache.js';
import { toUserSummary, userSummarySelect } from '../../common/mappers/index.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RANKING_CACHE_TTL_MS } from './rankings.service.js';

type Total = { userId: string; total: bigint; contributions: bigint };
type Top = { userId: string; title: string; href: string; count: number };

/** BXH người đóng góp (toàn thời gian): tổng tim bài chia sẻ / tổng "Hữu ích" của nhận xét. */
@Injectable()
export class CreatorRankingsService {
  constructor(private readonly prisma: PrismaService, private readonly cache: MemoryCache) {}

  /** BR-RANK-03: tổng tim bài chia sẻ đã đăng – KHÔNG tính tim tác giả tự thả (BR-POST-03). */
  byLikes(limit: number): Promise<Ranking<CreatorRankingItem>> {
    return this.cache.getOrSet(`rank:likes:${limit}`, RANKING_CACHE_TTL_MS, async () => {
      const totals = await this.prisma.$queryRaw<Total[]>`
        SELECT p."authorId" AS "userId", COUNT(l."userId")::bigint AS total, COUNT(DISTINCT p.id)::bigint AS contributions
        FROM "Post" p LEFT JOIN "PostLike" l ON l."postId" = p.id AND l."userId" <> p."authorId"
        WHERE p.status = 'published'
        GROUP BY p."authorId" HAVING COUNT(l."userId") > 0
        ORDER BY total DESC, contributions DESC LIMIT ${limit}`;
      const tops = await this.prisma.$queryRaw<Top[]>`
        SELECT DISTINCT ON (p."authorId") p."authorId" AS "userId", p.title, '/posts/' || p.slug AS href, COUNT(l."userId")::int AS count
        FROM "Post" p LEFT JOIN "PostLike" l ON l."postId" = p.id AND l."userId" <> p."authorId"
        WHERE p.status = 'published' AND p."authorId" = ANY(${totals.map((t) => t.userId)})
        GROUP BY p.id ORDER BY p."authorId", count DESC`;
      return this.build(totals, tops);
    });
  }

  /** BR-RANK-04: tổng "Hữu ích" trên các nhận xét (không tự vote được – chặn ở ReviewHelpfulService). */
  byHelpful(limit: number): Promise<Ranking<CreatorRankingItem>> {
    return this.cache.getOrSet(`rank:helpful:${limit}`, RANKING_CACHE_TTL_MS, async () => {
      const totals = await this.prisma.$queryRaw<Total[]>`
        SELECT "authorId" AS "userId", SUM("helpfulCount")::bigint AS total, COUNT(*) FILTER (WHERE content <> '')::bigint AS contributions
        FROM "Review" GROUP BY "authorId" HAVING SUM("helpfulCount") > 0
        ORDER BY total DESC, contributions DESC LIMIT ${limit}`;
      const tops = await this.prisma.$queryRaw<Top[]>`
        SELECT DISTINCT ON (r."authorId") r."authorId" AS "userId", pl.name AS title, '/places/' || pl.slug AS href, r."helpfulCount" AS count
        FROM "Review" r JOIN "Place" pl ON pl.id = r."placeId"
        WHERE r."authorId" = ANY(${totals.map((t) => t.userId)})
        ORDER BY r."authorId", r."helpfulCount" DESC`;
      return this.build(totals, tops);
    });
  }

  /** Ghép tổng điểm + mục nổi bật với thông tin người dùng, giữ thứ tự hạng. */
  private async build(totals: Total[], tops: Top[]): Promise<Ranking<CreatorRankingItem>> {
    const users = await this.prisma.user.findMany({ where: { id: { in: totals.map((t) => t.userId) } }, select: userSummarySelect });
    const byId = new Map(users.map((u) => [u.id, u]));
    const topBy = new Map(tops.map((t) => [t.userId, t]));
    return {
      items: totals.filter((t) => byId.has(t.userId)).map((t, i) => {
        const top = topBy.get(t.userId);
        return {
          rank: i + 1, user: toUserSummary(byId.get(t.userId)!), total: Number(t.total), contributions: Number(t.contributions),
          top: top ? { title: top.title, href: top.href, count: Number(top.count) } : null,
        };
      }),
    };
  }
}
