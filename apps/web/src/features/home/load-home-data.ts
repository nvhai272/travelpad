import type { PlaceSummary } from '@travelpad/contracts';
import { serverApi, safe } from '@/lib/api';

const emptyPlaces = { items: [] as PlaceSummary[], nextCursor: null };

/** Tải song song dữ liệu trang chủ; API lỗi thì trả rỗng, trang vẫn render. */
export async function loadHomeData() {
  const [destinations, spots] = await Promise.all([
    safe(serverApi.places.list({ kind: 'destination', sort: 'featured', limit: 20 }), emptyPlaces),
    // Địa điểm cụ thể: gợi ý nơi nên đến + top địa điểm của từng điểm đến đang vào mùa
    safe(serverApi.places.list({ kind: 'spot', sort: 'rating', limit: 50 }), emptyPlaces),
  ]);
  return { destinations: destinations.items, spots: spots.items };
}

export type HomeData = Awaited<ReturnType<typeof loadHomeData>>;
