'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { PlaceSummary } from '@travelpad/contracts';
import { colors } from '@travelpad/design-tokens';
import { Link, useRouter } from '@/i18n/routing';
import { RatingPill } from '@/components/ui/rating-pill';
import { RouteMapLazy } from '@/features/map/components/route-map-lazy';
import type { MapStop } from '@/features/map/components/route-map';
import { distanceKm, formatKm } from '@/features/map/geo/distance';

type Props = { place: PlaceSummary; others: PlaceSummary[]; title: string };

/** Bản đồ địa điểm + các địa điểm lân cận xếp theo khoảng cách (đường chim bay); chạm ghim → mở địa điểm đó. */
export function PlaceNearbyMap({ place, others, title }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(place.id);
  const near = useMemo(() => others
    .map((p) => ({ p, km: distanceKm(place.location, p.location) }))
    .sort((a, b) => a.km - b.km).slice(0, 6), [place, others]);
  const stops = useMemo<MapStop[]>(() => [
    { id: place.id, lat: place.location.lat, lng: place.location.lng, label: '★', title: place.name, color: colors.accent },
    ...near.map(({ p }, i) => ({ id: p.id, lat: p.location.lat, lng: p.location.lng, label: String(i + 1), title: p.name, color: colors.primary })),
  ], [place, near]);
  const open = (id: string) => { const p = others.find((o) => o.id === id); if (p) router.push(`/places/${p.slug}`); else setActiveId(id); };

  return (
    <section id="nearby" className="scroll-mt-24 rounded-2xl border border-border bg-card p-4 shadow-editorial sm:p-5">
      <h2 className="font-display text-2xl font-medium">{title}</h2>
      <p className="mt-0.5 text-xs text-muted-foreground">{t('next.nearbyLead')}</p>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <RouteMapLazy stops={stops} activeId={activeId} onSelect={open} className="h-64 md:h-full md:min-h-72" />
        <ol className="divide-y divide-border">
          <li className="flex items-center gap-3 py-2">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent text-[11px] font-bold text-white">★</span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">{place.name}</span>
            <span className="text-xs text-muted-foreground">{t('next.here')}</span>
          </li>
          {near.map(({ p, km }, i) => (
            <li key={p.id}>
              <Link href={`/places/${p.slug}`} onMouseEnter={() => setActiveId(p.id)} onFocus={() => setActiveId(p.id)} className="flex items-center gap-3 py-2 hover:text-primary">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-white">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{p.name}</span>
                  <span className="text-[11px] text-muted-foreground">{t(`category.${p.category}`)} · {t('next.kmAway', { km: formatKm(km, locale) })}</span>
                </span>
                <RatingPill avg={p.ratingAvg} votes={p.reviewCount} />
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
