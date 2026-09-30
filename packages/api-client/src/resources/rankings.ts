import type {
  CreatorRankingBy, CreatorRankingItem, PlaceRankingItem, ProviderGroup, ProviderRankingItem, Ranking,
} from '@travelpad/contracts';
import type { Request } from '../http.js';

export const rankingsResource = (request: Request) => ({
  places: (limit = 5) => request<Ranking<PlaceRankingItem>>('GET', '/rankings/places', undefined, { limit }),
  providers: (group?: ProviderGroup, limit = 5) => request<Ranking<ProviderRankingItem>>('GET', '/rankings/providers', undefined, { group, limit }),
  creators: (by: CreatorRankingBy, limit = 5) => request<Ranking<CreatorRankingItem>>('GET', '/rankings/creators', undefined, { by, limit }),
});
