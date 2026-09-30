# Backlog & phân chia nhiệm vụ

Ký hiệu: **BE** backend · **FE** web · **MB** mobile · **DS** design · **OPS** hạ tầng.
Ước lượng: S ≤ 0.5 ngày · M ≈ 1–2 ngày · L ≈ 3–5 ngày. Ưu tiên: P0 bắt buộc cho mốc · P1 nên có · P2 để sau.
Mỗi task khi làm → tạo issue `TL-xxx`, nhánh `feat/TL-xxx-mo-ta-ngan`.

## S0 – Hoàn thiện nền móng

| ID | Task | Loại | Ước lượng | Ưu tiên |
|---|---|---|---|---|
| TL-001 | GitHub Actions: typecheck, lint, test, build Docker image | OPS | M | P0 |
| TL-002 | ESLint (flat config dùng chung trong `packages/config`) + Prettier + lint-staged/husky | OPS | M | P0 |
| TL-003 | Khung test: Jest/Vitest cho api (service + e2e với Postgres test container), Vitest cho packages | BE | M | P0 |
| TL-004 | Script sinh `globals.css` `@theme` từ `design-tokens` (hết phải sửa 2 nơi) | FE | S | P1 |
| TL-005 | ✅ Ảnh thật Wikimedia Commons cho 8 điểm đến + 30 địa điểm + 6 địa danh, có ghi công (`/credits`). Còn lại: mở rộng seed ~20 destination/60 spot | BE | M | P1 |
| TL-006 | Thiết kế Figma: design system (màu, chữ, component) theo bản Lovable | DS | L | P0 |

## S1 – Auth UI, chế độ khách, Cài đặt

| ID | Task | Loại | Ước lượng | Ưu tiên |
|---|---|---|---|---|
| TL-101 | `AuthProvider` web: access token in-memory, auto refresh khi 401, `useAuth()` | FE | M | P0 |
| TL-102 | Trang/modal Đăng nhập, Đăng ký (react-hook-form + zod từ contracts) | FE | M | P0 |
| TL-103 | `RequireAuth` wrapper: bấm Thích/Lưu/Bình luận/Kết bạn/Viết bài khi là khách → mở LoginModal, làm xong tiếp tục hành động | FE | M | P0 |
| TL-104 | Banner chế độ khách + menu tài khoản (avatar, hồ sơ, cài đặt, đăng xuất) | FE | S | P0 |
| TL-105 | `GET/PATCH /me/settings` (validate `UserSettingsSchema`), `PATCH /me` hồ sơ | BE | M | P0 |
| TL-106 | Panel Cài đặt: ngôn ngữ, giao diện sáng/tối, kiểu bản đồ, chữ lớn, tiết kiệm dữ liệu, thông báo, chia sẻ vị trí; khách lưu localStorage, thành viên đồng bộ | FE | L | P0 |
| TL-107 | Quên mật khẩu qua email (Mailpit dev) + xác minh email | BE | M | P1 |
| TL-108 | Đăng nhập Google (OAuth) | BE/FE | M | P2 |

## S2 – Khám phá & Tìm kiếm thông minh

| ID | Task | Loại | Ước lượng | Ưu tiên |
|---|---|---|---|---|
| TL-201 | `SearchModule`: `GET /search/suggest?q=` (trigram + unaccent, trả `highlight`), `GET /search/trending`, ghi `SearchLog` | BE | L | P0 |
| TL-202 | `GET /me/search-history` + xoá từng mục/tất cả (thành viên) | BE | S | P1 |
| TL-203 | Ô tìm kiếm header: popover kính mờ, lịch sử 8 mục (localStorage), xu hướng, gợi ý live có icon danh mục + highlight, điều hướng bàn phím | FE | L | P0 |
| TL-204 | Trang `/places`: grid + infinite scroll, URL là nguồn state của bộ lọc (`?region=north&category=camping,hiking&price=1,2&minRating=4.5`) | FE | M | P0 |
| TL-205 | Bộ lọc đa tiêu chí: vùng, loại, mức giá, sao; badge "Bộ lọc (3)", nút reset, đếm kết quả realtime; sheet trên mobile | FE | L | P0 |
| TL-206 | `GET /places` trả `total` khi có bộ lọc (count song song) | BE | S | P0 |
| TL-207 | SEO trang landing theo vùng/loại: `/places/mien-bac`, `/places/cam-trai` (static params) | FE | M | P1 |

