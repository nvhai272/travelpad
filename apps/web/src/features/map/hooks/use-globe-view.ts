'use client';

import { useEffect, useRef, useState } from 'react';
import type { GlobeView } from '../geo/orthographic';

const VIETNAM: GlobeView = { lat: 16, lon: 106 };

/** Trạng thái góc nhìn quả cầu: xoay mượt tới đích, kéo để xoay, zoom. Mở sẵn ở Việt Nam. */
export function useGlobeView(target: GlobeView | null, animate: boolean) {
  const [view, setView] = useState<GlobeView>(VIETNAM);
  const [zoom, setZoom] = useState(4.5);
  const drag = useRef<{ x: number; y: number; view: GlobeView } | null>(null);
  const goal = useRef<GlobeView | null>(null);

  useEffect(() => {
    const next = target ?? VIETNAM;
    if (!animate) { setView(next); return; }
    goal.current = next;
    let raf = 0;
    const tick = () => {
      const g = goal.current;
      if (!g) return; // tới nơi → dừng vòng lặp
      if (!drag.current) {
        setView((v) => {
          const dLon = g.lon - v.lon, dLat = g.lat - v.lat;
          if (Math.abs(dLon) < 0.05 && Math.abs(dLat) < 0.05) { goal.current = null; return g; }
          return { lat: v.lat + dLat * 0.1, lon: v.lon + dLon * 0.1 };
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target?.lat, target?.lon, animate]); // eslint-disable-line react-hooks/exhaustive-deps

  const dragHandlers = {
    onPointerDown: (e: React.PointerEvent) => {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      drag.current = { x: e.clientX, y: e.clientY, view };
      goal.current = null;
    },
    onPointerMove: (e: React.PointerEvent) => {
      const d = drag.current;
      if (d) setView({ lon: d.view.lon - ((e.clientX - d.x) * 0.4) / zoom, lat: Math.max(-70, Math.min(70, d.view.lat + ((e.clientY - d.y) * 0.4) / zoom)) });
    },
    onPointerUp: () => { drag.current = null; },
  };

  return {
    view, zoom, dragHandlers,
    zoomIn: () => setZoom((z) => Math.min(8, z + 1)),
    zoomOut: () => setZoom((z) => Math.max(1, z - 1)),
  };
}
