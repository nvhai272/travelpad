import { getTranslations } from 'next-intl/server';
import type { PlaceRankingItem, ProviderGroup, ProviderRankingItem, Ranking } from '@travelpad/contracts';
import { SectionHead } from '@/components/ui/section-head';
import { PlacesRanking } from '@/features/rankings/components/places-ranking';
import { ProvidersRanking } from '@/features/rankings/components/providers-ranking';

/** Trang Khám phá (chưa tìm gì): nơi nên đến + dịch vụ nên chọn, đặt cạnh nhau – theo điểm sao cộng đồng (BR-RANK-01, 09). */
export async function TopRatedSection({ places, byGroup }: { places: Ranking<PlaceRankingItem> | null; byGroup: Record<ProviderGroup, ProviderRankingItem[]> }) {
  const t = await getTranslations('home');
  return (
    <section>
      <SectionHead eyebrow={t('topEyebrow')} title={t('topTitle')} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <PlacesRanking data={places} />
        <ProvidersRanking byGroup={byGroup} />
      </div>
    </section>
  );
}