## S3 – Địa điểm, Review, Media

| ID | Task | Loại | Ước lượng | Ưu tiên |
|---|---|---|---|---|
| TL-301 | `MediaModule`: `POST /media/presign` → upload thẳng S3, `POST /media/:id/complete`; job BullMQ resize → WebP (sharp) | BE | L | P0 |
| TL-302 | Component upload ảnh (kéo thả, preview, tiến trình) | FE | M | P0 |
| TL-303 | Trang địa điểm đầy đủ: hero gallery, thông tin (mùa đẹp, giá, check-in tuần), bản đồ nhỏ, spots con, bài viết liên quan | FE | L | P0 |
| TL-304 | ✅ Vote sao + nhận xét tuỳ chọn, phân bố sao, danh sách nhận xét (BR-REV-01..03) | FE | M | P0 |
| TL-305 | ✅ `PUT/GET/DELETE /places/:id/reviews/me`, tính lại điểm địa điểm + điểm đến cha | BE | S | P0 |
| TL-306 | `GET /places/nearby?lat&lng&radius` bằng `ST_DWithin` | BE | M | P1 |
| TL-307 | Nút "Hữu ích" trên đánh giá (optimistic, ẩn với đánh giá của chính mình) – API đã có (BR-REV-05) | FE | S | P0 |
| TL-308 | Trang `/rankings` đầy đủ: tab tuần/tháng, BXH theo vùng/loại, top 20 | FE/BE | M | P1 |
| TL-309 | Chống gian lận BXH: bỏ vote từ tài khoản < 7 ngày/chưa xác minh, tối đa 5 vote/cặp/tháng (BR-RANK-06) | BE | M | P1 |

## S4 – Bài viết, Tương tác, Hồ sơ

| ID | Task | Loại | Ước lượng | Ưu tiên |
|---|---|---|---|---|
| TL-401 | `POST/PATCH/DELETE /posts` (slug tiếng Việt → không dấu, excerpt tự sinh, nháp/đăng) | BE | M | P0 |
| TL-402 | Editor bài viết (Markdown + ảnh + gắn địa điểm/hành trình + tag), render Markdown an toàn (sanitize) | FE | L | P0 |
| TL-403 | `CommentsModule`: list/create/delete, trả lời 1 cấp, cập nhật `commentCount` | BE | M | P0 |
| TL-404 | Nút Thích/Lưu optimistic (TanStack Query), khu bình luận | FE | M | P0 |
| TL-405 | Hồ sơ: tabs Bài viết / Hành trình / Đã lưu (chỉ chủ) / Bạn bè; sửa hồ sơ, avatar, cover | FE/BE | L | P0 |
| TL-406 | Playwright e2e: khách tìm kiếm → đăng ký → viết bài → bình luận | FE | M | P0 |
| TL-407 | Lighthouse CI + kiểm tra JSON-LD (Rich Results) | OPS | S | P1 |

## S5 – Bản đồ quả cầu

| ID | Task | Loại | Ước lượng | Ưu tiên |
|---|---|---|---|---|
| TL-501 | `MapModule`: `GET /map/pins?mode=hot|mine&category=` (payload nhẹ), `GET /map/destinations/:slug` → `DestinationCard` | BE | M | P0 |
| TL-502 | Tab "Hot tuần này" + snapshot BXH mỗi thứ Hai để hiện mũi tên tăng/giảm hạng (BR-RANK-05) | BE | M | P1 |
| TL-503 | Thời tiết hiện tại cho destination (Open-Meteo, cache Redis 30 phút) | BE | S | P1 |
| TL-504 | Component `GlobeMap` (MapLibre `projection: globe`): kéo xoay, auto-rotate khi rảnh, +/-, ghim pulse, nhãn | FE | L | P0 |
| TL-505 | Tabs Điểm hot / Của tôi (khách → thẻ mời đăng nhập), chip danh mục lọc ghim | FE | M | P0 |
| TL-506 | Bấm ghim → `flyTo` về tâm + Quick Card + danh sách hot spots + "Lưu vào chuyến đi" | FE | L | P0 |
| TL-507 | Kiểu bản đồ theo Settings (cổ điển / địa hình / vệ tinh), `dataSaver` tắt auto-rotate | FE | S | P1 |

