'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { PlaceSummary, Region } from '@travelpad/contracts';
import { closedPath, GLOBE_CENTER as C, GLOBE_RADIUS as R, graticule, polyline, project } from '../geo/orthographic';
import { VN_OUTLINE } from '../geo/vn-outline';
import { useGlobeView } from '../hooks/use-globe-view';
import { GlobePin } from './globe-pin';
import { GlobeRegionMarks } from './globe-region-marks';

type Props = {
  pins: PlaceSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Điểm đã đến – ghim màu sáng */
  visitedIds?: string[];
  /** Thứ tự điểm đến để vẽ đường nối hành trình */
  route?: PlaceSummary[];
  /** false khi bật Tiết kiệm dữ liệu */
  animate?: boolean;
  /** Miền đang lọc + chạm biểu tượng miền để lọc */
  region?: Region | 'all';
  onRegion?: (region: Region) => void;
};

/** Quả cầu SVG: lưới kinh vĩ, đường bờ Việt Nam, ghim điểm đến, đường hành trình. */
export function Globe({ pins, selectedId, onSelect, visitedIds = [], route = [], animate = true, region = 'all', onRegion }: Props) {
  const t = useTranslations('map');
  const tRegion = useTranslations('region');
  const selected = pins.find((p) => p.id === selectedId);
  const target = useMemo(() => (selected ? { lat: selected.location.lat, lon: selected.location.lng } : null), [selected]);
  const { view, zoom, dragHandlers, zoomIn, zoomOut } = useGlobeView(target, animate);

  const grid = useMemo(() => graticule(view, zoom), [view, zoom]);
  const land = closedPath(VN_OUTLINE.map(([la, lo]) => project(la, lo, view, zoom)));
  const routePath = polyline(route.map((d) => project(d.location.lat, d.location.lng, view, zoom)));
  // Ghim đang chọn vẽ sau cùng để nhãn nằm trên các ghim lân cận
  const ordered = [...pins].sort((a, b) => Number(a.id === selectedId) - Number(b.id === selectedId));

  return (
    <div className="relative mx-auto aspect-square w-full touch-none select-none" {...dragHandlers}>
      <div className="globe-glow absolute inset-[6%] rounded-full" />
      <svg viewBox="0 0 400 400" className="relative h-full w-full cursor-grab active:cursor-grabbing" role="img" aria-label={t('globeLabel')}>
        <defs>
          <radialGradient id="ocean" cx="35%" cy="30%" r="75%">
            <stop offset="0%" style={{ stopColor: 'var(--map-muted)' }} stopOpacity="0.35" />
            <stop offset="100%" style={{ stopColor: 'var(--map-surface)' }} />
          </radialGradient>
          <clipPath id="globeClip"><circle cx={C} cy={C} r={R} /></clipPath>
        </defs>
        <circle cx={C} cy={C} r={R} fill="url(#ocean)" className="stroke-map-border" strokeWidth="1.5" />
        <g clipPath="url(#globeClip)">
          {grid.map((d, i) => <path key={i} d={d} fill="none" className="stroke-map-border" strokeWidth="0.7" />)}
          {land && <path d={land} className="fill-map-muted/30 stroke-map-muted" strokeWidth="1" />}
          <GlobeRegionMarks view={view} zoom={zoom} active={region} onSelect={onRegion}
            labels={{ north: tRegion('north'), central: tRegion('central'), highlands: tRegion('highlands'), south: tRegion('south') }} />
          {routePath && <path d={routePath} fill="none" className="stroke-map-accent" strokeWidth="2" strokeDasharray="5 5" />}
          {ordered.map((d) => (
            <GlobePin key={d.id} name={d.name} point={project(d.location.lat, d.location.lng, view, zoom)}
              active={d.id === selectedId} visited={visitedIds.includes(d.id)} pulse={animate} showLabel={zoom >= 6}
              onSelect={() => onSelect(d.id)} />
          ))}
        </g>
      </svg>
      <div className="absolute right-0 top-0 flex flex-col gap-1">
        <button onClick={zoomIn} aria-label={t('zoomIn')} className="grid size-9 place-items-center rounded-full bg-map-overlay text-sm font-bold text-map-foreground">+</button>
        <button onClick={zoomOut} aria-label={t('zoomOut')} className="grid size-9 place-items-center rounded-full bg-map-overlay text-sm font-bold text-map-foreground">−</button>
      </div>
      <p className="absolute bottom-0 w-full text-center text-[11px] text-map-muted">{t('hint')}</p>
    </div>
  );
}
