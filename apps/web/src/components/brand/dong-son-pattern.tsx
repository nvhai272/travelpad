/**
 * Hoa văn mặt trống đồng Đông Sơn (cách điệu): ngôi sao 14 cánh ở tâm, các vành đồng tâm,
 * vành tia và vành tam giác. Dùng làm họa tiết nền mờ – tô bằng currentColor.
 */
const STAR = '100,82 101.56,93.18 107.81,83.78 104.36,94.53 114.07,88.78 106.31,96.96 117.55,95.99 107,100 117.55,104.01 106.31,103.04 114.07,111.22 104.36,105.47 107.81,116.22 101.56,106.82 100,118 98.44,106.82 92.19,116.22 95.64,105.47 85.93,111.22 93.69,103.04 82.45,104.01 93,100 82.45,95.99 93.69,96.96 85.93,88.78 95.64,94.53 92.19,83.78 98.44,93.18';
const r2 = (n: number) => Math.round(n * 100) / 100;
const polar = (r: number, deg: number) => [r2(100 + r * Math.cos((deg * Math.PI) / 180)), r2(100 + r * Math.sin((deg * Math.PI) / 180))];

const TICKS = Array.from({ length: 48 }, (_, i) => [...polar(64, i * 7.5), ...polar(76, i * 7.5)]);
const TRIANGLES = Array.from({ length: 24 }, (_, i) => {
  const a = i * 15;
  return [polar(42, a - 5), polar(56, a), polar(42, a + 5)].map((p) => p.join(',')).join(' ');
});

export function DongSonPattern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden className={className}>
      <polygon points={STAR} fill="currentColor" stroke="none" />
      {[24, 40, 58, 62, 78, 82, 97].map((r) => <circle key={r} cx="100" cy="100" r={r} />)}
      {TICKS.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />)}
      {TRIANGLES.map((pts, i) => <polygon key={i} points={pts} />)}
      {Array.from({ length: 16 }, (_, i) => {
        const [cx, cy] = polar(89.5, i * 22.5);
        return <circle key={i} cx={cx} cy={cy} r="2.2" fill="currentColor" stroke="none" />;
      })}
    </svg>
  );
}