## S6 – Hành trình & Dấu chân

| ID | Task | Loại | Ước lượng | Ưu tiên |
|---|---|---|---|---|
| TL-601 | `CheckinsModule`: tạo check-in (kiểm tra khoảng cách GPS hợp lý), list dấu chân | BE | M | P0 |
| TL-602 | `JourneysModule`: CRUD, thêm/sắp xếp điểm dừng, tính `distanceKm` (PostGIS), quyền xem public/friends/private | BE | L | P0 |
| TL-603 | Bản đồ 2D hành trình: đường nối các điểm theo thời gian, ảnh kỷ niệm trên mốc | FE | L | P0 |
| TL-604 | Trang hành trình công khai (SEO) + chia sẻ OG image động (`next/og`) | FE | M | P1 |

## S7 – Bạn bè, Thông báo, Cấp độ

| ID | Task | Loại | Ước lượng | Ưu tiên |
|---|---|---|---|---|
| TL-701 | ✅ ~~Kết bạn~~ → **Theo dõi** một chiều: follow/unfollow, trang Theo dõi, số người theo dõi (BR-FOL-01..04) | BE/FE | M | P0 |
| TL-702 | ✅ Câu chuyện mới: 6 trên trang chủ + `/stories` phân trang + câu chuyện của người đang theo dõi (BR-STORY-01..03) | FE/BE | M | P0 |
| TL-720 | Gợi ý người nên theo dõi (cùng điểm đến, nhiều "Hữu ích") | BE/FE | M | P1 |
| TL-703 | `NotificationsModule` in-app (thích, bình luận, kết bạn, lên cấp) + SSE realtime | BE | L | P0 |
| TL-704 | Chuông thông báo + trang thông báo | FE | M | P0 |
| TL-705 | XP/Level/huy hiệu (check-in, viết bài, review) | BE | M | P1 |
| TL-706 | Meilisearch cho search (sync qua outbox/job) nếu trigram chưa đủ | BE/OPS | L | P1 |

## Kết nối du lịch (bổ sung 26/09/2026 – §10b)

| ID | Task | Loại | Ước lượng | Ưu tiên |
|---|---|---|---|---|
| TL-710 | ✅ Danh bạ nhà cung cấp: model, API list/detail/contact/request, trang `/connect` + chi tiết | BE/FE | L | P0 |
| TL-711 | ✅ Nhà cung cấp tự đăng ký + quản trị duyệt/từ chối/xác minh + "Dịch vụ của tôi" (BR-CONN-05/06/11/12) | BE/FE | L | P0 |
| TL-717 | Sửa dịch vụ đang hiển thị (đổi thông tin quan trọng → duyệt lại), tạm ẩn/mở lại | BE/FE | M | P1 |
| TL-718 | Tải ảnh bìa & thư viện ảnh khi đăng ký nhà cung cấp (cần TL-301 upload S3) | FE/BE | M | P1 |
| TL-719 | Thông báo email cho chủ hồ sơ khi được duyệt / bị từ chối; thông báo quản trị khi có hồ sơ mới | BE | S | P1 |
| TL-712 | Trang quản lý yêu cầu kết nối cho nhà cung cấp + thông báo (email/Zalo OA) khi có yêu cầu mới | BE/FE | L | P0 |
| TL-713 | ✅ Vote sao nhà cung cấp (chỉ người đã gửi yêu cầu) + BXH "Dịch vụ du lịch uy tín" (BR-CONN-07, BR-RANK-09) | BE/FE | M | P1 |
| TL-714 | ✅ Khối "Dịch vụ quanh đây" + "Lên kế hoạch" + "Địa điểm khác" trên trang địa điểm; lối sang Kết nối từ lịch trình (BR-CONN-08) | FE | S | P1 |
| TL-721 | Nội dung biên tập cho từng địa điểm (mô tả riêng, mẹo, mùa đẹp) thay mô tả theo khuôn | Nội dung | L | P0 |
| TL-722 | Ô quảng cáo nội bộ ở dải hai bên (≥ 1800px): giới thiệu nhà cung cấp đã xác minh, gắn nhãn "Được tài trợ", tắt được trong Cài đặt | WEB | M | P3 |
| TL-716 | Hero "Điểm đến mùa này" tự chọn theo tháng hiện tại từ trường "mùa đẹp nhất" + nội dung biên tập (tiêu đề, mô tả) cho từng điểm đến (BR-HOME-01) | BE/FE | M | P1 |
| TL-715 | Ảnh thật, gallery, bản đồ vị trí, giờ mở cửa cho nhà cung cấp | FE/BE | M | P1 |

