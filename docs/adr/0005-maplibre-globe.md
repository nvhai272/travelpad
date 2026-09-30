# ADR-0005: MapLibre GL cho bản đồ quả cầu & 2D

**Bối cảnh.** Cần quả cầu 3D (xoay, zoom, ghim pulse, flyTo) và bản đồ 2D hành trình; sau này chạy cả trên mobile; tránh phí license.

**Quyết định.** MapLibre GL JS v5 (`projection: 'globe'`) cho web, `@maplibre/maplibre-react-native` cho mobile. Tile: OpenFreeMap/MapTiler
(kiểu cổ điển/địa hình/vệ tinh theo Settings). Ghim render bằng layer `circle` + animation, không dùng DOM marker số lượng lớn.

**Hệ quả.** (+) Một thư viện cho globe + 2D, web + mobile, mã nguồn mở. (−) Bundle ~250KB → load động, chỉ ở trang bản đồ.

**Bổ sung (26/09/2026).** Widget quả cầu trên trang chủ dùng SVG orthographic tự viết (`features/map/globe-map.tsx`, ~0KB thư viện) cho nhẹ và giống bản thiết kế; MapLibre chỉ dùng cho trang `/map` đầy đủ.

**Bổ sung (27/09/2026).** Đã cài `maplibre-gl@5` (bản 6 tách worker ESM, Turbopack của Next không nạp được). Bản đồ 2D dùng ở **lịch trình** và **trang địa điểm** (`features/map/components/route-map.tsx`, tải động qua `route-map-lazy.tsx`), nền OpenFreeMap Positron. Ghim dùng DOM marker có số vì mỗi bản đồ ≤ ~20 điểm; bật `cooperativeGestures` để cuộn trang trên điện thoại không bị bản đồ giữ. Khoảng cách hiển thị là đường chim bay (haversine), ghi rõ trên giao diện.

**Đã cân nhắc.** d3-geo orthographic (nhẹ, đẹp nhưng không có tile/zoom chi tiết); Mapbox (phí theo lượt tải); three.js/react-globe.gl (nặng, không có bản đồ 2D chi tiết).
