'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Search, Sparkles } from 'lucide-react';
import type { PlaceSummary } from '@travelpad/contracts';
import { useRouter } from '@/i18n/routing';
import { fold } from '@/lib/text';

/**
 * Form chọn điểm đến + số ngày. Kết quả nằm trên URL (?destination&days) → chia sẻ được, SEO được.
 * Đã có kết quả thì thu gọn thành một dòng (điểm đến · đổi số ngày ngay · "Đổi điểm đến") để lịch trình và bản đồ lên màn hình đầu.
 */
export function ItineraryPlanner({ destinations, destination, days }: { destinations: PlaceSummary[]; destination?: string; days: number }) {
  const t = useTranslations('itinerary');
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState(destination ?? '');
  const [n, setN] = useState(days);
  const [open, setOpen] = useState(!destination);
  const list = query ? destinations.filter((d) => fold(`${d.name} ${d.province}`).includes(fold(query))) : destinations;

  const go = (slug = picked, count = n) => slug && router.push(`/itinerary?destination=${slug}&days=${count}`);
  const current = destinations.find((d) => d.slug === destination);
  const dayPills = (onPick: (k: number) => void) => (
    <div className="no-scrollbar flex max-w-full overflow-x-auto rounded-full bg-secondary p-1 text-xs font-semibold">
      {[1, 2, 3, 4, 5].map((k) => (
        <button key={k} onClick={() => onPick(k)}
          className={`shrink-0 whitespace-nowrap rounded-full px-3 py-2 transition ${n === k ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
          {t('daysN', { count: k })}
        </button>
      ))}
    </div>
  );

  if (!open && current) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-editorial sm:p-4">
        <span className="flex min-w-0 items-center gap-2 font-display text-xl font-medium"><MapPin className="size-5 shrink-0 text-accent" />{current.name}</span>
        {dayPills((k) => { setN(k); go(current.slug, k); })}
        <button onClick={() => setOpen(true)} className="ml-auto text-sm font-semibold text-primary">{t('change')}</button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-editorial">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">{t('destination')}</p>
      <label className="relative block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('searchProvince')} aria-label={t('searchProvince')}
          onKeyDown={(e) => { if (e.key === 'Enter' && list[0]) { setPicked(list[0].slug); go(list[0].slug); } }}
          className="h-10 w-full rounded-full border border-border bg-secondary/60 pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" />
      </label>
      <div className="no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
        {list.map((d) => (
          <button key={d.id} onClick={() => setPicked(d.slug)}
            className={`shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition ${
              picked === d.slug ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-secondary'}`}>
            {d.name} <span className="opacity-60">· {d.province}</span>
          </button>
        ))}
        {query && list.length === 0 && <p className="text-xs text-muted-foreground">{t('noProvince', { q: query })}</p>}
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">{t('days')}</p>
          {dayPills(setN)}
        </div>
        <button onClick={() => go()} disabled={!picked}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50 sm:h-auto sm:w-auto sm:py-2.5">
          <Sparkles className="size-4" /> {t('submit')}
        </button>
      </div>
    </div>
  );
}
