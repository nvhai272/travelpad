import type { Region } from '@travelpad/contracts';
import { project, type GlobeView, type ScreenPoint } from '../geo/orthographic';
import { RegionGlyph } from './region-icon';

/** Vị trí đặt biểu tượng miền – lệch ra biển / biên giới để không đè ghim điểm đến. */
const ANCHORS: Record<Region, [number, number]> = {
  north: [22.6, 100.2],
  central: [17.2, 111.2],
  highlands: [13.2, 110.4],
  south: [7.6, 107.8],
};

type Props = {
  view: GlobeView;
  zoom: number;
  active: Region | 'all';
  labels: Record<Region, string>;
  onSelect?: (region: Region) => void;
};

/** Lớp biểu tượng 4 miền trên quả cầu: chạm để lọc theo miền (chạm lại để bỏ). */
export function GlobeRegionMarks({ view, zoom, active, labels, onSelect }: Props) {
  return (
    <>
      {(Object.keys(ANCHORS) as Region[]).map((r) => {
        const p: ScreenPoint = project(ANCHORS[r][0], ANCHORS[r][1], view, zoom);
        if (!p.visible) return null;
        const on = active === r;
        return (
          <g key={r} className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onSelect?.(r); }} onPointerDown={(e) => e.stopPropagation()}>
            <title>{labels[r]}</title>
            <circle cx={p.x} cy={p.y} r="13" strokeWidth="1.5"
              className={on ? 'fill-map-accent stroke-map-accent' : 'fill-map-surface/85 stroke-map-accent/70'} />
            <svg x={p.x - 8.5} y={p.y - 8.5} width="17" height="17" viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" className={on ? 'stroke-map-surface' : 'stroke-map-accent'}>
              <RegionGlyph region={r} />
            </svg>
          </g>
        );
      })}
    </>
  );
}
