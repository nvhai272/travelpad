import { colors } from '@travelpad/design-tokens';

type LatLng = { lat: number; lng: number };

/** Khoảng cách đường chim bay (km, công thức haversine) – đủ để ước lượng "cách bao xa", không phải đường đi thật. */
export function distanceKm(a: LatLng, b: LatLng) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

/** "0,8" / "12" – dưới 10 km giữ một chữ số thập phân. */
export const formatKm = (km: number, locale: string) =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: km < 10 ? 1 : 0 }).format(km);

/** Màu từng ngày trên bản đồ lịch trình (hex – MapLibre không đọc oklch; lấy từ design-tokens). */
export const DAY_COLORS = [colors.primary, colors.accent, colors.ratingForeground, colors.ring, colors.mapSurface];
