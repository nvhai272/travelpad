import { Star } from 'lucide-react';
import { MIN_VOTES_TO_SHOW_RATING } from '@travelpad/contracts';

/**
 * Huy hiệu sao dùng chung (BR-PLACE-03): đủ 3 vote → "★ 4.8"; chưa đủ → nhãn "Mới" (hoặc ẩn nếu không truyền newLabel).
 * `tone="map"` cho nền tối của quả cầu.
 */
export function RatingPill({ avg, votes, newLabel, tone = 'default' }: { avg: number; votes: number; newLabel?: string; tone?: 'default' | 'map' }) {
  if (votes < MIN_VOTES_TO_SHOW_RATING) {
    if (!newLabel) return null;
    return <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-bold ${tone === 'map' ? 'text-map-muted' : 'bg-secondary text-muted-foreground'}`}>{newLabel}</span>;
  }
  return (
    <span className={`flex shrink-0 items-center gap-1 text-xs font-bold ${tone === 'map' ? 'text-map-accent' : 'rounded-full bg-rating px-2 py-1 text-rating-foreground'}`}>
      <Star className="size-3 fill-current" /> {avg.toFixed(1)}
    </span>
  );
}
