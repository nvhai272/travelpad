# Kiến trúc TravelPad

> Sổ tay du lịch: khám phá địa điểm, bản đồ quả cầu, hành trình, bài viết trải nghiệm, bạn bè.
> Web trước (SEO là ưu tiên), app mobile sau – **dùng chung một backend và các package TypeScript**.

## 1. Bức tranh tổng thể

```
                ┌──────────────────────┐        ┌──────────────────────┐
  Trình duyệt → │  apps/web  (Next.js) │        │ apps/mobile (Expo)   │ ← Phase 3
                │  SSR/ISR cho SEO     │        │ iOS + Android        │
                └─────────┬────────────┘        └──────────┬───────────┘
                          │   @travelpad/api-client (typed)  │
                          │   @travelpad/contracts  (zod)    │
                          ▼                                ▼
                ┌──────────────────────────────────────────────────────┐
                │        apps/api  (NestJS – modular monolith)         │
                │  REST /v1 · JWT · Swagger /docs · Throttler          │
                └──┬──────────────┬───────────────┬──────────────┬─────┘
                   ▼              ▼               ▼              ▼
             PostgreSQL 16     Redis 7        S3 (SeaweedFS    Mail (Mailpit
             + PostGIS         cache, queue,  dev / S3·R2      dev / SES…
             + pg_trgm         rate limit     prod)            prod)
```

**Nguyên tắc:**

1. **Một nguồn sự thật cho API contract**: `packages/contracts` (zod). Backend dùng để validate,
   frontend/mobile dùng để lấy type và validate form. Đổi contract → TypeScript báo lỗi ở mọi nơi dùng.
2. **Modular monolith** trước, không microservice. Mỗi module Nest là một bounded context có ranh giới rõ;
   khi cần tách (ví dụ search, notifications) thì tách theo module.
3. **Web render phía server** cho mọi trang công khai (trang chủ, địa điểm, bài viết, hồ sơ) → SEO tốt;
   dữ liệu cá nhân (đã thích, đã lưu) hydrate phía client.
4. **Chế độ khách là mặc định**: đọc/tìm kiếm không cần đăng nhập; hành động cá nhân mới yêu cầu đăng nhập.
5. **Docker-only**: host chỉ cần Docker. Không cài Node/pnpm/Postgres lên máy.

## 2. Cấu trúc thư mục

```
travelpad/
├── apps/
│   ├── api/                      NestJS 11 + Prisma 6
│   │   ├── prisma/               schema.prisma · migrations/ · seed.ts
│   │   └── src/
│   │       ├── main.ts           bootstrap: prefix /v1, helmet, CORS, Swagger
│   │       ├── app.module.ts     đăng ký module + guard toàn cục
│   │       ├── config/env.ts     validate biến môi trường (zod) – fail sớm
│   │       ├── prisma/           PrismaService (global)
│   │       ├── common/           guards · decorators · pipes (Zod) · filters · mappers/ · rating/ · cache/ · pagination.ts
│   │       └── modules/<feature>/  <feature>.module.ts · *.controller.ts · *.service.ts (mỗi service một trách nhiệm)
│   ├── web/                      Next.js 15 App Router + Tailwind v4 + next-intl
│   │   └── src/
│   │       ├── app/[locale]/     routes (vi không tiền tố, /en/...) · sitemap.ts · robots.ts
│   │       ├── components/ui/    primitive không nghiệp vụ (RatingPill, Chip, SectionHead, EditorialHero, Overlay, Switch…)
│   │       ├── components/layout/ header, footer, locale switcher
│   │       ├── features/<feature>/ components/ · hooks/ · load-*.ts – home, map, itinerary, connect, rating, rankings, places, posts, profile, settings, auth, app
│   │       ├── i18n/             routing + request config (next-intl)
│   │       └── lib/              api client server/client, site config
│   └── mobile/                   (Phase 3) Expo + expo-router
├── packages/
│   ├── contracts/                zod schema + type: auth, user, place, post, journey, search, map, settings
│   ├── api-client/               createApiClient() – fetch có type, dùng web + mobile
│   ├── design-tokens/            màu, font, spacing, radius (web CSS vars + RN)
│   ├── i18n/                     messages vi/en dùng chung
│   └── config/                   tsconfig base
├── infra/docker/dev.Dockerfile   image Node dùng cho mọi service dev
├── compose.yaml                  stack dev: postgres, redis, s3, mailpit, install, packages, api, web
├── scripts/check-structure.mjs   kiểm tra độ dài file & phân tầng (./dev check, CI)
├── dev                           CLI dev (./dev help)
└── docs/                         architecture · roadmap · backlog · design-system · conventions · adr/
```

### Quy tắc phụ thuộc (bắt buộc)

```
apps/*  ──►  packages/*          ✅
packages/contracts  ──► (chỉ zod) ✅
packages/*  ──►  apps/*          ❌ không bao giờ
apps/web  ──►  apps/api          ❌ chỉ nói chuyện qua HTTP + contracts
features/A  ──►  features/B      ⚠️  hạn chế; dùng chung thì đưa lên components/ hoặc lib/
```

## 3. Backend – các module

