import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Paginated, PostDetail, PostQuery, PostSummary } from '@travelpad/contracts';
import { toUserSummary, userSummarySelect } from '../../common/mappers/index.js';
import { cursorArgs, toPage } from '../../common/pagination.js';
import { PrismaService } from '../../prisma/prisma.service.js';

const include = (viewerId?: string) =>
  ({
    author: { select: userSummarySelect },
    place: { select: { id: true, slug: true, name: true, province: true } },
    likes: { where: { userId: viewerId ?? '' }, select: { userId: true } },
    bookmarks: { where: { userId: viewerId ?? '' }, select: { userId: true } },
  }) satisfies Prisma.PostInclude;

type PostRow = Prisma.PostGetPayload<{ include: ReturnType<typeof include> }>;

const toSummary = (p: PostRow): PostSummary => ({
  id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt, coverUrl: p.coverUrl,
  author: toUserSummary(p.author), place: p.place,
  likeCount: p.likeCount, commentCount: p.commentCount,
  viewer: { liked: p.likes.length > 0, saved: p.bookmarks.length > 0 },
  publishedAt: (p.publishedAt ?? p.createdAt).toISOString(),
});

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async feed(q: PostQuery, viewerId?: string): Promise<Paginated<PostSummary>> {
    const rows = await this.prisma.post.findMany({
      where: {
        status: 'published',
        // TODO(TL-201): tìm không dấu (unaccent) + xếp theo mức liên quan
        ...(q.q ? { OR: ['title', 'excerpt', 'content'].map((f) => ({ [f]: { contains: q.q, mode: 'insensitive' as const } })) } : {}),
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      include: include(viewerId),
      ...cursorArgs(q.cursor, q.limit),
    });
    return toPage(rows, q.limit, toSummary);
  }

  async bySlug(slug: string, viewerId?: string): Promise<PostDetail> {
    const p = await this.prisma.post.findFirst({ where: { slug, status: 'published' }, include: include(viewerId) });
    if (!p) throw new NotFoundException({ code: 'POST_NOT_FOUND', message: 'Không tìm thấy bài viết' });
    return { ...toSummary(p), content: p.content, gallery: p.gallery, tags: p.tags };
  }

  /** Idempotent: PUT nhiều lần không tăng đếm sai. */
  async setLike(postId: string, userId: string, on: boolean) {
    await this.prisma.$transaction(async (tx) => {
      if (on) {
        const r = await tx.postLike.createMany({ data: [{ postId, userId }], skipDuplicates: true });
        if (r.count) await tx.post.update({ where: { id: postId }, data: { likeCount: { increment: 1 } } });
      } else {
        const r = await tx.postLike.deleteMany({ where: { postId, userId } });
        if (r.count) await tx.post.update({ where: { id: postId }, data: { likeCount: { decrement: 1 } } });
      }
    });
  }

  async setBookmark(postId: string, userId: string, on: boolean) {
    if (on) await this.prisma.bookmark.createMany({ data: [{ postId, userId }], skipDuplicates: true });
    else await this.prisma.bookmark.deleteMany({ where: { postId, userId } });
  }
}
