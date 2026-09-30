'use client';

import { useTranslations } from 'next-intl';
import { useMyRating, type RatingKind, type RatingSummaryData } from '../hooks/use-my-rating';
import { RatingSummary } from './rating-summary';
import { ReviewCommentForm } from './review-comment-form';
import { StarInput } from './star-input';

/** Thẻ "Đánh giá của cộng đồng" + vote của tôi – dùng cho địa điểm và nhà cung cấp. Chấm sao là lưu ngay. */
export function StarVote({ kind, targetId, initial }: { kind: RatingKind; targetId: string; initial: RatingSummaryData }) {
  const t = useTranslations('rating');
  const r = useMyRating(kind, targetId, initial);
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-editorial">
      <p className="eyebrow">{t('title')}</p>
      <RatingSummary summary={r.summary} />
      <div className="mt-5 border-t border-border pt-4">
        <p className="text-sm font-semibold">{t('yours')}</p>
        <StarInput value={r.mine?.rating ?? 0} onPick={(star) => r.rate(star, r.mine?.content)} />
        {r.mine && (
          <ReviewCommentForm initial={r.mine.content} saving={r.status === 'saving'}
            onSubmit={(content) => r.rate(r.mine!.rating, content)} onRemove={r.remove} onEdit={r.markDirty} />
        )}
        {r.status === 'saved' && <p className="mt-2 text-xs font-semibold text-primary">{t('thanks')}</p>}
        {r.error && <p className="mt-2 text-xs text-destructive">{r.error}</p>}
      </div>
    </section>
  );
}