## Phase 3 – Mobile (S8–S11)

| ID | Task | Loại | Ước lượng | Ưu tiên |
|---|---|---|---|---|
| TL-801 | Khởi tạo `apps/mobile` (Expo SDK mới nhất, expo-router, TS), dùng `@travelpad/*` | MB | M | P0 |
| TL-802 | Theme RN từ `design-tokens`, font Be Vietnam Pro | MB | M | P0 |
| TL-803 | Auth + SecureStore + `X-Client: mobile` | MB | M | P0 |
| TL-804 | Tabs: Khám phá · Bản đồ · Viết · Hành trình · Hồ sơ | MB | L | P0 |
| TL-901 | Bản đồ `@maplibre/maplibre-react-native`, check-in GPS + camera | MB | L | P0 |
| TL-1001 | Expo Push: lưu device token (`POST /me/devices`), gửi từ NotificationsModule | BE/MB | M | P0 |
| TL-1002 | Universal/App links: mở bài viết/địa điểm từ web sang app | MB/FE | M | P1 |
| TL-1101 | Offline cache, EAS Build/Submit, TestFlight + Play Internal | MB/OPS | L | P0 |

---

## Kế hoạch bổ sung tính năng

Xếp theo **giá trị ÷ công sức**. Đưa vào sprint khi Phase trước ổn định.

### Ưu tiên cao (Phase 4, Q2/2027)
1. **Lịch trình cá nhân hoá bằng AI**: người dùng chọn vùng, số ngày, sở thích (ăn uống, leo núi…), ngân sách
   → Claude sinh lịch trình dựa trên **dữ liệu địa điểm của chính TravelPad** (tool use gọi `places`/`map`), lưu thành Journey `planning`.
2. **Kiểm duyệt & quản trị**: báo cáo nội dung, hàng đợi duyệt, trang admin (quản lý địa điểm, gộp trùng, gắn featured).
3. **Đóng góp địa điểm từ cộng đồng**: người dùng đề xuất địa điểm mới → duyệt → điểm XP.
4. **PWA** cho web: cài lên màn hình chính, cache offline bài đã lưu.

### Ưu tiên trung bình
5. **Hành trình cộng tác**: nhiều người cùng lên kế hoạch một chuyến, chia chi phí.
6. **Bộ sưu tập (collections)**: "10 điểm cắm trại đẹp nhất miền Bắc" – người dùng/biên tập tạo, tốt cho SEO.
7. **Story/reel ảnh ngắn** theo hành trình đang đi.
8. **Thống kê cá nhân**: bản đồ tỉnh đã đi (63 tỉnh), số km, năm du lịch "wrapped".
9. **Đa ngôn ngữ nội dung**: dịch bài viết tự động (Claude) cho khách quốc tế.

### Kiếm tiền (khi có lượng người dùng)
10. Liên kết đặt phòng/tour (affiliate) trên trang địa điểm loại `stay`.
11. Gói Pro: bản đồ offline, lịch trình AI không giới hạn, xuất sổ tay PDF.
12. Trang doanh nghiệp (homestay, quán ăn) nhận review, trả phí để nổi bật (gắn nhãn rõ "Tài trợ").
