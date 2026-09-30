import { getTranslations } from 'next-intl/server';
import type { ProviderGroup, ProviderRankingItem } from '@travelpad/contracts';
import { ProvidersRankingTabs } from './providers-ranking-tabs';
import { RankingFooter, RankingHeader, rankingCardClass } from './ranking-parts';

/** BR-RANK-09: dịch vụ du lịch uy tín – mỗi nhóm (lưu trú, ăn uống, di chuyển, HDV/tour) một bảng riêng. */
export async function ProvidersRanking({ byGroup }: { byGroup: Record<ProviderGroup, ProviderRankingItem[]> }) {
  const t = await getTranslations('rankings');
  return (
    <section className={rankingCardClass}>
      <RankingHeader title={t('providersTitle')} sub={t('providersSub')} />
      <ProvidersRankingTabs byGroup={byGroup} />
      <RankingFooter href="/connect" label={t('seeProviders')} />
    </section>
  );
}
