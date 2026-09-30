import { getTranslations } from 'next-intl/server';
import type { PlaceRankingItem, Ranking } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { RatingPill } from '@/components/ui/rating-pill';
import { RankBadge, RankingFooter, RankingHeader, rankingCardClass } from './ranking-parts';

/** BR-RANK-01: Top 5 địa điểm – theo tổng số người vote sao. */
export async function PlacesRanking({ data }: { data: Ranking<PlaceRankingItem> | null }) {
  const t = await getTranslations();
  return (
    <section className={rankingCardClass}>
      <RankingHeader eyebrow={t('rankings.placesEyebrow')} title={t('rankings.placesTitle')} sub={t('rankings.placesSub')} />
      <ol className="mt-4 flex flex-1 flex-col justify-between gap-3">
        {data?.items.map((it) => (
          <li key={it.place.id}>
            <Link href={`/places/${it.place.slug}`} className="flex items-center gap-3 rounded-xl p-1 transition hover:bg-secondary/60">
              <RankBadge rank={it.rank} />
              {it.place.coverUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.place.coverUrl} alt="" loading="lazy" className="size-12 rounded-lg object-cover" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{it.place.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {it.destinationName ?? it.place.province} · <span className="font-semibold text-foreground">{t('rankings.voters', { count: it.votes })}</span>
                </p>
              </div>
              <RatingPill avg={it.place.ratingAvg} votes={it.votes} />
            </Link>
          </li>
        ))}
      </ol>
      {!data?.items.length && <p className="mt-4 text-sm text-muted-foreground">{t('rankings.empty')}</p>}
      <RankingFooter href="/map" label={t('rankings.seePlaces')} />
    </section>
  );
}
