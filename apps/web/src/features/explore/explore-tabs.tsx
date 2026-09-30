import { getTranslations } from 'next-intl/server';
import { PageTabs } from '@/components/ui/page-tabs';

type ExploreTab = '/map' | '/itinerary' | '/connect' | '/culture';

/** Bốn phần của "Khám phá Việt Nam": Địa điểm · Lịch trình · Dịch vụ · Văn hóa (menu chính chỉ có một mục cho cả bốn). */
export async function ExploreTabs({ active }: { active: ExploreTab }) {
  const t = await getTranslations('nav');
  return (
    <PageTabs label={t('exploreVn')} active={active} tabs={[
      { href: '/map', label: t('placesTab') }, { href: '/itinerary', label: t('itineraryTab') },
      { href: '/connect', label: t('connectShort') }, { href: '/culture', label: t('culture') },
    ]} />
  );
}
