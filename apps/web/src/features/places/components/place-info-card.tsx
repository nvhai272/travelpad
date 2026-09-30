import { getTranslations } from 'next-intl/server';
import { CalendarDays, MapPin } from 'lucide-react';
import type { PlaceDetail } from '@travelpad/contracts';

/** Thông tin nhanh: tỉnh/vùng, mùa đẹp nhất, loại, mức giá. */
export async function PlaceInfoCard({ place }: { place: PlaceDetail }) {
  const t = await getTranslations();
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-editorial">
      <dl className="space-y-3 text-sm">
        <div className="flex items-center gap-2"><MapPin className="size-4 text-primary" /> {place.province} · {t(`region.${place.region}`)}</div>
        {place.bestSeason && (
          <div className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" /> {t('map.bestSeason')}: {place.bestSeason}</div>
        )}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs">{t(`category.${place.category}`)}</span>
          {place.priceLevel && <span className="rounded-full bg-secondary px-3 py-1 text-xs">{t(`price.${place.priceLevel}`)}</span>}
        </div>
      </dl>
    </section>
  );
}
