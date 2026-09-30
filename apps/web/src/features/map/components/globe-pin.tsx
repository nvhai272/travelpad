import type { ScreenPoint } from '../geo/orthographic';

type Props = { name: string; point: ScreenPoint; active: boolean; visited: boolean; pulse: boolean; showLabel: boolean; onSelect: () => void };

/** Một ghim trên quả cầu. Chỉ ghi nhãn ghim đang chọn (hoặc khi zoom gần) để nhãn không đè nhau. */
export function GlobePin({ name, point: p, active, visited, pulse, showLabel, onSelect }: Props) {
  if (!p.visible) return null;
  return (
    <g className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onSelect(); }} onPointerDown={(e) => e.stopPropagation()}>
      <title>{name}</title>
      {active && pulse && (
        <circle cx={p.x} cy={p.y} r="14" className="animate-ping fill-map-accent/40 [transform-box:fill-box] [transform-origin:center]" />
      )}
      <circle cx={p.x} cy={p.y} r={active ? 7 : 5} strokeWidth="2"
        className={visited ? 'fill-map-foreground stroke-map-accent' : 'fill-map-accent stroke-map-surface'} />
      {(active || showLabel) && (
        <text x={p.x + 10} y={p.y + 4} className="fill-map-foreground text-[11px] font-bold [paint-order:stroke] stroke-map-surface [stroke-width:3px]">{name}</text>
      )}
    </g>
  );
}
