# Lộ trình phát triển TravelPad

> Sprint 2 tuần, bắt đầu **thứ Hai 28/09/2026**. Ước lượng cho **1–2 dev full-stack**; nếu có thêm người, các
> epic FE/BE trong cùng sprint chạy song song được. Chi tiết từng task: [backlog.md](./backlog.md).

```
2026  Th9 ─ Th10 ─── Th11 ─── Th12 ─── 2027 Th1 ─── Th2 ─── Th3 ─── Th4 ─── Th5
      │P0│◄──── Phase 1: MVP Web ────►│◄─ Phase 2: Bản đồ & Xã hội ─►│◄── Phase 3: Mobile ──►│ Phase 4 →
      S0   S1    S2    S3    S4        S5    S6    S7                S8   S9   S10  S11
                              ▲ Beta web (đóng)          ▲ Public web            ▲ App store
```

## Phase 0 – Nền móng ✅ (đã có trong repo)

- Monorepo pnpm + Turborepo, 4 package dùng chung, TS strict.
- Docker dev stack (Postgres+PostGIS, Redis, S3, Mailpit, api, web) + CLI `./dev`.
- Prisma schema đầy đủ cho Phase 1–2 + migration init (PostGIS trigger, trigram index) + seed.
- API: auth JWT + refresh xoay vòng, guard toàn cục, lỗi chuẩn, Swagger, places (lọc đa tiêu chí, review), posts (feed, like, bookmark), users.
- Web: layout, i18n vi/en, trang chủ, chi tiết địa điểm/bài viết/hồ sơ, JSON-LD, sitemap, robots.
- Dockerfile production cho api + web.

**Việc còn lại của S0 (tuần 28/09):** CI GitHub Actions, ESLint + Prettier + lint-staged, Vitest/Jest khung test, ảnh mẫu cho seed.

## Phase 1 – MVP Web (S1–S4 · 12/10 → 06/12/2026)

Mục tiêu: người dùng khách **tìm & đọc** được; thành viên **viết, review, tương tác**. SEO sẵn sàng index.

| Sprint | Trọng tâm | Kết quả demo được |
|---|---|---|
| **S1** 12/10–25/10 | Auth UI + chế độ khách + Settings | Đăng ký/đăng nhập, LoginModal khi bấm tính năng riêng, banner khách, panel Cài đặt (ngôn ngữ, chữ lớn, tiết kiệm dữ liệu, thông báo, riêng tư) đồng bộ server |
| **S2** 26/10–08/11 | Khám phá + Tìm kiếm thông minh | Trang `/places` với bộ lọc (vùng, loại, giá, sao, badge đếm, reset, đếm kết quả), autocomplete có highlight, lịch sử 8 từ khoá, xu hướng |
| **S3** 09/11–22/11 | Địa điểm + Review + Media | Trang địa điểm đầy đủ (gallery, bản đồ nhỏ, spots con, review + viết review), upload ảnh S3 presigned + resize |
| **S4** 23/11–06/12 | Bài viết + Tương tác + Hồ sơ | Editor bài viết (Markdown + ảnh), bình luận 2 cấp, thích/lưu optimistic, hồ sơ có tab Bài viết/Đã lưu, **Beta đóng** |

**Definition of Done Phase 1:** Lighthouse SEO ≥ 95, Performance ≥ 85 (mobile); mọi trang công khai có metadata + JSON-LD;
test e2e (Playwright) cho luồng khách → đăng ký → viết bài.

## Phase 2 – Bản đồ & Xã hội (S5–S7 · 07/12/2026 → 17/01/2027)

| Sprint | Trọng tâm | Kết quả |
|---|---|---|
| **S5** 07/12–20/12 | Bản đồ quả cầu | Trang `/map`: quả cầu MapLibre globe, kéo xoay/auto-rotate/zoom, ghim pulse, tab **Điểm hot / Của tôi**, chip danh mục (Ăn uống, Nghỉ dưỡng, Cắm trại, Leo núi, Tham quan), bấm ghim → xoay về tâm + Quick Card (mùa đẹp, thời tiết, check-in tuần) + danh sách hot spots + "Lưu vào chuyến đi" |
| **S6** 21/12–03/01 | Hành trình & Dấu chân | Check-in, bản đồ 2D đường nối các điểm, trang hành trình công khai, chế độ `ongoing` |
| **S7** 04/01–17/01 | Bạn bè & Thông báo & Cấp độ | Kết bạn, "Bạn bè đang đi", thông báo in-app, XP/level/huy hiệu, Meilisearch (nếu cần), **Public launch web** |

## Phase 3 – App mobile (S8–S11 · 18/01 → 14/03/2027)

Expo (React Native) + expo-router, dùng lại `contracts`, `api-client`, `i18n`, `design-tokens`.

| Sprint | Trọng tâm |
|---|---|
| **S8** | Khung app, auth (SecureStore), tab bar, feed, chi tiết địa điểm/bài viết |
| **S9** | Tìm kiếm + bộ lọc, bản đồ (`@maplibre/maplibre-react-native`), check-in bằng GPS + camera |
| **S10** | Viết bài/đăng ảnh từ máy, push notification (Expo Push), deep link (universal links từ web) |
| **S11** | Offline cache (TanStack Query persist), hiệu năng, TestFlight/Internal testing → phát hành store |

## Phase 4 – Mở rộng (từ 03/2027)

Xem mục "Kế hoạch bổ sung tính năng" trong [backlog.md](./backlog.md#kế-hoạch-bổ-sung-tính-năng).

## Rủi ro & cách giảm

| Rủi ro | Giảm thiểu |
|---|---|
| Dữ liệu địa điểm ban đầu mỏng → web "trống" | Seed 60–100 địa điểm thật trước beta (script import CSV); mời 10–20 người viết bài đầu |
| Quả cầu 3D nặng trên mobile web | Lazy-load, `dataSaver` tắt auto-rotate + ảnh chất lượng thấp, fallback danh sách |
| Tìm kiếm tiếng Việt không dấu | `unaccent` + trigram ở Phase 1, Meilisearch ở Phase 2 |
| Spam/nội dung xấu khi mở công khai | Rate limit (đã có Throttler), báo cáo nội dung, hàng đợi kiểm duyệt (Phase 4 kéo lên nếu cần) |
| Ảnh làm tăng chi phí | Resize + WebP/AVIF, CDN (R2 + Cloudflare), giới hạn 20 ảnh/bài |
