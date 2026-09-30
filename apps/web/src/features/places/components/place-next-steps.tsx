import { getTranslations } from 'next-intl/server';
import { ArrowRight, CalendarRange } from 'lucide-react';
import type { PlaceDetail, PlaceSummary } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { serverApi, safe } from '@/lib/api';
import { DestinationServices } from '@/features/connect/components/destination-services';
import { PlaceNearbyMap } from './place-nearby-map';

/**
 * "Bước tiếp theo" trên trang địa điểm (BR-CONN-08) – chuỗi cốt lõi của TravelPad:
 * lên lịch trình cho điểm đến → bản đồ + địa điểm gần đây → dịch vụ tại điểm đến (chia nhóm, kèm đánh giá).
 */
export async function PlaceNextSteps({ place }: { place: PlaceDetail }) {
  const t = await getTranslations('next');
  const dest = place.parent ?? (place.kind === 'destination' ? { id: place.id, slug: place.slug, name: place.name } : null);
  if (!dest) return null;
  const siblings = await safe(serverApi.places.list({ parentId: dest.id, kind: 'spot', sort: 'rating', limit: 30 }), { items: [] as PlaceSummary[], nextCursor: null });
  const others = siblings.items.filter((s) => s.id !== place.id);

  return (
    <>
      <Link href={`/itinerary?destination=${dest.slug}&days=2`} className="group flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-editorial transition hover:border-primary/40">
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"><CalendarRange className="size-6" /></span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-xl font-medium">{t('planTitle', { name: dest.name })}</span>
          <span className="block text-sm text-muted-foreground">{t('planLead')}</span>
        </span>
        <ArrowRight className="size-5 shrink-0 text-primary transition group-hover:translate-x-1" />
      </Link>
      <PlaceNearbyMap place={place} others={others} title={t('nearbyTitle', { name: place.name })} />
      <DestinationServices id="services" destination={dest} title={t('servicesAt', { name: dest.name })} />
    </>
  );
}
