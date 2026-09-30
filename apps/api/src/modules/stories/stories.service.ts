import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { PagedResult, Story, StoryQuery } from '@travelpad/contracts';
import { toUserSummary, userSummarySelect } from '../../common/mappers/index.js';
import { PrismaService } from '../../prisma/prisma.service.js';

const include = {
  author: { select: userSummarySelect },
  place: { select: { id: true, slug: true, name: true, coverUrl: true, parent: { select: { name: true } } } },
} satisfies Prisma.ReviewInclude;
type Row = Prisma.ReviewGetPayload<{ include: typeof include }>;

const toStory = (r: Row): Story => ({
  id: r.id, rating: r.rating, content: r.content, helpfulCount: r.helpfulCount, createdAt: r.createdAt.toISOString(),
  author: toUserSummary(r.author),
  place: { id: r.place.id, slug: r.place.slug, name: r.place.name, coverUrl: r.place.coverUrl, destinationName: r.place.parent?.name ?? null },
});

/** Câu chuyện = nhận xét có nội dung, mới → cũ, phân trang theo số trang (BR-STORY-01..03). */
@Injectable()
export class StoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q: StoryQuery, viewerId?: string): Promise<PagedResult<Story>> {
    const where: Prisma.ReviewWhereInput = {
      content: { not: '' },
      ...(q.author ? { author: { username: q.author } } : {}),
      ...(q.following && viewerId ? { author: { followers: { some: { followerId: viewerId } } } } : {}),
    };
    const [total, rows] = await Promise.all([
      this.prisma.review.count({ where }),
      this.prisma.review.findMany({
        where, include,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (q.page - 1) * q.pageSize, take: q.pageSize,
      }),
    ]);
    return { items: rows.map(toStory), page: q.page, pageSize: q.pageSize, total, totalPages: Math.max(1, Math.ceil(total / q.pageSize)) };
  }
}
