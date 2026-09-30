import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

/** Vote "Hữu ích" cho nhận xét (BR-REV-05). Idempotent: PUT nhiều lần chỉ tính 1; không tự vote. */
@Injectable()
export class ReviewHelpfulService {
  constructor(private readonly prisma: PrismaService) {}

  async mark(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId }, select: { authorId: true } });
    if (!review) throw new NotFoundException({ code: 'REVIEW_NOT_FOUND', message: 'Không tìm thấy đánh giá' });
    if (review.authorId === userId) {
      throw new ForbiddenException({ code: 'OWN_REVIEW', message: 'Bạn không thể đánh dấu “Hữu ích” cho đánh giá của chính mình' });
    }
    await this.prisma.$transaction(async (tx) => {
      const r = await tx.reviewHelpful.createMany({ data: [{ reviewId, userId }], skipDuplicates: true });
      if (r.count) await tx.review.update({ where: { id: reviewId }, data: { helpfulCount: { increment: 1 } } });
    });
  }

  async unmark(reviewId: string, userId: string) {
    await this.prisma.$transaction(async (tx) => {
      const r = await tx.reviewHelpful.deleteMany({ where: { reviewId, userId } });
      if (r.count) await tx.review.update({ where: { id: reviewId }, data: { helpfulCount: { decrement: 1 } } });
    });
  }
}
