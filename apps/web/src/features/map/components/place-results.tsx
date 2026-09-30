'use client';

import { useTranslations } from 'next-intl';
import type { PlaceSummary } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { RatingPill } from '@/components/ui/rating-pill';
import { CATEGORY_EMOJI } from '../filters';

type Props = { results: PlaceSummary[]; destinationById: Map<string, PlaceSummary>; onReset: () => void };

/** Danh sách kết quả địa điểm (xếp theo số người vote rồi sao TB). */
export function PlaceResults({ results, destinationById, onReset }: Props) {
  const t = useTranslations();
  if (results.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        {t('map.empty')} <button onClick={onReset} className="font-semibold text-primary">{t('search.reset')}</button>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {results.map((s) => (
        <li key={s.id}>
          <Link href={`/places/${s.slug}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-editorial transition hover:border-primary/40">
            {s.coverUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.coverUrl} alt="" loading="lazy" className="size-16 rounded-xl object-cover" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg font-medium">{s.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {destinationById.get(s.parentId ?? '')?.name ?? s.province} · {CATEGORY_EMOJI[s.category]} {t(`category.${s.category}`)} · {'₫'.repeat(s.priceLevel ?? 1)}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{t('rankings.voters', { count: s.reviewCount })}</p>
            </div>
            <RatingPill avg={s.ratingAvg} votes={s.reviewCount} newLabel={t('place.new')} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
