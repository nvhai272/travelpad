import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PlaceQuerySchema, type PlaceSummary } from '@travelpad/contracts';
import { serverApi, safe } from '@/lib/api';
import { PlaceCard } from '@/features/places/components/place-card';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'home' });
  return { title: t('featuredPlaces'), alternates: { canonical: '/places' } };
}

// TODO(TL-204/205): bộ lọc hiển thị ngay trên trang (sheet mobile), infinite scroll, trang landing theo vùng/loại
export default async function PlacesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const sp = await searchParams;
  const query = PlaceQuerySchema.parse({ ...sp, kind: 'spot', sort: 'rating', limit: 50 });

  const empty = { items: [] as PlaceSummary[], nextCursor: null };
  const [results, destinations] = await Promise.all([
    safe(serverApi.places.list(query), empty),
    safe(serverApi.places.list({ kind: 'destination', limit: 50 }), empty),
  ]);
  const destName = new Map(destinations.items.map((d) => [d.id, d.name]));

  return (
    <section>
      <p className="eyebrow">{t('nav.explore')}</p>
      <h1 className="font-display text-3xl font-medium sm:text-4xl">{sp.q ? `“${sp.q}”` : t('home.featuredPlaces')}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t('search.results', { count: results.items.length })}</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.items.map((p) => (
          <PlaceCard key={p.id} place={p} regionLabel={destName.get(p.parentId ?? '') ?? p.province}
            reviewsLabel={t('place.votes', { count: p.reviewCount })} newLabel={t('place.new')} />
        ))}
      </div>
      {results.items.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">{t('search.noResults', { q: sp.q ?? '' })}</p>
      )}
    </section>
  );
}
