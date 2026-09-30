import type { MyRating } from '@travelpad/contracts';

/** Kết quả groupBy theo số sao từ Prisma. */
export type RatingGroup = { rating: number; _count: number };
export type RatingSummary = { distribution: number[]; count: number; avg: number };

/** Gộp các nhóm sao thành phân bố [1★..5★], tổng vote và trung bình – dùng chung cho địa điểm & nhà cung cấp. */
export function summarizeRatings(groups: RatingGroup[]): RatingSummary {
  const distribution = [1, 2, 3, 4, 5].map((star) => groups.find((g) => g.rating === star)?._count ?? 0);
  const count = distribution.reduce((a, b) => a + b, 0);
  const avg = count ? distribution.reduce((sum, n, i) => sum + n * (i + 1), 0) / count : 0;
  return { distribution, count, avg };
}

export const toMyRating = (s: RatingSummary, mine: MyRating['myReview']): MyRating => ({
  myReview: mine,
  ratingAvg: Math.round(s.avg * 10) / 10,
  reviewCount: s.count,
  ratingDistribution: s.distribution,
});
