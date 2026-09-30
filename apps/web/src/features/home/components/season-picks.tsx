import { getTranslations } from 'next-intl/server';
import { CalendarRange } from 'lucide-react';
import type { PlaceSummary } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { RatingPill } from '@/components/ui/rating-pill';
import { SectionHead } from '@/components/ui/section-head';
import { ScrollRow } from '@/components/ui/scroll-row';
import { seasonPicks } from '../season';

/** "Tháng N nên đi đâu?" – điểm đến đang vào mùa + 3 địa điểm được chấm sao cao nhất ở đó (BR-HOME-06). */
export async function SeasonPicks({ destinations, spots, month }: { destinations: PlaceSummary[]; spots: PlaceSummary[]; month: number }) {
  const t = await getTranslations();
  const picks = seasonPicks(destinations, month);
  if (!picks.length) return null;
  return (
    <section>
      <SectionHead eyebrow={t('home.seasonEyebrow')} title={t('home.seasonTitle', { month })} sub={t('home.seasonSub')} />
      <ScrollRow gridClass={`sm:grid-cols-2 ${picks.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`} itemClass="w-[80%]">
        {picks.map(({ d, soon }) => {
          const top = spots.filter((s) => s.parentId === d.id).sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 3);
          return (
            <article key={d.id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-editorial">
              <Link href={`/places/${d.slug}`} className="group relative block aspect-[4/3] overflow-hidden bg-secondary">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {d.coverUrl && <img src={d.coverUrl} alt={d.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
                <div className="bg-hero-overlay absolute inset-0" />
                <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${soon ? 'bg-card/90 text-foreground' : 'bg-accent text-accent-foreground'}`}>
                  {soon ? t('home.soon') : t('home.seasonBadge', { season: d.bestSeason ?? '' })}
                </span>
                <span className="hero-copy absolute inset-x-3 bottom-3 font-display text-2xl font-medium">{d.name}</span>
              </Link>
              <ul className="flex-1 divide-y divide-border px-4 py-1">
                {top.map((s) => (
                  <li key={s.id}>
                    <Link href={`/places/${s.slug}`} className="flex items-center gap-2 py-2 text-sm hover:text-primary">
                      <span className="min-w-0 flex-1 truncate">{s.name}</span>
                      <RatingPill avg={s.ratingAvg} votes={s.reviewCount} />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/itinerary?destination=${d.slug}&days=2`} className="m-3 mt-0 flex h-10 items-center justify-center gap-2 rounded-full bg-primary/10 text-sm font-semibold text-primary hover:bg-primary/15">
                <CalendarRange className="size-4" /> {t('home.planCta')}
              </Link>
            </article>
          );
        })}
      </ScrollRow>
    </section>
  );
}
