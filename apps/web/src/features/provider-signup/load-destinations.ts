import type { PlaceSummary } from '@travelpad/contracts';
import { serverApi, safe } from '@/lib/api';

/** Danh sách điểm đến cho ô chọn trong form đăng ký. */
export const loadDestinations = async () =>
  (await safe(serverApi.places.list({ kind: 'destination', sort: 'featured', limit: 50 }), { items: [] as PlaceSummary[], nextCursor: null })).items;
