import type { Region } from '@travelpad/contracts';

/**
 * Biểu tượng văn hóa từng miền (nét vẽ, currentColor):
 * Bắc – ruộng bậc thang · Trung – nón lá (nón bài thơ Huế) · Tây Nguyên – nhà rông · Nam & biển đảo – thuyền thúng.
 */
const GLYPHS: Record<Region, string[]> = {
  north: ['M3 20h18', 'M4.5 16.5q7.5-3 15 0', 'M6.5 13q5.5-2.6 11 0', 'M9 9.5q3-1.8 6 0', 'M10.5 6.5 12 4.5l1.5 2'],
  central: ['M3.5 14.5 12 4l8.5 10.5', 'M2.5 14.8q9.5 3.2 19 0', 'M7.2 10.3q4.8 1.3 9.6 0', 'M8 16.8q4 5 8 0'],
  highlands: ['M12 2.5c-2 4-4.5 8-7.5 11.5h15C16.5 10.5 14 6.5 12 2.5Z', 'M10.5 2.5h3', 'M5 17h14', 'M7 14v6', 'M12 14v6', 'M17 14v6'],
  south: ['M3 11.5h18', 'M3 11.5q0 6 9 6t9-6', 'M7.5 12v4.3', 'M12 12v5.3', 'M16.5 12v4.3', 'M14.5 3.5l4 9', 'M2 21q2.5-1.5 5 0t5 0 5 0 5 0'],
};

/** Các nét vẽ – dùng trong <svg> bất kỳ (chip lọc, quả cầu). */
export function RegionGlyph({ region }: { region: Region }) {
  return <>{GLYPHS[region].map((d) => <path key={d} d={d} />)}</>;
}

export function RegionIcon({ region, className = 'size-4' }: { region: Region; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <RegionGlyph region={region} />
    </svg>
  );
}
