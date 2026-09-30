# Design system TravelPad

**Tên thương hiệu**: hiển thị "TravelPad" (Be Vietnam Pro, như tiêu đề); logo chữ (không kèm ô biểu tượng): "TravelPad" – **chữ "T" là cây lúa** (thân xanh, hai bông lúa chín vàng rủ xuống làm nét ngang), (Lora, xanh lá; **chữ "l" là thân tre vươn cao hơn các chữ khác** – thân liền, 3 đốt mảnh, 2 lá) + đường kẻ và "VIỆT NAM" (vàng đồng; **dấu mũ chữ "Ệ" là chiếc nón lá**) – nét phụ ở `brand-glyphs.tsx`, cùng màu với chữ – `BrandLockup` trong `components/brand/brand-mark.tsx`, đọc là "TravelPad Việt Nam". Favicon (`app/icon.svg`): **cây tre** màu kem trên ô xanh lúa. Ô Chùa Một Cột `BrandBadge` để dành cho icon app, icon app, ảnh đại diện. Nguyên tắc: **1 hình, 2 màu (xanh + vàng)**, không thêm chi tiết minh họa vào logo. Không viết "travelpad" trên giao diện – đó là định danh kỹ thuật.

Phong cách **tạp chí du lịch ấm áp, hiện đại**, bám sát bản Lovable "Wander Logbook" (đã đối chiếu class/token gốc).
Nguồn token: `apps/web/src/app/globals.css` (oklch gốc) · `packages/design-tokens` (hex tương đương cho mobile).

## Màu (chế độ sáng là mặc định)

| Token | oklch | hex ≈ | Dùng cho |
|---|---|---|---|
| `background` | 96.5% .012 79 | `#F8F3EB` | nền giấy kem |
| `card` | 99% .008 80 | `#FFFBF6` | thẻ, sheet, dialog |
| `foreground` / `muted-foreground` | 22% .025 55 / 50% .03 55 | `#24180F` / `#715F53` | chữ chính / phụ |
| `secondary` | 92% .018 78 | `#EBE3D8` | chip, ô tìm kiếm, hover |
| `border` | 85% .024 75 | `#D7CCBD` | viền |
| `primary` | 42% .085 155 | `#1E5A38` | xanh rừng: nút chính, logo, nav đang chọn |
| `accent` | 66% .15 46 | `#DB7039` | cam hổ phách: eyebrow, banner khách, badge, CTA phụ |
| `rating` / `rating-foreground` | 92% .09 78 / 48% .12 50 | `#FFDEA0` / `#91450D` | huy hiệu sao |
| `map-surface` / `map-accent` / `map-muted` | 26% .04 155 / 74% .14 58 / 80% .03 150 | `#132A1B` / `#EC9247` / `#B1C4B4` | panel quả cầu |
| `hero-*` | | | chữ, chip kính mờ trên ảnh hero |

Chế độ tối: tuỳ chọn trong Cài đặt (`data-theme="dark"` trên `<html>`), **không** tự bật theo hệ điều hành.

## Chữ
- **Display**: Lora 500–600 (serif, giữ chất tạp chí), `letter-spacing -0.01em` – hero `text-5xl sm:text-7xl leading-[1.08]`, h2 `text-3xl`, tiêu đề thẻ `text-xl`.
- **Body/UI**: Be Vietnam Pro 400–600 – 14–16px. Font do người Việt thiết kế, dấu vẽ riêng; chữ nhiều dấu chồng (ẩ, ệ, ỗ) cần line-height ≥ 1.05.
- **Eyebrow** (`.eyebrow`): 0.68rem, đậm 700, `tracking .14em`, in hoa, màu `accent`. Hero eyebrow có gạch ngang 32px phía trước.
- "Cỡ chữ lớn" trong Cài đặt → `html[data-large-text=true]` 108%.

## Bố cục
- Khung `max-w-[1480px]`, gutter `px-4 sm:px-6 lg:px-10`.
- Trang chủ desktop: lưới 12 cột – **7 cột** (hero + địa điểm nổi bật 2 cột) · **5 cột** aside (quả cầu, bài cộng đồng, bạn bè, cá nhân).
- Mobile: ô tìm kiếm xuống dòng dưới header; thanh điều hướng nổi dưới đáy 5 mục (nút + ở giữa); khoảng trống đáy trang cho nav.

## Bề mặt & hiệu ứng
- Thẻ: `rounded-2xl border bg-card shadow-editorial` (bóng rất mềm, lệch xuống).
- Popover/nav nổi: `shadow-mobile` + `backdrop-blur-xl`, mở bằng `animate-scale-in`.
- Ảnh hero: gradient `bg-hero-overlay` tối dần về đáy; hover zoom nhẹ `scale-[1.02]`.
- Ghim quả cầu: vòng `animate-ping` cho ghim đang chọn (tắt khi Tiết kiệm dữ liệu / reduced-motion).

