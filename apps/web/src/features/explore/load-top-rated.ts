import { ProviderGroupSchema, type ProviderGroup, type ProviderRankingItem, type ProviderSummary } from '@travelpad/contracts';
import { serverApi, safe } from '@/lib/api';

/** BXH cho trang Khám phá: top 5 địa điểm + dịch vụ uy tín theo nhóm + toàn bộ nhà cung cấp (để gợi ý theo điểm đến khi tìm). */
export async function loadTopRated() {
  const [places, groups, providers] = await Promise.all([
    safe(serverApi.rankings.places(5), null),
    Promise.all(ProviderGroupSchema.options.map((g) => safe(serverApi.rankings.providers(g, 5), { items: [] as ProviderRankingItem[] }))),
    // Danh bạ còn nhỏ (<50) nên tải một lần rồi lọc theo điểm đến phía client; lớn hơn → gọi theo điểm đến (TL-204)
    safe(serverApi.providers.list({ limit: 50 }), { items: [] as ProviderSummary[] }),
  ]);
  const byGroup = Object.fromEntries(ProviderGroupSchema.options.map((g, i) => [g, groups[i]!.items])) as Record<ProviderGroup, ProviderRankingItem[]>;
  return { places, byGroup, providers: providers.items };
}
