import { getTranslations } from 'next-intl/server';
import { PROVIDER_GROUPS, ProviderGroupSchema, type ProviderGroup, type ProviderRankingItem, type ProviderSummary } from '@travelpad/contracts';
import { serverApi, safe } from '@/lib/api';
import { ProvidersRankingTabs } from '@/features/rankings/components/providers-ranking-tabs';
import { RankingFooter, RankingHeader } from '@/features/rankings/components/ranking-parts';

/**
 * Dịch vụ tại một điểm đến, chia 4 nhóm (lưu trú · ăn uống · di chuyển · hướng dẫn viên/tour), mỗi nhóm top 5 theo sao.
 * Dùng ở trang địa điểm và trang lịch trình – để người lên kế hoạch thấy ngay chỗ ở, quán ăn, xe, HDV kèm đánh giá.
 */
export async function DestinationServices({ destination, title, id }: { destination: { slug: string; name: string }; title: string; id?: string }) {
  const t = await getTranslations();
  const { items } = await safe(serverApi.providers.list({ destination: destination.slug, limit: 50 }), { items: [] as ProviderSummary[] });
  if (!items.length) return null;
  const ranked = [...items].sort((a, b) => b.ratingAvg - a.ratingAvg || b.reviewCount - a.reviewCount);
  const byGroup = Object.fromEntries(ProviderGroupSchema.options.map((g) => [
    g, ranked.filter((p) => PROVIDER_GROUPS[g].includes(p.type)).slice(0, 5).map((p, i) => ({ rank: i + 1, provider: p, votes: p.reviewCount })),
  ])) as Record<ProviderGroup, ProviderRankingItem[]>;
  const first = ProviderGroupSchema.options.find((g) => byGroup[g].length > 0) ?? 'stay';
  return (
    <section id={id} className="flex scroll-mt-24 flex-col rounded-2xl border border-border bg-card p-5 shadow-editorial">
      <RankingHeader title={title} sub={t('rankings.providersSub')} />
      <ProvidersRankingTabs byGroup={byGroup} initialGroup={first} emptyLabel={t('connect.emptyGroup')} />
      <RankingFooter href={`/connect?destination=${destination.slug}`} label={t('next.connectCta', { name: destination.name })} />
    </section>
  );
}
