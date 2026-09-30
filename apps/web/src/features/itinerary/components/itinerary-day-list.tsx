'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { Itinerary } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { RatingPill } from '@/components/ui/rating-pill';
import { distanceKm, formatKm } from '@/features/map/geo/distance';

type Day = Itinerary['days'][number];
type Props = { day: Day; color: string; destination: string; activeId: string | null; onActive: (id: string | null) => void };

/**
 * Một ngày: 4 buổi Sáng → Tối, điểm có số khớp ghim trên bản đồ, giữa hai điểm ghi khoảng cách (đường chim bay).
 * Rê/chạm vào điểm → ghim tương ứng nổi lên trên bản đồ.
 */
export function ItineraryDayList({ day, color, destination, activeId, onActive }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  let n = 0;
  let prev: Day['slots'][number]['place'] = null;
  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-editorial sm:p-5">
      <p className="eyebrow flex items-center gap-2" style={{ color }}><span className="size-2.5 rounded-full" style={{ background: color }} />{t('itinerary.dayN', { n: day.day })}</p>
      <ol className="mt-2 space-y-1">
        {day.slots.map(({ slot, place }) => {
          const gap = place && prev ? distanceKm(prev.location, place.location) : null;
          if (place) { n += 1; prev = place; }
          return (
            <li key={slot}>
              {gap !== null && (
                <p className="ml-[4.25rem] border-l-2 border-dashed py-1 pl-3 text-[11px] text-muted-foreground" style={{ borderColor: color }} title={t('itinerary.kmHint')}>
                  {t('itinerary.km', { km: formatKm(gap, locale) })}
                </p>
              )}
              <div className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-[11px] font-bold uppercase tracking-wide text-accent">{t(`itinerary.${slot}`)}</span>
                {place ? (
                  <Link href={`/places/${place.slug}`} onMouseEnter={() => onActive(place.id)} onFocus={() => onActive(place.id)}
                    className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1.5 transition ${activeId === place.id ? 'bg-secondary' : 'hover:bg-secondary/60'}`}>
                    <span className="grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white" style={{ background: color }}>{n}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {place.coverUrl && <img src={place.coverUrl} alt="" loading="lazy" className="size-11 rounded-lg object-cover" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{place.name}</span>
                      <span className="text-[11px] text-muted-foreground">{t(`category.${place.category}`)}</span>
                    </span>
                    <RatingPill avg={place.ratingAvg} votes={place.reviewCount} />
                  </Link>
                ) : (
                  <span className="flex flex-1 items-center justify-between gap-2 rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
                    {t('itinerary.free')}
                    <Link href={`/map?q=${encodeURIComponent(destination)}`} className="shrink-0 text-xs font-semibold text-primary">{t('next.findMore', { name: destination })}</Link>
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
