import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ItineraryQuerySchema, type Itinerary, type PlaceSummary } from '@travelpad/contracts';
import { serverApi, safe } from '@/lib/api';
import { ItineraryPlanner } from '@/features/itinerary/components/itinerary-planner';
import { ItineraryResult } from '@/features/itinerary/components/itinerary-result';
import { ExploreTabs } from '@/features/explore/explore-tabs';

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ destination?: string; days?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const t = await getTranslations({ locale: (await params).locale, namespace: 'itinerary' });
  const sp = await searchParams;
  return { title: t('title'), description: t('lead'), alternates: { canonical: sp.destination ? `/itinerary?destination=${sp.destination}` : '/itinerary' } };
}

/** Lịch trình (BR-ITIN-01..04): chọn điểm đến + số ngày → lịch theo buổi, bản đồ lịch trình, dịch vụ tại điểm đến. Khách dùng được. */
export default async function ItineraryPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const sp = await searchParams;
  const q = ItineraryQuerySchema.safeParse({ destination: sp.destination, days: sp.days ?? 2 });

  const [destinations, itinerary] = await Promise.all([
    safe(serverApi.places.list({ kind: 'destination', sort: 'featured', limit: 50 }), { items: [] as PlaceSummary[], nextCursor: null }),
    q.success ? safe<Itinerary | null>(serverApi.itineraries.suggest(q.data.destination, q.data.days), null) : Promise.resolve(null),
  ]);

  return (
    <div>
      <ExploreTabs active="/itinerary" />
      <h1 className="font-display text-3xl font-medium sm:text-5xl">{t('itinerary.title')}</h1>
      <p className={`mt-2 max-w-2xl text-sm leading-6 text-muted-foreground ${itinerary ? 'hidden sm:block' : ''}`}>{t('itinerary.lead')}</p>
      <div className="mt-4 max-w-4xl sm:mt-6">
        <ItineraryPlanner destinations={destinations.items} destination={q.success ? q.data.destination : undefined} days={q.success ? q.data.days : 2} />
      </div>
      {itinerary ? (
        <ItineraryResult itinerary={itinerary} />
      ) : (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          {q.success ? t('itinerary.notFound') : t('itinerary.empty')}
        </p>
      )}
    </div>
  );
}
