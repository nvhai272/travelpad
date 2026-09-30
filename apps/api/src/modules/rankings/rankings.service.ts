import { Injectable } from '@nestjs/common';
import {
  MIN_VOTES_TO_SHOW_RATING, PROVIDER_GROUPS, type PlaceRankingItem, type ProviderGroup, type ProviderRankingItem, type Ranking,
} from '@travelpad/contracts';
import { MemoryCache } from '../../common/cache/memory-cache.js';
import { providerInclude, toPlaceSummary, toProviderSummary } from '../../common/mappers/index.js';
import { PrismaService } from '../../prisma/prisma.service.js';

export const RANKING_CACHE_TTL_MS = 60_000;

/**
 * BXH theo vote sao (toàn thời gian – docs/business-rules.md §7): địa điểm & dịch vụ du lịch.
 * BXH người đóng góp nằm ở CreatorRankingsService.
 */
@Injectable()
export class RankingsService {
  constructor(private readonly prisma: PrismaService, private readonly cache: MemoryCache) {}

  /** BR-RANK-01/02: địa điểm con có ≥ 3 vote, xếp theo số người vote rồi sao trung bình. */
  mostVotedPlaces(limit: number): Promise<Ranking<PlaceRankingItem>> {
    return this.cache.getOrSet(`rank:places:${limit}`, RANKING_CACHE_TTL_MS, async () => {
      const places = await this.prisma.place.findMany({
        where: { kind: 'spot', reviewCount: { gte: MIN_VOTES_TO_SHOW_RATING } },
        orderBy: [{ reviewCount: 'desc' }, { ratingAvg: 'desc' }, { name: 'asc' }],
        take: limit,
        include: { parent: { select: { name: true } } },
      });
      return {
        items: places.map((p, i) => ({
          rank: i + 1, place: toPlaceSummary(p), destinationName: p.parent?.name ?? null, votes: p.reviewCount,
        })),
      };
    });
  }

  /** BR-RANK-09: dịch vụ du lịch uy tín theo nhóm – đang hoạt động, ≥ 3 vote, theo số người vote rồi sao TB. */
  trustedProviders(limit: number, group?: ProviderGroup): Promise<Ranking<ProviderRankingItem>> {
    return this.cache.getOrSet(`rank:providers:${group ?? 'all'}:${limit}`, RANKING_CACHE_TTL_MS, async () => {
      const rows = await this.prisma.serviceProvider.findMany({
        where: {
          status: 'active', reviewCount: { gte: MIN_VOTES_TO_SHOW_RATING },
          ...(group ? { type: { in: PROVIDER_GROUPS[group] } } : {}),
        },
        orderBy: [{ reviewCount: 'desc' }, { ratingAvg: 'desc' }, { name: 'asc' }],
        take: limit,
        include: providerInclude,
      });
      return { items: rows.map((p, i) => ({ rank: i + 1, provider: toProviderSummary(p), votes: p.reviewCount })) };
    });
  }
}
