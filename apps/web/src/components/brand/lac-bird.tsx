/**
 * Chim Lạc trên trống đồng Đông Sơn (theo mẫu đã chọn): thân dài cong lên thành cổ có đường rỗng dọc thân,
 * đuôi xẻ vạch ngang, cánh xiên cắt qua thân có nấc ngang và răng lược ở đỉnh, mào chữ nhật sau đầu,
 * mắt hai vòng, mỏ dài như kim, chân gập về sau. Nét được rút gọn và làm dày để còn rõ ở cỡ logo (~30px).
 * Vẽ bằng mask nên phần rỗng luôn trong suốt – tô bằng currentColor.
 */
const BODY = 'M13 50.6Q40 54 55 52.6Q64 51 67.6 42.4';
const range = (n: number, f: (i: number) => number) => Array.from({ length: n }, (_, i) => Math.round(f(i) * 10) / 10);
const WING_RUNGS = range(7, (i) => 41.4 + i * 3.6);
const WING_TEETH = range(4, (i) => 44.6 + i * 2.3);
const CREST_TEETH = range(3, (i) => 61 + i * 2);
const TAIL_SLITS = range(3, (i) => 48.6 + i * 2.2);
const BODY_DASHES = range(3, (i) => 25 + i * 2.2);

export function LacBird({ className }: { className?: string }) {
  const k = { stroke: 'black', fill: 'none' } as const;
  const w = { stroke: 'white', fill: 'none' } as const;
  return (
    <svg viewBox="11 24 89 46" aria-hidden className={className}>
      <mask id="lac-bird" maskUnits="userSpaceOnUse" x="11" y="24" width="89" height="46">
        <path d="M43.6 37.6H52.4L57.2 68.6 49 67.2Z" fill="white" />
        {WING_TEETH.map((x) => <path key={x} d={`M${x} 38.2 ${x + 0.5} 34.8`} strokeWidth="1.2" {...w} />)}
        {WING_RUNGS.map((y) => <path key={y} d={`M43 ${y}H58`} strokeWidth="1.1" {...k} />)}
        <path d={BODY} strokeWidth="5" {...w} />
        <path d="M13 45.8 23 48V55L12.4 54.8Z" fill="white" />
        <path d={BODY} strokeWidth="1.1" pathLength={100} strokeDasharray="0 22 70 8" {...k} />
        {TAIL_SLITS.map((y) => <path key={y} d={`M13.2 ${y}H21.2`} strokeWidth="1" {...k} />)}
        {BODY_DASHES.map((x) => <path key={x} d={`M${x} 51.8V54.2`} strokeWidth=".9" {...k} />)}
        <path d="M54.4 40.8 66.2 39.6 66.6 44 54.4 45Z" fill="white" />
        {CREST_TEETH.map((x) => <path key={x} d={`M${x} 40.2 ${x + 0.4} 35.4`} strokeWidth="1.2" {...w} />)}
        <path d="M57.8 41.8V44" strokeWidth=".9" {...k} />
        <circle cx="62.2" cy="42.3" r="1" strokeWidth=".7" {...k} />
        <path d="M70.6 38.3 98.8 25.2 71.2 41.6Z" fill="white" />
        <circle cx="69" cy="40" r="3.2" fill="white" />
        <circle cx="69" cy="40" r="1.8" strokeWidth=".8" {...k} />
        <path d="M44.2 59.6 41.6 63.4 21 61M35 58.8 38.6 62.2" strokeWidth="1.2" strokeLinejoin="round" {...w} />
      </mask>
      <rect x="11" y="24" width="89" height="46" className="fill-current" mask="url(#lac-bird)" />
    </svg>
  );
}
