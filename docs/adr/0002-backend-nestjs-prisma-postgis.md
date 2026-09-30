# ADR-0002: NestJS modular monolith + Prisma + PostgreSQL/PostGIS

**Bối cảnh.** Nghiệp vụ nhiều quan hệ (người dùng, địa điểm, bài viết, bạn bè) và nặng về địa lý (gần tôi, khoảng cách hành trình, ghim bản đồ).

**Quyết định.** NestJS 11 chia module theo nghiệp vụ trong một tiến trình. PostgreSQL 16 + PostGIS (geography, GiST) + pg_trgm (autocomplete).
Prisma cho CRUD/migration; truy vấn không gian dùng `$queryRaw`. Redis cho cache, rate limit, hàng đợi (BullMQ).

**Hệ quả.** (+) Một DB đủ cho quan hệ + địa lý + tìm kiếm cơ bản; dễ vận hành. (−) Prisma chưa hỗ trợ kiểu PostGIS
→ cột `geog` là `Unsupported` và do trigger điền; truy vấn không gian viết SQL tay.

**Đã cân nhắc.** MongoDB (geo tốt nhưng quan hệ/xã hội kém phù hợp); microservices (quá sớm); Drizzle (hợp lệ, nhưng Prisma migration/studio tiện hơn cho team nhỏ).
