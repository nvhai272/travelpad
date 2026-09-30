# TravelPad – Sổ tay du lịch

> Tên hiển thị: **TravelPad** · định danh kỹ thuật (tên miền, package, DB, Docker): `travelpad`

Khám phá địa điểm, bản đồ quả cầu, lưu hành trình, đọc và viết trải nghiệm du lịch thật.
**Web trước** (SEO-first, Next.js) → **app mobile sau** (Expo), dùng chung backend NestJS và các package TypeScript.

## Chạy dự án (chỉ cần Docker)

```bash
./dev init     # lần đầu: tạo .env, build image, cài deps, migrate, seed
./dev up       # chạy toàn bộ stack
./dev help     # xem mọi lệnh
```

| Dịch vụ | URL |
|---|---|
| Web | http://localhost:3000 (tiếng Anh: `/en`) |
| API | http://localhost:4000/v1 · Swagger http://localhost:4000/docs |
| Mailpit | http://localhost:8025 |
| S3 (SeaweedFS) | http://localhost:8333 |
| Prisma Studio | `./dev studio` → http://localhost:5555 |

Lệnh hay dùng: `./dev check` (typecheck + cấu trúc) · `./dev shots` (chụp giao diện điện thoại) · `./dev logs api` · `./dev pnpm --filter @travelpad/web add <pkg>` · `./dev migrate-new <ten>` · `./dev typecheck` · `./dev sh` · `./dev nuke` (xoá dữ liệu).

## Cấu trúc

```
apps/api        NestJS 11 + Prisma 6 + PostgreSQL/PostGIS
apps/web        Next.js 15 + Tailwind v4 + next-intl
apps/mobile     (Phase 3) Expo
packages/       contracts (zod) · api-client · design-tokens · i18n · config
docs/           kiến trúc · lộ trình · backlog · design system · quy ước · ADR
```

## Tài liệu
- [Đặc tả nghiệp vụ](docs/business-rules.md) – quy tắc từng chức năng (mã BR-xxx), ma trận quyền khách/thành viên, câu hỏi mở
- [Kiến trúc](docs/architecture.md) – tổng thể, thư mục, module, dữ liệu, triển khai
- [Deploy miễn phí](docs/deploy.md) – Vercel + Render + Neon: giải thích công nghệ, điểm mạnh/yếu, hướng dẫn từng bước
- [Lộ trình](docs/roadmap.md) – Phase 0→4 theo sprint
- [Backlog](docs/backlog.md) – task chi tiết theo sprint + kế hoạch bổ sung tính năng
- [Design system](docs/design-system.md) · [Design review #01](docs/design-review-01.md) · [#02](docs/design-review-02.md) · [Mobile](docs/design-review-mobile.md) · [Quy ước](docs/conventions.md) · [ADR](docs/adr/README.md)
