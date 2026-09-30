'use client';

import { useTranslations } from 'next-intl';
import { Clock, Search, TrendingUp, X } from 'lucide-react';

// TODO(TL-201): lấy từ GET /search/trending
const TRENDING = ['Sapa', 'Cắm trại', 'Đà Lạt', 'Leo núi', 'Phú Quốc'];

type Props = { value: string; onChange: (v: string) => void; history: string[]; onCommit: (v: string) => void };

/** Ô tìm địa điểm + gợi ý nhanh (lịch sử & xu hướng) khi ô trống. */
export function PlaceSearchBox({ value, onChange, history, onCommit }: Props) {
  const t = useTranslations();
  return (
    <>
      <label className="relative block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onCommit(value)} onBlur={() => onCommit(value)}
          placeholder={t('map.searchPlaces')} aria-label={t('map.searchPlaces')}
          className="h-11 w-full rounded-full border border-border bg-secondary/60 pl-10 pr-9 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" />
        {value && (
          <button onClick={() => onChange('')} aria-label={t('search.clear')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="size-4" /></button>
        )}
      </label>
      {!value && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {history.slice(0, 3).map((h) => (
            <button key={h} onClick={() => onChange(h)} className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs">
              <Clock className="size-3 text-muted-foreground" /> {h}
            </button>
          ))}
          {TRENDING.filter((k) => !history.includes(k)).map((k) => (
            <button key={k} onClick={() => onChange(k)} className="flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1 text-xs">
              <TrendingUp className="size-3 text-accent" /> {k}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
