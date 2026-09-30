# Quy ước làm việc

## Git
- Nhánh chính `main` (luôn deploy được). Nhánh tính năng: `feat/TL-123-bo-loc-dia-diem`, sửa lỗi `fix/…`, `chore/…`.
- Commit theo Conventional Commits: `feat(web): bộ lọc đa tiêu chí trang địa điểm`, `fix(api): …`. Scope: `api|web|mobile|contracts|api-client|tokens|i18n|infra|docs`.
- PR nhỏ (< ~400 dòng), có mô tả + ảnh chụp UI; CI xanh mới merge (squash).

## API
- Prefix `/v1`, danh từ số nhiều (`/places`, `/posts/:id/comments`), `kebab-case` cho path.
- Toggle idempotent dùng `PUT`/`DELETE` (`PUT /posts/:id/like`).
- Phân trang cursor: `?cursor&limit` → `{ items, nextCursor }`. Bộ lọc nhiều giá trị: CSV (`category=camping,hiking`).
- Lỗi: `{ statusCode, code, message, details? }`; `code` viết HOA_GẠCH_DƯỚI, message tiếng Việt (client có thể dịch theo `code`).
- Thêm endpoint: **(1)** schema trong `packages/contracts` → **(2)** controller/service + mapper → **(3)** method trong `api-client` → **(4)** dùng ở web/mobile.
- Đổi DB: sửa `schema.prisma` → `./dev migrate-new ten_thay_doi` → commit cả migration.

## Cấu trúc code (clean code) – bắt buộc, `./dev check` tự kiểm tra

**Giới hạn độ dài** (vượt → CI đỏ, script `scripts/check-structure.mjs`):

| Loại file | Tối đa |
|---|---|
| Trang Next.js `app/**/page.tsx` | 100 dòng – chỉ tải dữ liệu + ghép component |
| Component `.tsx` | 150 dòng |
| Module `.ts` (service, hook, util, data) | 200 dòng |

Gần chạm giới hạn thì **tách theo trách nhiệm**, không nén code cho vừa.

**Backend (NestJS) – mỗi file một vai trò:**
- `*.module.ts` chỉ khai báo `@Module`; `*.controller.ts` (HTTP: route, validate, gọi service); `*.service.ts` (nghiệp vụ, transaction).
- Controller **không** import `PrismaService` – luôn qua service.
- Một service một trách nhiệm: đọc dữ liệu (`places.service`) tách khỏi ghi/tính toán (`place-rating.service`, `review-helpful.service`).
- Dùng chung đặt ở `src/common/`: `mappers/` (entity → DTO), `rating/` (tính điểm sao), `pagination.ts`, `cache/`. **Không** import chéo giữa các module trong `modules/`.

**Web (Next.js) – theo tính năng:**
```
features/<tính-năng>/
  components/   component giao diện, mỗi file một component chính
  hooks/        state + side-effect (use-*.ts) – component không gọi API trực tiếp nếu logic > vài dòng
  *.ts          hàm thuần: tải dữ liệu (load-*.ts), dựng JSON-LD, hằng số, bộ lọc
components/ui/  primitive dùng chung không có nghiệp vụ (RatingPill, Chip, SectionHead, EditorialHero…)
lib/            hạ tầng: api client, hooks chung (use-search-history), xử lý text
```
- Trước khi viết UI mới, tìm trong `components/ui/` – **không** chép lại huy hiệu sao, chip, tiêu đề mục…
- Key dịch được TypeScript kiểm tra (`i18n/messages.d.ts`): sai key là lỗi biên dịch.

**Giao diện điện thoại** (xem `docs/design-review-mobile.md`):
- Thiết kế mobile-first; kiểm tra bằng `./dev shots` (ảnh 390×844 vào `.shots/`, `FULL=1` chụp cả trang, `LOGIN_EMAIL`/`LOGIN_PASSWORD` để chụp khi đăng nhập).
- Danh sách thẻ phụ trên trang tổng hợp dùng `ScrollRow` (vuốt ngang trên điện thoại, lưới từ `sm`).
- Bộ lọc / menu phụ trên điện thoại dùng `Overlay variant="bottom"` (bảng trượt từ dưới), không nhồi vào trang.
- Hành động chính của trang chi tiết đặt trong thanh cố định trên thanh tab (xem `ProviderMobileCta`).
- Vùng chạm ≥ 44px cho hành động chính; ô nhập 16px trên điện thoại (đã có CSS toàn cục); chừa `env(safe-area-inset-bottom)`.

**Package dùng chung:** `packages/*` không phụ thuộc `apps/*`; web chỉ nói chuyện với API qua `@travelpad/api-client` (mỗi nhóm tài nguyên một file trong `resources/`).

**Seed:** `apps/api/prisma/seed/` – `data/` (dữ liệu thuần) tách khỏi `steps/` (ghi DB); `index.ts` chỉ điều phối thứ tự.

## Code
- TypeScript strict, không `any` (dùng `unknown` + zod). Tên file `kebab-case.ts(x)`; component `PascalCase`.
- Web: Server Component mặc định, chỉ thêm `'use client'` khi cần state/tương tác. Chuỗi hiển thị qua `next-intl` – không hard-code.
- Backend: không trả entity Prisma thô; mọi input đi qua `ZodValidationPipe`; logic nhiều bảng dùng `$transaction`.
- Comment giải thích **tại sao**, không mô tả lại code.

## Test
- `contracts`, `api-client`: unit (Vitest).
- `api`: unit service + e2e controller với Postgres thật (docker).
- `web`: Playwright cho luồng chính; component test khi logic phức tạp (bộ lọc, tìm kiếm).
