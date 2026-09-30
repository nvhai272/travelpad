# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# TravelPad – hướng dẫn cho AI agent

Monorepo pnpm + Turborepo: `apps/api` (NestJS 11 + Prisma 6 + PostgreSQL/PostGIS), `apps/web` (Next.js 15 + Tailwind v4 + next-intl), `apps/mobile` (Expo – Phase 3, chưa làm), `packages/*` (`contracts` zod · `api-client` · `design-tokens` · `i18n` · `config`).

## Lệnh

**Mọi lệnh chạy qua Docker**: `./dev <lệnh>` (không cài/chạy node trên host). `./dev help` liệt kê tất cả.

- `./dev init` (lần đầu: .env, build image, cài deps, migrate, seed) · `./dev up` / `down` / `restart [api web]` / `logs api`
- `./dev check` – typecheck + `scripts/check-structure.mjs`. **Chạy trước khi xong việc** (CI chạy thêm `test` + `build`).
- `./dev typecheck` · `./dev lint` · `./dev build` · `./dev test` (chưa có test thật – `api` chỉ echo)
- `./dev pnpm --filter @travelpad/web add <pkg>` · `./dev sh` (shell trong container)
- DB: `./dev migrate-new <ten>` · `./dev migrate` · `./dev seed` · `./dev studio` (http://localhost:5555) · `./dev nuke` (xoá dữ liệu)
- `./dev shots` – chụp giao diện điện thoại bằng Playwright (ảnh 390×844 vào `.shots/`; biến `FULL=1`, `PAGES=/,/map`, `LOGIN_EMAIL`/`LOGIN_PASSWORD`)

URL: web http://localhost:3000 (tiếng Anh `/en`) · API http://localhost:4000/v1 · Swagger `/docs` · Mailpit :8025 · S3 (SeaweedFS) :8333.

`packages/*` được build ra `dist/` và app dùng bản build: service `packages` trong compose watch & rebuild khi `./dev up`; nếu chạy lệnh lẻ sau khi sửa package mà thấy type cũ, build lại (`./dev pnpm --filter './packages/*' build`).

## Kiến trúc

- Thêm/đổi endpoint theo thứ tự: `packages/contracts` (schema zod) → `apps/api` (controller + service + mapper) → `packages/api-client` (`resources/`, mỗi nhóm tài nguyên một file) → web/mobile.
- **API**: `Controller` (route + `ZodValidationPipe(schema từ contracts)`) → `Service` (nghiệp vụ, `$transaction` khi nhiều bảng) → Prisma → DTO qua `src/common/mappers` (không trả entity Prisma thô). Lỗi dạng `ApiError { statusCode, code, message, details? }` qua `AllExceptionsFilter`, `code` VIẾT_HOA. Dùng chung đặt ở `src/common/`; **không import chéo giữa các module** trong `src/modules/`.
- **Auth**: `JwtAuthGuard` toàn cục – route mặc định cần đăng nhập, công khai thì `@Public()` (vẫn nhận user nếu có token để trả `viewer.*`). Access JWT 15 phút; refresh token xoay vòng, lưu hash, ở web nằm trong cookie httpOnly `travelpad_rt`.
- **Web**: Server Component mặc định, gọi API qua `serverApi` (`lib/api.ts`, ISR 60s, bọc `safe()` để trang không sập khi API tắt); Client Component chỉ khi cần tương tác, dùng `browserApi` (`lib/browser-api.ts`, token trong memory) + TanStack Query. Code theo tính năng ở `features/<tên>/{components,hooks}` + `load-*.ts`; UI dùng chung ở `components/ui/` (tìm ở đây trước khi viết mới). Bản đồ MapLibre load bằng `dynamic(..., { ssr: false })`.
- **i18n**: next-intl, `localePrefix: 'as-needed'` (vi không prefix, en `/en`). Chuỗi UI ở `packages/i18n/src/messages/<lang>/*.ts`, key được TypeScript kiểm tra – không hard-code chữ. Màu qua token (`primary`, `accent`, `background`, `foreground`, `rating`, `map-*`…).
- **DB**: sửa `apps/api/prisma/schema.prisma` → `./dev migrate-new <ten>` → commit cả migration. `Place` phân cấp destination → spot (`parentId`). Cột `Place.geog` do trigger điền từ `lat/lng` – không ghi trực tiếp; truy vấn không gian dùng `$queryRaw` + `ST_DWithin`. Seed: `prisma/seed/data/` (dữ liệu thuần) tách khỏi `steps/` (ghi DB).

## Quy tắc bắt buộc (`./dev check` tự kiểm tra – docs/conventions.md §Cấu trúc code)

- Page `app/**/page.tsx` ≤ 100 dòng, component `.tsx` ≤ 150, file `.ts` ≤ 200 – gần chạm thì tách theo trách nhiệm, không nén code.
- `*.module.ts` chỉ khai báo `@Module`; controller/service tách file; controller không import `PrismaService`.
- `packages/*` không phụ thuộc `apps/*`; web không import `@travelpad/api` – chỉ gọi qua `@travelpad/api-client`.
- Logic web vào `hooks/`, UI dùng chung vào `components/ui/`.
- Giao diện điện thoại: mobile-first, kiểm tra bằng `./dev shots` – quy tắc ở docs/conventions.md §Giao diện điện thoại.

## Nghiệp vụ, chữ & tài liệu

- Nghiệp vụ: `docs/business-rules.md` – tham chiếu mã `BR-xxx` trong comment khi code một quy tắc.
- Chữ hiển thị (giọng văn, thuật ngữ, định dạng số/tiền): `docs/content-style.md` – không dùng "vote" trong chữ tiếng Việt.
- Commit Conventional Commits, scope `api|web|mobile|contracts|api-client|tokens|i18n|infra|docs`; nhánh `feat/TL-xxx-…`.
- Tài liệu: `docs/architecture.md`, `docs/conventions.md`, `docs/backlog.md` (ID task `TL-xxx`), `docs/roadmap.md`, `docs/adr/`.
