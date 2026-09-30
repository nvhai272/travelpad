'use client';

import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { MIN_VOTES_TO_SHOW_RATING } from '@travelpad/contracts';
import type { RatingSummaryData } from '../hooks/use-my-rating';

/** Điểm trung bình lớn + biểu đồ phân bố 5→1 sao + số lượt vote. */
export function RatingSummary({ summary }: { summary: RatingSummaryData }) {
  const t = useTranslations('rating');
  const enough = summary.reviewCount >= MIN_VOTES_TO_SHOW_RATING;
  const max = Math.max(1, ...summary.ratingDistribution);
  return (
    <>
      <div className="mt-2 flex items-center gap-5">
        <div className="text-center">
          <p className="font-display text-5xl font-semibold leading-none">{enough ? summary.ratingAvg.toFixed(1) : '—'}</p>
          <div className="mt-2 flex justify-center gap-0.5 text-accent">
            {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`size-3.5 ${enough && summary.ratingAvg >= s - 0.25 ? 'fill-current' : ''}`} />)}
          </div>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((s) => (
            <div key={s} className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="w-3">{s}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-accent" style={{ width: `${(summary.ratingDistribution[s - 1]! / max) * 100}%` }} />
              </div>
              <span className="w-6 text-right">{summary.ratingDistribution[s - 1]}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {enough ? t('basedOn', { count: summary.reviewCount }) : t('tooFew', { min: MIN_VOTES_TO_SHOW_RATING })}
      </p>
    </>
  );
}
