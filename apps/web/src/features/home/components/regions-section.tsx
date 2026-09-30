import { getTranslations } from 'next-intl/server';
import type { Region } from '@travelpad/contracts';
import { Link } from '@/i18n/routing';
import { SectionHead } from '@/components/ui/section-head';
import { PhotoCredit } from '@/components/ui/photo-credit';
import { RegionIcon } from '@/features/map/components/region-icon';

/** Ảnh địa danh tiêu biểu từng miền (ảnh thật, ghi công ở lib/photo-credits.ts). */
const REGION_PHOTOS: Record<Region, string> = {
  north: '/images/places/lm-mu-cang-chai.jpg',
  central: '/images/places/lm-hoi-an.jpg',
  highlands: '/images/places/resort-ven-ho-tuyen-lam.jpg',
  south: '/images/places/lm-cai-rang.jpg',
};

/** Khám phá theo miền: 4 thẻ ảnh lớn → trang Khám phá đã lọc sẵn theo miền. */
export async function RegionsSection() {
  const t = await getTranslations();
  return (
    <section>
      <SectionHead eyebrow={t('regions.eyebrow')} title={t('regions.title')} sub={t('regions.sub')} />
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 lg:gap-4">
        {(Object.keys(REGION_PHOTOS) as Region[]).map((r) => (
          <div key={r} className="group relative aspect-[4/5] w-[72%] shrink-0 snap-start overflow-hidden rounded-2xl shadow-editorial sm:w-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={REGION_PHOTOS[r]} alt={t(`region.${r}`)} loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="bg-hero-overlay absolute inset-0" />
            <Link href={{ pathname: '/map', query: { region: r } }} className="hero-copy absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
              <span className="mb-2 grid size-9 place-items-center rounded-full bg-white/15 backdrop-blur-sm"><RegionIcon region={r} className="size-5" /></span>
              <span className="font-display text-2xl font-medium">{t(`region.${r}`)}</span>
              <p className="mt-1 text-sm leading-5">{t(`regions.${r}`)}</p>
            </Link>
            <PhotoCredit src={REGION_PHOTOS[r]} className="absolute right-2 top-2 z-10 opacity-0 transition group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}
