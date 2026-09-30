'use client';

import dynamic from 'next/dynamic';

/** MapLibre (~250KB) chỉ tải phía trình duyệt, khi trang có bản đồ (ADR-0005). */
export const RouteMapLazy = dynamic(() => import('./route-map').then((m) => m.RouteMap), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-secondary" />,
});
