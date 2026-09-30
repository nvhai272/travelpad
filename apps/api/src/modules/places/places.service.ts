import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { CursorQuery, Paginated, PlaceDetail, PlaceQuery, PlaceSummary, Review } from '@travelpad/contracts';
import { toPlaceSummary, toUserSummary, userSummarySelect } from '../../common/mappers/index.js';
import { cursorArgs, toPage } from '../../common/pagination.js';
import { summarizeRatings } from '../../common/rating/rating-summary.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { placeRatingScope } from './place-rating.service.js';

const ORDER: Record<PlaceQuery['sort'], Prisma.PlaceOrderByWithRelationInput[]> = {
  newest: [{ createdAt: 'desc' }, { id: 'desc' }],
  featured: [{ hotScore: 'desc' }, { ratingAvg: 'desc' }, { id: 'desc' }],
  rating: [{ ratingAvg: 'desc' }, { id: 'desc' }],
  relevance: [{ ratingAvg: 'desc' }, { id: 'desc' }],
  nearby: [{ ratingAvg: 'desc' }, { id: 'desc' }], // TODO(TL-306): PostGIS ST_DWithin
};

/** Đọc địa điểm: danh sách + bộ lọc, chi tiết, nhận xét. Vote sao nằm ở PlaceRatingService. */
@Injectable()
export class PlacesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(q: PlaceQuery): Promise<Paginated<PlaceSummary>> {
    // TODO(TL-201): q dùng unaccent + pg_trgm
    const where: Prisma.PlaceWhereInput = {
      kind: q.kind,
      parentId: q.parentId,
      province: q.province,
      ...(q.region?.length ? { region: { in: q.region } } : {}),
      ...(q.category?.length ? { category: { in: q.category } } : {}),
      ...(q.price?.length ? { priceLevel: { in: q.price } } : {}),
      ...(q.minRating ? { ratingAvg: { gte: q.minRating } } : {}),
      ...(q.q ? { name: { contains: q.q, mode: 'insensitive' } } : {}),
      ...(q.sort === 'featured' ? { isFeatured: true } : {}),
    };
    const rows = await this.prisma.place.findMany({ where, orderBy: ORDER[q.sort], ...cursorArgs(q.cursor, q.limit) });
    return toPage(rows, q.limit, toPlaceSummary);
  }

  async bySlug(slug: string, viewerId?: string): Promise<PlaceDetail> {
    const p = await this.prisma.place.findUnique({ where: { slug }, include: { parent: { select: { id: true, slug: true, name: true } } } });
    if (!p) throw new NotFoundException({ code: 'PLACE_NOT_FOUND', message: 'Không tìm thấy địa điểm' });

    const weekAgo = new Date(Date.now() - 7 * 86_400_000);
    const [checkinsThisWeek, visited, groups] = await Promise.all([
      this.prisma.checkin.count({ where: { placeId: p.id, visitedAt: { gte: weekAgo } } }),
      viewerId ? this.prisma.checkin.count({ where: { placeId: p.id, userId: viewerId } }) : 0,
      this.prisma.review.groupBy({ by: ['rating'], _count: true, where: placeRatingScope(p.id, p.kind) }),
    ]);
    return {
      ...toPlaceSummary(p),
      description: p.description, address: p.address, gallery: p.gallery, tags: p.tags,
      bestSeason: p.bestSeason, checkinsThisWeek, parent: p.parent,
      ratingDistribution: summarizeRatings(groups).distribution,
      // TODO(TL-506): saved = có trong một Journey "planning" của viewer
      viewer: { saved: false, visited: visited > 0 },
    };
  }

  /** Chỉ vote có kèm nhận xét; vote chỉ-sao vẫn tính vào điểm (BR-REV-02). */
  async reviews(placeId: string, q: CursorQuery): Promise<Paginated<Review>> {
    const rows = await this.prisma.review.findMany({
      where: { placeId, content: { not: '' } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      include: { author: { select: userSummarySelect } },
      ...cursorArgs(q.cursor, q.limit),
    });
    return toPage(rows, q.limit, (r) => ({
      id: r.id, rating: r.rating, content: r.content, author: toUserSummary(r.author),
      helpfulCount: r.helpfulCount, createdAt: r.createdAt.toISOString(),
    }));
  }
}
