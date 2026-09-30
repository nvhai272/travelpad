'use client';

import { useTranslations } from 'next-intl';
import { Flame, Footprints } from 'lucide-react';
import type { PlaceSummary, Region } from '@travelpad/contracts';
import { Globe } from './globe';

type Props = {
  mode: 'hot' | 'mine';
  onModeChange: (mode: 'hot' | 'mine') => void;
  pins: PlaceSummary[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  visitedIds: string[];
  route: PlaceSummary[];
  animate: boolean;
  region: Region | 'all';
  onRegion: (region: Region) => void;
};

/** Khối trái trang Khám phá: tab Điểm hot/Của tôi + quả cầu + chip điểm đến. */
export function GlobePanel({ mode, onModeChange, pins, selectedId, onSelect, visitedIds, route, animate, region, onRegion }: Props) {
  const t = useTranslations('map');
  const tab = (active: boolean) => `flex items-center gap-1 rounded-full px-3 py-1.5 ${active ? 'bg-map-accent text-map-surface' : 'text-map-muted'}`;
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs ${active ? 'border-map-accent bg-map-accent text-map-surface' : 'border-map-border text-map-muted hover:text-map-foreground'}`;

  return (
    <section className="border-panel h-fit rounded-2xl bg-map-surface p-4 text-map-foreground shadow-editorial lg:sticky lg:top-24 lg:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow !mb-0 !text-map-accent">{t('eyebrow')}</p>
        <div className="flex rounded-full border border-map-border p-1 text-xs">
          <button onClick={() => onModeChange('hot')} className={tab(mode === 'hot')}><Flame className="size-3.5" /> {t('hot')}</button>
          <button onClick={() => onModeChange('mine')} className={tab(mode === 'mine')}><Footprints className="size-3.5" /> {t('mine')}</button>
        </div>
      </div>
      <div className="mx-auto mt-2 max-w-[320px] lg:max-w-[560px]">
        <Globe pins={pins} selectedId={selectedId} onSelect={onSelect} visitedIds={visitedIds} route={route} animate={animate} region={region} onRegion={onRegion} />
      </div>
      <div className="mt-4 hidden flex-wrap gap-2 lg:flex">
        <button onClick={() => onSelect(null)} className={chip(!selectedId)}>{t('allDestinations')}</button>
        {pins.map((d) => <button key={d.id} onClick={() => onSelect(d.id)} className={chip(d.id === selectedId)}>{d.name}</button>)}
        {mode === 'mine' && pins.length === 0 && <p className="text-xs text-map-muted">{t('noFootprints')}</p>}
      </div>
    </section>
  );
}
