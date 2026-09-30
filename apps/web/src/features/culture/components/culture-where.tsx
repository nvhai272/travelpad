import { getTranslations } from 'next-intl/server';
import { ArrowRight, MapPin } from 'lucide-react';
import type { PlaceSummary } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { RatingPill } from '@/components/ui/rating-pill';
import type { CultureTopic } from '../culture-topics';

/** "Trải nghiệm ở đâu": địa điểm liên quan (có thật trong dữ liệu) + nút đi tiếp sang điểm đến hoặc cả miền. */
export async function CultureWhere({ topic, places, destination }: { topic: CultureTopic; places: PlaceSummary[]; destination?: PlaceSummary }) {
  const t = await getTranslations();
  const cta = destination
    ? { href: `/places/${destination.slug}`, label: t('culture.exploreDest', { name: destination.name }) }
    : topic.region ? { href: `/map?region=${topic.region}`, label: t('culture.exploreRegion', { region: t(`region.${topic.region}`) }) } : null;
  if (!places.length && !cta) return null;
  return (
    <aside className="rounded-2xl border border-border bg-card p-4 shadow-editorial sm:p-5">
      <h2 className="flex items-center gap-2 font-display text-xl font-medium"><MapPin className="size-5 text-accent" /> {t('culture.whereTitle')}</h2>
      {places.length > 0 && (
        <ul className="mt-3 divide-y divide-border">
          {places.map((p) => (
            <li key={p.id}>
              <Link href={`/places/${p.slug}`} className="flex items-center gap-3 py-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.coverUrl && <img src={p.coverUrl} alt="" loading="lazy" className="size-12 shrink-0 rounded-lg object-cover" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{p.province}</span>
                </span>
                <RatingPill avg={p.ratingAvg} votes={p.reviewCount} newLabel={t('place.new')} />
              </Link>
            </li>
          ))}
        </ul>
      )}
      {cta && (
        <Link href={cta.href} className="mt-3 flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground">
          {cta.label} <ArrowRight className="size-4" />
        </Link>
      )}
    </aside>
  );
}
