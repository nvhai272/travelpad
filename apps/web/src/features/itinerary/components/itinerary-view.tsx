'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Itinerary } from '@travelpad/contracts';
import { RouteMapLazy } from '@/features/map/components/route-map-lazy';
import type { MapLine, MapStop } from '@/features/map/components/route-map';
import { DAY_COLORS } from '@/features/map/geo/distance';
import { ItineraryDayList } from './itinerary-day-list';

const colorOf = (day: number) => DAY_COLORS[(day - 1) % DAY_COLORS.length]!;

/**
 * Lịch trình + bản đồ lịch trình cạnh nhau (điện thoại: bản đồ ở trên). Chọn "Cả chuyến" hoặc từng ngày;
 * mỗi ngày một màu, ghim đánh số theo thứ tự đi, đường nối các điểm trong ngày.
 */
export function ItineraryView({ itinerary }: { itinerary: Itinerary }) {
  const t = useTranslations('itinerary');
  const [day, setDay] = useState(0); // 0 = cả chuyến
  const [activeId, setActiveId] = useState<string | null>(null);
  const days = day ? itinerary.days.filter((d) => d.day === day) : itinerary.days;

  const { stops, lines } = useMemo(() => {
    const stops: MapStop[] = [];
    const lines: MapLine[] = [];
    for (const d of days) {
      const places = d.slots.flatMap((s) => (s.place ? [s.place] : []));
      places.forEach((p, i) => {
        // Cùng một địa điểm có thể lặp (VD chỗ ngủ) – chỉ ghim lần đầu
        if (!stops.some((s) => s.id === p.id)) {
          stops.push({ id: p.id, lat: p.location.lat, lng: p.location.lng, label: String(i + 1), title: p.name, color: colorOf(d.day) });
        }
      });
      if (places.length > 1) lines.push({ id: `d${d.day}`, color: colorOf(d.day), coords: places.map((p) => [p.location.lng, p.location.lat]) });
    }
    return { stops, lines };
  }, [days]);

  const tab = (on: boolean) => `shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${on ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'}`;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="lg:order-2 lg:col-span-7">
        <div className="lg:sticky lg:top-24">
          <RouteMapLazy stops={stops} lines={lines} activeId={activeId} onSelect={setActiveId} className="h-[280px] sm:h-[380px] lg:h-[calc(100vh-8rem)]" />
        </div>
      </div>
      <div className="space-y-4 lg:col-span-5">
        <div role="tablist" aria-label={t('mapTitle')} className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <button role="tab" aria-selected={day === 0} onClick={() => setDay(0)} className={tab(day === 0)}>{t('allDays')}</button>
          {itinerary.days.map((d) => (
            <button key={d.day} role="tab" aria-selected={day === d.day} onClick={() => setDay(d.day)} className={tab(day === d.day)}>
              {t('dayN', { n: d.day })}
            </button>
          ))}
        </div>
        {days.map((d) => (
          <ItineraryDayList key={d.day} day={d} color={colorOf(d.day)} destination={itinerary.destination.name} activeId={activeId} onActive={setActiveId} />
        ))}
        <p className="text-xs text-muted-foreground">{t('note', { name: itinerary.destination.name })} · {t('kmHint')}</p>
      </div>
    </div>
  );
}
