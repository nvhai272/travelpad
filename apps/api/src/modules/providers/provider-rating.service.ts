import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import type { CreateReviewInput, MyRating } from '@travelpad/contracts';
import { summarizeRatings, toMyRating } from '../../common/rating/rating-summary.js';
import { PrismaService } from '../../prisma/prisma.service.js';

/** Vote sao nhà cung cấp – chỉ người đã gửi yêu cầu kết nối (BR-CONN-07, chống vote ảo). */
@Injectable()
export class ProviderRatingService {
  constructor(private readonly prisma: PrismaService) {}

  async rate(providerId: string, userId: string, input: CreateReviewInput): Promise<MyRating> {
    const owner = await this.ensureActive(providerId);
    // BR-CONN-10: nhà cung cấp được đánh giá dịch vụ khác, nhưng không được đánh giá dịch vụ của chính mình
    if (owner === userId) throw new ForbiddenException({ code: 'OWN_SERVICE', message: 'Bạn không thể chấm sao dịch vụ của chính mình' });
    if (!(await this.prisma.connectRequest.count({ where: { providerId, userId } }))) {
      throw new ForbiddenException({ code: 'NOT_CONNECTED', message: 'Bạn cần gửi yêu cầu kết nối tới nhà cung cấp này trước khi chấm sao' });
    }
    return this.prisma.$transaction(async (tx) => {
      const data = { rating: input.rating, content: input.content ?? '' };
      await tx.providerReview.upsert({
        where: { providerId_authorId: { providerId, authorId: userId } },
        update: data,
        create: { providerId, authorId: userId, ...data },
      });
      return this.recalc(tx, providerId, userId, true);
    });
  }

  mine(providerId: string, userId: string): Promise<MyRating> {
    return this.recalc(this.prisma, providerId, userId, false);
  }

  remove(providerId: string, userId: string): Promise<MyRating> {
    return this.prisma.$transaction(async (tx) => {
      await tx.providerReview.deleteMany({ where: { providerId, authorId: userId } });
      return this.recalc(tx, providerId, userId, true);
    });
  }

  /** Trả về ownerId của nhà cung cấp đang hoạt động. */
  private async ensureActive(id: string) {
    const p = await this.prisma.serviceProvider.findFirst({ where: { id, status: 'active' }, select: { ownerId: true } });
    if (!p) throw new NotFoundException({ code: 'PROVIDER_NOT_FOUND', message: 'Không tìm thấy nhà cung cấp' });
    return p.ownerId;
  }

  private async recalc(db: Prisma.TransactionClient, providerId: string, userId: string, write: boolean): Promise<MyRating> {
    const groups = await db.providerReview.groupBy({ by: ['rating'], where: { providerId }, _count: true });
    const summary = summarizeRatings(groups);
    if (write) await db.serviceProvider.update({ where: { id: providerId }, data: { ratingAvg: summary.avg, reviewCount: summary.count } });
    const mine = await db.providerReview.findUnique({
      where: { providerId_authorId: { providerId, authorId: userId } },
      select: { id: true, rating: true, content: true },
    });
    return toMyRating(summary, mine);
  }
}