## Component (vị trí code)
| Component | File |
|---|---|
| Header + nav pill + tìm kiếm + cài đặt + chip hồ sơ | `components/layout/site-header.tsx` |
| Nav nổi mobile | `components/layout/mobile-nav.tsx` |
| Bản đồ 2D (lịch trình, địa điểm gần đây) | `features/map/components/route-map.tsx` |
| Dịch vụ tại điểm đến (4 nhóm, top 5 theo sao) | `features/connect/components/destination-services.tsx` |
| Banner khách · Thẻ khoá thành viên | `components/layout/guest-banner.tsx` · `components/ui/locked-card.tsx` |
| Tìm kiếm thông minh + bộ lọc | `features/search/smart-search.tsx` |
| Quả cầu hành trình | `features/map/globe-map.tsx` |
| Thẻ địa điểm | `features/places/components/place-card.tsx` |
| Bài cộng đồng (thích/lưu optimistic) | `features/posts/components/community-post-card.tsx` |
| Bạn bè đang đi · Cá nhân | `features/profile/components/member-cards.tsx` |
| Hộp đăng nhập · Cài đặt (sheet phải) | `features/auth/auth-dialog.tsx` · `features/settings/settings-sheet.tsx` |

## Nguyên tắc
- Khách xem được mọi thứ công khai; hành động cá nhân gọi `requireAuth()` → mở hộp đăng nhập tại chỗ, đăng nhập xong **tự chạy tiếp hành động**.
- Chạm ≥ 40px; ảnh luôn có `alt`; tôn trọng `prefers-reduced-motion`.
- Không hard-code chuỗi UI – mọi chữ qua `packages/i18n`.

## Bản sắc Việt Nam
- **Hoa văn trống đồng Đông Sơn** (`components/brand/dong-son-pattern.tsx`): họa tiết nền mờ (độ mờ 7–10%) ở khối chào mừng và chân trang – không dùng quá 2 chỗ/trang để khỏi rối.
- **Màu**: xanh lúa `primary` (ruộng bậc thang) · **đỏ son** `accent` (sơn mài, câu đối) cho nhãn nhỏ, số thứ tự · **đỏ cờ – vàng sao** `vn-red` / `vn-gold` cho hạng 1.
- **Quốc kỳ** (`components/brand/vn-flag.tsx`): chỉ dùng nơi mang nghĩa quốc gia – nút chọn "Tiếng Việt", dòng "Làm tại Việt Nam". **Không** dùng làm logo, họa tiết, nền hay biểu tượng trang trí (tôn trọng biểu tượng quốc gia).
- Vẽ bằng SVG, không dùng emoji cờ (Windows không hiển thị emoji cờ).
- **Biểu tượng miền** (`features/map/components/region-icon.tsx`): Bắc – ruộng bậc thang · Trung – nón lá · Tây Nguyên – nhà rông · Nam & biển đảo – thuyền thúng. Dùng trên chip lọc Khu vực và trên quả cầu (chạm để lọc theo miền, chạm lại để bỏ).
- **Khám phá theo miền** (trang Văn hóa, `features/home/components/regions-section.tsx`): 4 thẻ ảnh địa danh thật (Mù Cang Chải, Hội An, hồ Tuyền Lâm, Cái Răng) → `/map?region=…`.
- **Ảnh polaroid hai lề** (`components/decor/`): ảnh thật địa danh – món ăn như trang sổ tay dán ảnh (khung giấy, băng keo, chú thích viết tay Dancing Script, nghiêng nhẹ, nối bằng đường chấm). Lề trái miền Bắc (Văn Miếu, Hồ Gươm, vịnh Hạ Long, Mù Cang Chải, phở), lề phải miền Trung – Nam (Hội An, Cầu Vàng, mì Quảng, chợ Bến Thành, chợ nổi Cái Răng). Bồng bềnh nhẹ, hiện dần (chỉ khi `motion-safe`); rê chuột dựng thẳng + hiện ghi công. Chỉ hiện khi màn hình ≥ 1560px, nằm trong lề ngoài khung nội dung; điện thoại/laptop không hiện. Không dùng quốc kỳ; không dùng hình vẽ minh hoạ tự vẽ (đã thử, kém ảnh thật).
- **Ảnh bìa nhà cung cấp** (`features/connect/components/provider-cover.tsx`): chưa có ảnh riêng thì hiện ô biểu tượng theo loại dịch vụ trên nền hoa văn – **không mượn ảnh điểm đến** (người xem dễ tưởng là ảnh thật của cơ sở).
- **Ảnh thật**: Wikimedia Commons, chỉ nhận CC0 / Public domain / CC BY / CC BY-SA; lưu ở `public/images/places/<slug>.jpg` (≤ 1600px, JPEG q80). Mỗi ảnh **bắt buộc** có dòng ghi công trong `lib/photo-credits.ts`; ảnh lớn tự hiện "Ảnh: tác giả · giấy phép", trang `/credits` liệt kê đủ. Tránh ảnh cận mặt người lạ.
