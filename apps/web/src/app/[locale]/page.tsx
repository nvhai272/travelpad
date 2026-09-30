import { setRequestLocale } from 'next-intl/server';
import { loadHomeData } from '@/features/home/load-home-data';
import { AboutSection } from '@/features/home/components/about-section';
import { SeasonPicks } from '@/features/home/components/season-picks';
import { SuggestedPlaces } from '@/features/home/components/suggested-places';
import { currentMonthVn } from '@/features/home/season';

/**
 * Trang chủ (BR-HOME-03) – giới thiệu rồi gợi ý; tìm kiếm, lịch trình, dịch vụ, văn hóa nằm ở "Khám phá Việt Nam":
 *  1. Giới thiệu TravelPad  2. Những nơi nên đến ở Việt Nam  3. Đang vào mùa đẹp (tháng này nên đi đâu)
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  const data = await loadHomeData();

  return (
    <div className="space-y-9 sm:space-y-12">
      <AboutSection />
      <SuggestedPlaces spots={data.spots} destinations={data.destinations} />
      <SeasonPicks destinations={data.destinations} spots={data.spots} month={currentMonthVn()} />
    </div>
  );
}
