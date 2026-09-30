# ADR-0001: Monorepo pnpm + Turborepo, TypeScript end-to-end

**Bối cảnh.** Làm web trước, app mobile sau, cùng một backend. Cần tránh lệch kiểu dữ liệu giữa 3 phía.

**Quyết định.** Một repo, pnpm workspaces + Turborepo. TypeScript cho cả api, web, mobile. Package dùng chung:
`contracts` (zod – nguồn sự thật API), `api-client`, `design-tokens`, `i18n`, `config`.

**Hệ quả.** (+) Đổi contract là lỗi biên dịch ở mọi nơi; tái dùng logic/bản dịch/token cho mobile; một PR cho thay đổi xuyên suốt.
(−) Cần kỷ luật ranh giới phụ thuộc; build packages trước khi chạy app (đã tự động qua service `install`/`packages`).

**Đã cân nhắc.** Backend Java/Spring hoặc Go: mạnh nhưng mất khả năng chia sẻ type/validation với FE/mobile.
Nx: nhiều tính năng hơn nhưng nặng hơn nhu cầu hiện tại.
