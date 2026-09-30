# ADR-0003: Next.js App Router (SSR/ISR) cho web

**Bối cảnh.** SEO là yêu cầu chính: trang địa điểm, bài viết phải được index, có rich result (sao đánh giá).

**Quyết định.** Next.js 15 App Router. Trang công khai là Server Components + ISR 60s; `generateMetadata`, JSON-LD, sitemap, hreflang.
Tailwind v4 cho style, next-intl cho i18n (vi mặc định không tiền tố), TanStack Query cho phần tương tác.

**Hệ quả.** (+) HTML đầy đủ cho bot, TTFB tốt nhờ cache. (−) Phải tách rõ server/client component; bản đồ load client-only.

**Đã cân nhắc.** Vite SPA (như bản Lovable) – SEO kém; Remix/React Router 7 – ổn nhưng hệ sinh thái Next (ảnh, OG, metadata) tiện hơn.
