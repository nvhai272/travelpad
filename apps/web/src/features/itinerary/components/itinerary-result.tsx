import { getTranslations } from 'next-intl/server';
import type { Itinerary } from '@travelpad/contracts';
import { DestinationServices } from '@/features/connect/components/destination-services';
import { ItineraryView } from './itinerary-view';

/** Kết quả gợi ý lịch trình: danh sách theo ngày + bản đồ lịch trình, rồi dịch vụ tại điểm đến (chỗ ở, ăn uống, xe, HDV). */
export async function ItineraryResult({ itinerary }: { itinerary: Itinerary }) {
  const t = await getTranslations('itinerary');
  const dest = itinerary.destination;
  const stops = new Set(itinerary.days.flatMap((d) => d.slots.flatMap((s) => (s.place ? [s.place.id] : [])))).size;
  return (
    <section className="mt-8 space-y-8">
      <div>
        <h2 className="font-display text-3xl font-medium">{t('resultTitle', { days: itinerary.days.length, name: dest.name })}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('stops', { count: stops })}</p>
      </div>
      <ItineraryView itinerary={itinerary} />
      <DestinationServices destination={dest} title={t('servicesTitle', { name: dest.name })} />
      {/* TODO(TL-506): nút "Lưu thành hành trình" (requireAuth) */}
    </section>
  );
}
