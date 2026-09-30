import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { PlaceSummary } from '@travelpad/contracts';
import { serverApi, safe } from '@/lib/api';
import { MapExplorer } from '@/features/map/components/map-explorer';
import { ExploreTabs } from '@/features/explore/explore-tabs';
import { TopRatedSection } from '@/features/explore/top-rated-section';
import { loadTopRated } from '@/features/explore/load-top-rated';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string; region?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'map' });
  return { title: t('title'), description: t('lead'), alternates: { canonical: '/map' } };
}

/** Khám phá du lịch › Địa điểm: tìm & gợi ý địa điểm theo tỉnh/thành, lọc khu vực/loại/giá/sao (BR-MAP). */
export default async function MapPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('map');
  const { q, region } = await searchParams;
  const empty = { items: [] as PlaceSummary[], nextCursor: null };
  const [destinations, spots, top] = await Promise.all([
    safe(serverApi.places.list({ kind: 'destination', sort: 'featured', limit: 50 }), empty),
    safe(serverApi.places.list({ kind: 'spot', sort: 'rating', limit: 50 }), empty),
    loadTopRated(),
  ]);

  return (
    <>
      <ExploreTabs active="/map" />
      <div className="mb-4 lg:mb-5">
        <h1 className="font-display text-3xl font-medium sm:text-5xl">{t('title')}</h1>
        <p className="mt-1 hidden max-w-2xl text-sm text-muted-foreground sm:block">{t('lead')}</p>
      </div>
      <MapExplorer destinations={destinations.items} spots={spots.items} providers={top.providers} initialQuery={q ?? ''} initialRegion={region}
        overview={<TopRatedSection places={top.places} byGroup={top.byGroup} />} />
    </>
  );
}
