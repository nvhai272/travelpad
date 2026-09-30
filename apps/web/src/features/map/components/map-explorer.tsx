'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import type { PlaceSummary, ProviderSummary } from '@travelpad/contracts';
import { fold } from '@/lib/text';
import { useSearchHistory } from '@/lib/hooks/use-search-history';
import { useApp } from '@/features/app/app-provider';
import { useFootprints } from '../hooks/use-footprints';
import { usePlaceFilters } from '../hooks/use-place-filters';
import { GlobePanel } from './globe-panel';
import { PlaceFilters } from './place-filters';
import { PlaceResults } from './place-results';
import { PlaceSearchBox } from './place-search-box';
import { MobileMapToolbar } from './mobile-map-toolbar';
import { DestinationInsight } from './destination-insight';

type Props = {
  destinations: PlaceSummary[]; spots: PlaceSummary[]; providers: ProviderSummary[]; initialQuery?: string; initialRegion?: string;
  /** BXH chung (server render) – hiện khi chưa tìm gì */
  overview?: ReactNode;
};

/**
 * Trang Khám phá: quả cầu (trái) + tìm, lọc, kết quả địa điểm (phải) – BR-MAP-01..06.
 * Tìm / chọn một điểm đến → khung gợi ý (đánh giá, nơi nên đến, dịch vụ); chưa tìm gì → BXH chung bên dưới.
 */
export function MapExplorer({ destinations, spots, providers, initialQuery = '', initialRegion, overview }: Props) {
  const t = useTranslations();
  const { signedIn, requireAuth, settings } = useApp();
  const [mode, setMode] = useState<'hot' | 'mine'>('hot');
  const [globeOpen, setGlobeOpen] = useState(false); // điện thoại: quả cầu thu gọn mặc định
  const mineIds = useFootprints(signedIn);
  const history = useSearchHistory('travelpad.placeSearchHistory');
  const f = usePlaceFilters({ spots, destinations, mineIds, mode: signedIn ? mode : 'hot', initialQuery, initialRegion });

  // Điểm đến đang được hỏi: ghim đang chọn › tên điểm đến / tỉnh khớp từ khóa › mọi kết quả cùng một điểm đến
  const focus = useMemo(() => {
    if (f.destinationId) return f.destinationById.get(f.destinationId) ?? null;
    const needle = fold(f.query.trim());
    if (needle.length < 2) return null;
    const hit = destinations.find((d) => fold(`${d.name} ${d.province} ${d.slug}`).includes(needle));
    if (hit) return hit;
    const parents = new Set(f.results.map((s) => s.parentId));
    return parents.size === 1 ? f.destinationById.get([...parents][0] ?? '') ?? null : null;
  }, [f.destinationId, f.destinationById, f.query, f.results, destinations]);

  const pins = mode === 'mine' && signedIn ? destinations.filter((d) => mineIds.includes(d.id)) : destinations;
  const route = mineIds.map((id) => f.destinationById.get(id)).filter((d): d is PlaceSummary => !!d);

  return (
    // Điện thoại: công cụ → quả cầu (nếu mở) → kết quả. Desktop: quả cầu trái (2 hàng), công cụ + kết quả phải.
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
      <div className="order-2 space-y-5 lg:order-none lg:col-span-7 lg:row-span-2">
        <div className={globeOpen ? '' : 'hidden lg:block'}><GlobePanel mode={signedIn ? mode : 'hot'} onModeChange={(m) => (m === 'mine' ? requireAuth(() => setMode('mine')) : setMode('hot'))}
          pins={pins} selectedId={f.destinationId} onSelect={f.toggleDestination}
          visitedIds={mineIds} route={mode === 'mine' ? route : []} animate={!settings.dataSaver}
          region={f.filters.region} onRegion={(r) => f.setFilters({ ...f.filters, region: f.filters.region === r ? 'all' : r })} /></div>
        {!focus && !f.query.trim() && overview}
      </div>
      <div className="order-1 space-y-3 lg:order-none lg:col-span-5">
        <div className="space-y-4 rounded-2xl border border-border bg-card p-4 shadow-editorial lg:p-5">
          <PlaceSearchBox value={f.query} onChange={f.setQuery} history={history.history} onCommit={history.remember} />
          <div className="hidden border-t border-border pt-4 lg:block"><PlaceFilters value={f.filters} onChange={f.setFilters} /></div>
        </div>
        <MobileMapToolbar destinations={pins} selectedId={f.destinationId} onSelect={f.toggleDestination}
          filters={f.filters} onFilters={f.setFilters} filterCount={f.activeCount} resultCount={f.results.length} onReset={f.reset}
          globeOpen={globeOpen} onToggleGlobe={() => setGlobeOpen((o) => !o)} />
        {focus && <DestinationInsight dest={focus} spots={spots} providers={providers} />}
      </div>
      <section className="order-3 space-y-3 lg:order-none lg:col-span-5 lg:col-start-8">
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-semibold">
            {t('search.results', { count: f.results.length })}
            {f.destinationId && <span className="font-normal text-muted-foreground"> · {f.destinationById.get(f.destinationId)?.name}</span>}
          </p>
          {f.activeCount > 0 && (
            <button onClick={f.reset} className="flex items-center gap-1 text-xs font-semibold text-primary">
              <RotateCcw className="size-3.5" /> {t('search.reset')} ({f.activeCount})
            </button>
          )}
        </div>
        <PlaceResults results={f.results} destinationById={f.destinationById} onReset={f.reset} />
      </section>
    </div>
  );
}
