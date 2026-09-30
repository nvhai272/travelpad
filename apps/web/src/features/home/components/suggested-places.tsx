import { getTranslations } from 'next-intl/server';
import { MapPin } from 'lucide-react';
import type { PlaceSummary } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { SectionHead } from '@/components/ui/section-head';
import { ScrollRow } from '@/components/ui/scroll-row';

/**
 * "Những nơi nên đến ở Việt Nam": điểm đến cấp tỉnh, thành (không có điểm sao – BR-PLACE-06), xếp theo độ phổ biến
 * (tổng lượt đánh giá của các địa điểm bên trong). Mỗi thẻ gợi ý 2 địa điểm cụ thể nổi bật nhất bên trong.
 */
export async function SuggestedPlaces({ spots, destinations }: { spots: PlaceSummary[]; destinations: PlaceSummary[] }) {
  const t = await getTranslations();
  const inside = (id: string) => spots.filter((s) => s.parentId === id).sort((a, b) => b.reviewCount - a.reviewCount);
  const picks = [...destinations].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 8);
  if (!picks.length) return null;
  return (
    <section>
      <SectionHead eyebrow={t('home.suggestEyebrow')} title={t('home.suggestTitle')} sub={t('home.suggestSub')} href="/map" cta={t('home.seeAllPlaces')} />
      <ScrollRow gridClass="sm:grid-cols-2 lg:grid-cols-4" itemClass="w-[72%]">
        {picks.map((d) => {
          const all = inside(d.id);
          return (
            <Link key={d.id} href={`/places/${d.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-secondary shadow-editorial">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {d.coverUrl && <img src={d.coverUrl} alt={d.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
              <div className="bg-hero-overlay absolute inset-0" />
              <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">{t(`region.${d.region}`)}</span>
              <div className="hero-copy absolute inset-x-0 bottom-0 p-4">
                <p className="font-display text-3xl font-medium leading-tight">{d.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs"><MapPin className="size-3.5" /> {d.province} · {t('home.spotCount', { count: all.length })}</p>
                {all.length > 0 && <p className="mt-2 line-clamp-1 text-sm">{all.slice(0, 2).map((s) => s.name).join(' · ')}</p>}
              </div>
            </Link>
          );
        })}
      </ScrollRow>
    </section>
  );
}