| Module | Trách nhiệm | Phase |
|---|---|---|
| `health` | liveness/readiness | ✅ 0 |
| `auth` | đăng ký, đăng nhập, refresh xoay vòng, đăng xuất; (sau) Google/Apple | ✅ 0 / 1 |
| `users` | hồ sơ, cấp độ/XP, cập nhật profile, `/me/settings` | ✅ 0 / 1 |
| `places` | danh sách + bộ lọc (vùng, loại, giá, sao), chi tiết, review | ✅ 0 / 1 |
| `search` | suggest (autocomplete), trending, lịch sử tìm kiếm | 1 |
| `posts` | feed, chi tiết, tạo/sửa, thích, lưu | ✅ 0 / 1 |
| `comments` | bình luận 2 cấp | 1 |
| `media` | presigned upload S3, resize (sharp) qua queue | 1 |
| `map` | ghim quả cầu (hot/mine), thẻ destination + hot spots, thời tiết | 2 |
| `checkins` | dấu chân "Của tôi" | 2 |
| `journeys` | hành trình + điểm dừng, "Lưu vào chuyến đi" | 2 |
| `friends` | kết bạn, bạn bè đang đi | 2 |
| `notifications` | in-app → push (Expo) | 2 / 3 |
| `gamification` | XP, level, huy hiệu | 2 |
| `moderation` / `admin` | báo cáo nội dung, ẩn bài, quản trị địa điểm | 4 |

**Luồng một request:** `Controller` (route + `ZodValidationPipe(schema từ contracts)`) → `Service` (nghiệp vụ,
transaction) → `PrismaService` → trả DTO qua `common/mappers` (**không bao giờ trả entity Prisma thô**).

**Lỗi**: luôn có dạng `ApiError { statusCode, code, message, details? }` (`AllExceptionsFilter`).
`code` là hằng số viết hoa (`PLACE_NOT_FOUND`) để client xử lý và dịch.

**Xác thực:**
- Access token JWT 15 phút (Bearer). Refresh token ngẫu nhiên 30 ngày, lưu **hash** trong DB, xoay vòng mỗi lần dùng.
- Web: refresh token ở cookie `httpOnly` `travelpad_rt` (path `/v1/auth`). Mobile: header `X-Client: mobile` → nhận trong body, lưu SecureStore.
- `JwtAuthGuard` toàn cục: mặc định route **cần đăng nhập**; route công khai đánh dấu `@Public()` (vẫn nhận biết user nếu có token → trả `viewer.liked/saved`).

## 4. Frontend web

- **Server Components** fetch qua `serverApi` (ISR `revalidate: 60`) → HTML đầy đủ cho bot.
- **Client Components** chỉ ở chỗ cần tương tác (thích, lưu, form, bản đồ, ô tìm kiếm) + TanStack Query.
- **Auth ở web**: access token giữ trong memory (React context), tự refresh bằng cookie khi 401.
  Chế độ khách: bấm hành động cá nhân → mở `LoginModal` (không chuyển trang).
- **i18n**: `next-intl`, `localePrefix: 'as-needed'` (vi: `/places/sa-pa`, en: `/en/places/sa-pa`), `hreflang` qua `alternates`.
- **SEO checklist**: `generateMetadata` mỗi trang · canonical · OG image · JSON-LD (`TouristAttraction` + `AggregateRating`,
  `Article`, `Person`) · `sitemap.xml` · `robots.txt` · Core Web Vitals (ảnh `next/image`, font `display: swap`).
- **Settings**: khách lưu `localStorage`; thành viên đồng bộ `PATCH /me/settings` (schema `UserSettingsSchema`).
- **Bản đồ**: MapLibre GL JS v5 (projection `globe` cho quả cầu 3D + chế độ 2D cho hành trình) – xem ADR-0005.
  Component bản đồ load bằng `dynamic(() => import(...), { ssr: false })` để không ảnh hưởng SEO/TTFB.

## 5. Dữ liệu

Xem `apps/api/prisma/schema.prisma`. Điểm đáng chú ý:

- `Place` phân cấp **destination → spot** (`parentId`): destination là ghim trên quả cầu (Sapa), spot là vị trí hot bên trong (Đỉnh Fansipan).
- `Place.geog` (PostGIS `geography(Point)`) do trigger `place_sync_geog` điền từ `lat/lng`; có GiST index → "gần tôi" dùng `ST_DWithin` qua `$queryRaw`.
- `Place.name` có GIN trigram index → autocomplete `ILIKE`/`similarity()` nhanh. Tìm không dấu: Phase 1 dùng `unaccent()` trong query; Phase 2 chuyển sang Meilisearch nếu cần typo-tolerance.
- Bộ đếm phi chuẩn hoá (`likeCount`, `commentCount`, `ratingAvg`, `reviewCount`, `hotScore`) cập nhật trong transaction hoặc job định kỳ.
- `User.settings` là JSON, validate bằng zod khi đọc/ghi.
- Postgres container dùng `POSTGRES_DB=postgres`; DB `travelpad` do Prisma tạo sạch (tránh drift với extension topology/tiger của image PostGIS).

## 6. Môi trường & triển khai

| Môi trường | Cách chạy |
|---|---|
| Dev | `./dev init` → `./dev up` (toàn bộ trong Docker, hot-reload) |
| Demo miễn phí | Web → Vercel, API → Render (Docker, `render.yaml`), DB → Neon. Chi tiết: [deploy.md](deploy.md) |
| Staging/Prod | `apps/api/Dockerfile`, `apps/web/Dockerfile` (multi-stage, `turbo prune`, Next standalone) → VPS + Docker Compose/Caddy, hoặc Fly.io/Render. DB: Postgres managed có PostGIS (Neon/Supabase/RDS). S3: Cloudflare R2. |
| CI | GitHub Actions: typecheck → lint → test → build image |

Quan sát (Phase 2): log JSON (pino), Sentry cho web + api, uptime check `/v1/health`.
