'use client';

import { useEffect, useRef } from 'react';
import { GeoJSONSource, LngLatBounds, Map as MlMap, Marker, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

/** Nền bản đồ OpenFreeMap (miễn phí, không cần khóa – ADR-0005); kiểu Positron sáng, hợp nền giấy kem. */
const STYLE = 'https://tiles.openfreemap.org/styles/positron';

export type MapStop = { id: string; lat: number; lng: number; label: string; title: string; color: string };
export type MapLine = { id: string; color: string; coords: [number, number][] };
type Props = { stops: MapStop[]; lines?: MapLine[]; activeId?: string | null; onSelect?: (id: string) => void; className?: string };

/**
 * Bản đồ 2D MapLibre cho lịch trình / địa điểm: ghim có số (DOM marker – số lượng ít), đường nối theo màu từng ngày,
 * tự thu phóng vừa các điểm. `cooperativeGestures`: cuộn trang không bị bản đồ "bắt" (cần 2 ngón / Ctrl để zoom).
 */
export function RouteMap({ stops, lines = [], activeId, onSelect, className = '' }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<MlMap | null>(null);
  const markers = useRef(new Map<string, { marker: Marker; el: HTMLElement }>());
  const select = useRef(onSelect);
  select.current = onSelect;

  useEffect(() => {
    if (!box.current) return;
    const m = new MlMap({
      container: box.current, style: STYLE, center: [105.8, 16], zoom: 5,
      attributionControl: { compact: true }, cooperativeGestures: true,
    });
    m.addControl(new NavigationControl({ showCompass: false }), 'top-right');
    // Ghi công thu gọn thành nút (i) – trên điện thoại dòng chữ đầy đủ che mất góc bản đồ
    m.once('load', () => box.current?.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show'));
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  // Ghim + đường: vẽ lại khi dữ liệu đổi (đợi style tải xong mới thêm source)
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const draw = () => {
      markers.current.forEach(({ marker }) => marker.remove());
      markers.current.clear();
      for (const s of stops) {
        const el = document.createElement('button');
        el.type = 'button';
        el.title = s.title;
        el.textContent = s.label;
        el.className = 'grid size-7 place-items-center rounded-full border-2 border-white text-[11px] font-bold text-white shadow-md transition-transform';
        el.style.background = s.color;
        el.onclick = () => select.current?.(s.id);
        markers.current.set(s.id, { el, marker: new Marker({ element: el }).setLngLat([s.lng, s.lat]).addTo(m) });
      }
      const data: Parameters<GeoJSONSource['setData']>[0] = {
        type: 'FeatureCollection',
        features: lines.map((l) => ({ type: 'Feature', properties: { color: l.color }, geometry: { type: 'LineString', coordinates: l.coords } })),
      };
      const src = m.getSource('route');
      if (src instanceof GeoJSONSource) src.setData(data);
      else {
        m.addSource('route', { type: 'geojson', data });
        m.addLayer({ id: 'route', type: 'line', source: 'route', paint: { 'line-color': ['get', 'color'], 'line-width': 3, 'line-dasharray': [2, 1.5] } });
      }
      if (stops.length === 1) m.jumpTo({ center: [stops[0]!.lng, stops[0]!.lat], zoom: 13 });
      else if (stops.length > 1) {
        const b = new LngLatBounds();
        stops.forEach((s) => b.extend([s.lng, s.lat]));
        m.fitBounds(b, { padding: 56, maxZoom: 14, duration: 600 });
      }
    };
    if (m.isStyleLoaded()) draw();
    else m.once('load', draw);
  }, [stops, lines]);

  // Điểm đang chọn: phóng to ghim, đưa lên trên
  useEffect(() => {
    markers.current.forEach(({ el }, id) => {
      const on = id === activeId;
      el.style.transform = on ? 'scale(1.35)' : '';
      el.style.zIndex = on ? '10' : '';
    });
  }, [activeId, stops]);

  return <div ref={box} className={`overflow-hidden rounded-2xl border border-border bg-secondary ${className}`} />;
}
