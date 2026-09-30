import { inSeason, type PlaceSummary } from '@travelpad/contracts';

/** Tháng hiện tại theo giờ Việt Nam (máy chủ có thể chạy UTC). */
export const currentMonthVn = () => Number(new Intl.DateTimeFormat('en', { month: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date()));

/**
 * BR-HOME-06: điểm đến đang vào mùa đẹp (theo "mùa đẹp nhất"), xếp theo số người đánh giá.
 * Ít hơn `min` thì bù bằng điểm đến sắp vào mùa (tháng sau) – đánh dấu `soon`.
 */
export function seasonPicks(destinations: PlaceSummary[], month: number, min = 3, max = 4) {
  const byVotes = (a: PlaceSummary, b: PlaceSummary) => b.reviewCount - a.reviewCount || b.ratingAvg - a.ratingAvg;
  const now = destinations.filter((d) => inSeason(d.bestSeason, month)).sort(byVotes).map((d) => ({ d, soon: false }));
  const next = (month % 12) + 1;
  const soon = destinations.filter((d) => !inSeason(d.bestSeason, month) && inSeason(d.bestSeason, next)).sort(byVotes).map((d) => ({ d, soon: true }));
  return [...now, ...(now.length < min ? soon : [])].slice(0, max);
}
