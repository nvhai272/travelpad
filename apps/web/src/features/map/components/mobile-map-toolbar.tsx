'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Globe2, SlidersHorizontal } from 'lucide-react';
import type { PlaceSummary } from '@travelpad/contracts';
import { Overlay } from '@/components/ui/overlay';
import type { SearchFilters } from '../filters';
import { PlaceFilters } from './place-filters';

type Props = {
  destinations: PlaceSummary[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  filters: SearchFilters;
  onFilters: (f: SearchFilters) => void;
  filterCount: number;
  resultCount: number;
  onReset: () => void;
  globeOpen: boolean;
  onToggleGlobe: () => void;
};

/**
 * Điện thoại (ẩn từ lg): nút "Lọc (n)" mở bảng trượt, chip điểm đến cuộn ngang, bật/tắt quả cầu.
 * Kết quả lên ngay màn hình đầu thay vì nằm dưới quả cầu + 4 nhóm lọc.
 */
export function MobileMapToolbar(p: Props) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card'}`;

  return (
    <div className="space-y-3 lg:hidden">
      <div className="flex gap-2">
        <button onClick={() => setOpen(true)} className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-semibold">
          <SlidersHorizontal className="size-4" /> {t('map.filtersBtn')}{p.filterCount > 0 && <span className="grid size-5 place-items-center rounded-full bg-accent text-[11px] text-accent-foreground">{p.filterCount}</span>}
        </button>
        <button onClick={p.onToggleGlobe} aria-pressed={p.globeOpen} className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-semibold">
          <Globe2 className="size-4" /> {p.globeOpen ? t('map.hideGlobe') : t('map.showGlobe')}
        </button>
      </div>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        <button onClick={() => p.onSelect(null)} className={chip(!p.selectedId)}>{t('map.allDestinations')}</button>
        {p.destinations.map((d) => <button key={d.id} onClick={() => p.onSelect(d.id)} className={chip(d.id === p.selectedId)}>{d.name}</button>)}
      </div>

      <Overlay open={open} onClose={() => setOpen(false)} variant="bottom" label={t('search.filters')}>
        <h2 className="mb-4 font-display text-2xl font-medium">{t('search.filters')}</h2>
        <PlaceFilters value={p.filters} onChange={p.onFilters} />
        <div className="sticky bottom-0 -mx-5 mt-5 flex gap-3 border-t border-border bg-card px-5 pt-3">
          <button onClick={p.onReset} className="h-12 rounded-xl px-4 text-sm font-semibold text-muted-foreground">{t('search.reset')}</button>
          <button onClick={() => setOpen(false)} className="h-12 flex-1 rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
            {t('map.showResults', { count: p.resultCount })}
          </button>
        </div>
      </Overlay>
    </div>
  );
}
