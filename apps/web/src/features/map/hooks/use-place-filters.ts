'use client';

import { useMemo, useState } from 'react';
import { MIN_VOTES_TO_SHOW_RATING, type PlaceSummary } from '@travelpad/contracts';
import { fold } from '@/lib/text';
import { activeFilterCount, EMPTY_FILTERS, REGIONS, type SearchFilters } from '../filters';

type Input = { spots: PlaceSummary[]; destinations: PlaceSummary[]; mineIds: string[]; mode: 'hot' | 'mine'; initialQuery: string; initialRegion?: string };

/**
 * Trạng thái & kết quả lọc địa điểm trên trang Khám phá (BR-MAP-06): áp dụng ngay, không cần nút "Xem kết quả".
 * Lọc phía client vì dữ liệu nhỏ; khi > vài trăm địa điểm chuyển sang GET /places với cùng bộ lọc (TL-204).
 */
export function usePlaceFilters({ spots, destinations, mineIds, mode, initialQuery, initialRegion }: Input) {
  const [query, setQuery] = useState(initialQuery);
  // ?region= từ mục "Khám phá theo miền" trên trang chủ
  const region = REGIONS.find((r) => r === initialRegion) ?? 'all';
  const [filters, setFilters] = useState<SearchFilters>({ ...EMPTY_FILTERS, region });
  const [destinationId, setDestinationId] = useState<string | null>(null);

  const destinationById = useMemo(() => new Map(destinations.map((d) => [d.id, d])), [destinations]);

  const results = useMemo(() => {
    const needle = fold(query);
    const f = filters;
    return spots
      .filter((s) => !destinationId || s.parentId === destinationId)
      .filter((s) => mode === 'hot' || mineIds.includes(s.parentId ?? ''))
      .filter((s) => f.region === 'all' || s.region === f.region)
      .filter((s) => f.category === 'all' || s.category === f.category)
      .filter((s) => !f.price || s.priceLevel === f.price)
      .filter((s) => !f.minRating || (s.reviewCount >= MIN_VOTES_TO_SHOW_RATING && s.ratingAvg >= f.minRating))
      .filter((s) => !needle || fold(`${s.name} ${s.province} ${destinationById.get(s.parentId ?? '')?.name ?? ''}`).includes(needle))
      .sort((a, b) => b.reviewCount - a.reviewCount || b.ratingAvg - a.ratingAvg);
  }, [spots, destinationId, mode, mineIds, filters, query, destinationById]);

  return {
    query, setQuery, filters, setFilters, destinationId, destinationById, results,
    toggleDestination: (id: string | null) => setDestinationId((cur) => (id === cur ? null : id)),
    activeCount: activeFilterCount(filters) + Number(!!destinationId) + Number(!!query.trim()),
    reset: () => { setFilters(EMPTY_FILTERS); setDestinationId(null); setQuery(''); },
  };
}
