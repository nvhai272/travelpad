/**
 * Design tokens TravelPad – phong cách "tạp chí du lịch" (khớp bản Lovable "Wander Logbook").
 * Web dùng giá trị oklch gốc trong apps/web/src/app/globals.css; file này giữ bản hex tương đương
 * cho mobile (React Native không hỗ trợ oklch). Đổi màu → sửa cả hai nơi (TL-004 sẽ tự sinh).
 */
export const colors = {
  background: '#F8F3EB', // oklch(96.5% .012 79) – giấy kem
  foreground: '#24180F', // oklch(22% .025 55)
  card: '#FFFBF6', // oklch(99% .008 80)
  primary: '#1E5A38', // oklch(42% .085 155) – xanh rừng
  primaryForeground: '#FCFAF6',
  secondary: '#EBE3D8', // oklch(92% .018 78)
  mutedForeground: '#715F53', // oklch(50% .03 55)
  accent: '#DB7039', // oklch(66% .15 46) – cam hổ phách
  accentForeground: '#FFFBF6',
  border: '#D7CCBD', // oklch(85% .024 75)
  ring: '#42815A',
  rating: '#FFDEA0',
  ratingForeground: '#91450D',
  // Panel bản đồ (nền xanh rừng đậm)
  mapSurface: '#132A1B',
  mapForeground: '#FBF8F1',
  mapMuted: '#B1C4B4',
  mapAccent: '#EC9247',
  heroMuted: '#E8E0D4',
  danger: '#B42318',
} as const;

export const fonts = {
  display: '"Lora", Georgia, serif',
  body: '"Be Vietnam Pro", system-ui, sans-serif',
} as const;

/** Thang chữ (px). Hero: 48 mobile / 72 desktop. */
export const fontSize = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '5xl': 48, '7xl': 72 } as const;
/** Thang khoảng cách 4px. */
export const space = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32, 10: 40, 12: 48 } as const;
/** Bo góc: thẻ 16 (2xl), input/nút form 12 (xl), chip/pill tròn. */
export const radius = { lg: 8, xl: 12, '2xl': 16, full: 9999 } as const;
export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, max: 1480 } as const;
