'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, CalendarRange } from 'lucide-react';
import { PROVIDER_GROUPS, ProviderGroupSchema, type PlaceSummary, type ProviderGroup, type ProviderRankingItem, type ProviderSummary } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { RatingPill } from '@/components/ui/rating-pill';
import { ProvidersRankingTabs } from '@/features/rankings/components/providers-ranking-tabs';

type Props = { dest: PlaceSummary; spots: PlaceSummary[]; providers: ProviderSummary[] };

/**
 * Khi người dùng tìm một điểm đến (hoặc chọn ghim): gợi ý ngay tại chỗ – điểm sao & mùa đẹp của điểm đến,
 * nơi nên đến (top 3 theo số người đánh giá), dịch vụ được chấm sao cao theo nhóm, nút lên lịch trình.
 */
export function DestinationInsight({ dest, spots, providers }: Props) {
  const t = useTranslations();
  const top = spots.filter((s) => s.parentId === dest.id).sort((a, b) => b.reviewCount - a.reviewCount || b.ratingAvg - a.ratingAvg).slice(0, 3);
  const here = providers.filter((p) => p.destination.slug === dest.slug).sort((a, b) => b.ratingAvg - a.ratingAvg || b.reviewCount - a.reviewCount);
  const byGroup = Object.fromEntries(ProviderGroupSchema.options.map((g) => [
    g, here.filter((p) => PROVIDER_GROUPS[g].includes(p.type)).slice(0, 3).map((p, i) => ({ rank: i + 1, provider: p, votes: p.reviewCount })),
  ])) as Record<ProviderGroup, ProviderRankingItem[]>;
  const first = ProviderGroupSchema.options.find((g) => byGroup[g].length > 0);

  return (
    <section className="space-y-4 rounded-2xl border border-primary/25 bg-card p-4 shadow-editorial lg:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-medium">{t('map.insightTitle', { name: dest.name })}</h2>
          {dest.bestSeason && <p className="text-xs text-muted-foreground">{t('map.season', { season: dest.bestSeason })}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <Link href={`/itinerary?destination=${dest.slug}&days=2`} className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          <CalendarRange className="size-4" /> {t('home.planCta')}
        </Link>
        <Link href={`/places/${dest.slug}`} className="flex h-10 items-center gap-1 rounded-full border border-border px-4 text-sm font-semibold">
          {t('home.seeDest', { name: dest.name })} <ArrowRight className="size-4" />
        </Link>
      </div>
      {top.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-accent">{t('map.topPlaces')}</p>
          <ul className="mt-1 divide-y divide-border">
            {top.map((s) => (
              <li key={s.id}>
                <Link href={`/places/${s.slug}`} className="flex items-center gap-3 py-2 hover:text-primary">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {s.coverUrl && <img src={s.coverUrl} alt="" loading="lazy" className="size-10 rounded-lg object-cover" />}
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">{s.name}</span>
                  <RatingPill avg={s.ratingAvg} votes={s.reviewCount} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {first && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-accent">{t('map.topServices')}</p>
          <ProvidersRankingTabs byGroup={byGroup} initialGroup={first} emptyLabel={t('connect.emptyGroup')} />
          <Link href={`/connect?destination=${dest.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
            {t('next.connectCta', { name: dest.name })} <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
