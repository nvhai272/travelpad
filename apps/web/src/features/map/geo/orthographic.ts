/**
 * Phép chiếu orthographic (nhìn quả cầu từ xa) cho SVG 400×400 – không phụ thuộc thư viện.
 * Trang /map đầy đủ có thể thay bằng MapLibre globe khi cần zoom cấp đường phố (ADR-0005).
 */
export const GLOBE_RADIUS = 170;
export const GLOBE_CENTER = 200;
const RAD = Math.PI / 180;

export type GlobeView = { lat: number; lon: number };
export type ScreenPoint = { x: number; y: number; visible: boolean };

/** Toạ độ màn hình của (lat, lon) khi nhìn từ `view`. Làm tròn 0.1px để server/client không lệch hydration. */
export function project(lat: number, lon: number, view: GlobeView, zoom: number): ScreenPoint {
  const r = GLOBE_RADIUS * zoom;
  const φ = lat * RAD, λ = (lon - view.lon) * RAD, φ0 = view.lat * RAD;
  const cosc = Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * Math.cos(φ) * Math.cos(λ);
  const round = (n: number) => Math.round(n * 10) / 10;
  return {
    x: round(GLOBE_CENTER + r * Math.cos(φ) * Math.sin(λ)),
    y: round(GLOBE_CENTER - r * (Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ))),
    visible: cosc > 0,
  };
}

/** Đường SVG qua các điểm, tự ngắt ở phần khuất sau quả cầu. */
export function polyline(points: ScreenPoint[]): string {
  let d = '';
  let pen = false;
  for (const p of points) {
    if (!p.visible) { pen = false; continue; }
    d += `${pen ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    pen = true;
  }
  return d;
}

/** Lưới kinh/vĩ tuyến mỗi 30°. */
export function graticule(view: GlobeView, zoom: number): string[] {
  const lines: string[] = [];
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts = []; for (let lon = -180; lon <= 180; lon += 6) pts.push(project(lat, lon, view, zoom)); lines.push(polyline(pts));
  }
  for (let lon = -180; lon < 180; lon += 30) {
    const pts = []; for (let lat = -90; lat <= 90; lat += 6) pts.push(project(lat, lon, view, zoom)); lines.push(polyline(pts));
  }
  return lines;
}

/** Đa giác khép kín – chỉ vẽ khi toàn bộ nằm mặt trước. */
export function closedPath(points: ScreenPoint[]): string {
  return points.every((p) => p.visible) ? `M${points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('L')}Z` : '';
}
