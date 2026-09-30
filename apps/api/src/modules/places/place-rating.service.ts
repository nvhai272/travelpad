import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { PlaceKind, Prisma } from '@prisma/client';
import type { CreateReviewInput, MyRating } from '@travelpad/contracts';
import { summarizeRatings, toMyRating } from '../../common/rating/rating-summary.js';
import { PrismaService } from '../../prisma/prisma.service.js';

/** Điểm đến (cha) gộp vote của mọi địa điểm con – chỉ dùng nội bộ để xếp độ phổ biến, không hiển thị (BR-PLACE-06). */
export const placeRatingScope = (placeId: string, kind: PlaceKind): Prisma.ReviewWhereInput =>
  kind === 'destination' ? { OR: [{ placeId }, { place: { parentId: placeId } }] } : { placeId };

/** Vote sao của tôi cho địa điểm (BR-REV-01..03) + tính lại điểm địa điểm và điểm đến cha. */
@Injectable()
export class PlaceRatingService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertMine(placeId: string, userId: string, input: CreateReviewInput): Promise<MyRating> {
    const { kind } = await this.ensurePlace(placeId);
    // BR-REV-08: chỉ chấm sao địa điểm cụ thể; điểm đến lớn (Sapa, Hạ Long…) không có đánh giá riêng
    if (kind === 'destination') throw new BadRequestException({ code: 'DESTINATION_NOT_RATABLE', message: 'Hãy chấm sao cho một địa điểm cụ thể trong điểm đến này' });
    return this.prisma.$transaction(async (tx) => {
      const data = { rating: input.rating, content: input.content ?? '' };
      await tx.review.upsert({
        where: { placeId_authorId: { placeId, authorId: userId } },
        update: data,
        create: { placeId, authorId: userId, ...data },
      });
      return this.recalc(tx, placeId, userId, true);
    });
  }

  async getMine(placeId: string, userId: string): Promise<MyRating> {
    await this.ensurePlace(placeId);
    return this.recalc(this.prisma, placeId, userId, false);
  }

  removeMine(placeId: string, userId: string): Promise<MyRating> {
    return this.prisma.$transaction(async (tx) => {
      await tx.review.deleteMany({ where: { placeId, authorId: userId } });
      return this.recalc(tx, placeId, userId, true);
    });
  }

  private async ensurePlace(id: string) {
    const place = await this.prisma.place.findUnique({ where: { id }, select: { kind: true } });
    if (!place) throw new NotFoundException({ code: 'PLACE_NOT_FOUND', message: 'Không tìm thấy địa điểm' });
    return place;
  }

  private async summarize(db: Prisma.TransactionClient, placeId: string, kind: PlaceKind) {
    const groups = await db.review.groupBy({ by: ['rating'], where: placeRatingScope(placeId, kind), _count: true });
    return summarizeRatings(groups);
  }

  /** `write=false` chỉ đọc; `write=true` cập nhật ratingAvg/reviewCount của địa điểm và điểm đến cha. */
  private async recalc(db: Prisma.TransactionClient, placeId: string, userId: string, write: boolean): Promise<MyRating> {
    const place = await db.place.findUniqueOrThrow({ where: { id: placeId }, select: { parentId: true, kind: true } });
    const own = await this.summarize(db, placeId, place.kind);
    if (write) {
      await db.place.update({ where: { id: placeId }, data: { ratingAvg: own.avg, reviewCount: own.count } });
      if (place.parentId) {
        const parent = await this.summarize(db, place.parentId, 'destination');
        await db.place.update({ where: { id: place.parentId }, data: { ratingAvg: parent.avg, reviewCount: parent.count } });
      }
    }
    const mine = await db.review.findUnique({
      where: { placeId_authorId: { placeId, authorId: userId } },
      select: { id: true, rating: true, content: true },
    });
    return toMyRating(own, mine);
  }
}
