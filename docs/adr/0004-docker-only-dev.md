# ADR-0004: Môi trường dev chạy 100% bằng Docker

**Bối cảnh.** Không cài Node/pnpm/Postgres lên máy host; mọi người có môi trường giống hệt nhau.

**Quyết định.** `compose.yaml` chứa hạ tầng + service Node (`install` một lần, `packages` watch, `api`, `web`), image chung `infra/docker/dev.Dockerfile`.
Container Node chạy bằng UID/GID của host (file sinh ra thuộc về người dùng). CLI `./dev` bọc các lệnh thường dùng (không cần `make`).
pnpm store để trong repo (`.pnpm-store`, đã gitignore) để tránh lỗi quyền với named volume.

**Hệ quả.** (+) Onboarding: `./dev init && ./dev up`. (−) IDE cần `node_modules` trên host để gợi ý type – đã có vì repo được bind-mount;
lệnh lẻ phải chạy qua `./dev pnpm …`.
