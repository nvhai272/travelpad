# Deploy miễn phí: Vercel + Render + Neon

> Báo cáo công nghệ và hướng dẫn đưa TravelPad lên Internet với **0 đồng, không cần thẻ thanh toán**.
> Số liệu gói miễn phí là ở thời điểm viết (09/2026) – các dịch vụ có thể đổi, xem lại trang giá của họ trước khi dựa vào.

## 1. Tóm tắt

| Phần | Chạy ở đâu | Vì sao |
|---|---|---|
| Web (Next.js) | **Vercel** – gói Hobby | Nhà làm ra Next.js; có CDN, ISR sẵn, gần như không cần cấu hình |
| API (NestJS) | **Render** – gói Free, dạng Docker | Chạy nguyên Dockerfile có sẵn, không phải viết lại code |
| Database (PostgreSQL + PostGIS) | **Neon** – gói Free | Postgres "đám mây" miễn phí, có đủ `postgis`, `unaccent`, `pg_trgm` mà schema cần |

```
                 Người dùng (trình duyệt, điện thoại)
                              │  https://travelpad.vercel.app
                              ▼
   ┌──────────────── Vercel (CDN toàn cầu + server Singapore) ────────────────┐
   │  Trang HTML đã dựng sẵn (ISR) · JS/CSS/ảnh tĩnh                          │
   │  /v1/*  ──(proxy, cùng domain)──┐                                        │
   └─────────────────────────────────┼────────────────────────────────────────┘
                                     ▼
                  Render – API NestJS (Singapore, container Docker)
                                     │  Prisma, SSL
                                     ▼
                   Neon – PostgreSQL + PostGIS (Singapore)
```

Không gộp web + API vào một container: Vercel không chạy container, và gói free của Render chỉ có 512 MB RAM – hai tiến trình Node chung một chỗ dễ hết bộ nhớ.

## 2. Các khái niệm cần nắm

### CDN (Content Delivery Network – mạng phân phối nội dung)
Một mạng lưới máy chủ đặt ở rất nhiều thành phố trên thế giới. Khi bạn deploy, Vercel copy các file tĩnh (JS, CSS, ảnh, trang HTML đã dựng sẵn) ra tất cả các điểm đó. Người ở Hà Nội tải từ máy gần nhất (Singapore/Hồng Kông) chứ không phải từ Mỹ.
- **Mạnh**: trang mở nhanh ở mọi nơi; chịu được lượng truy cập lớn vì phần lớn request không chạm tới server của mình.
- **Yếu**: chỉ áp dụng cho nội dung "giống nhau cho mọi người". Dữ liệu riêng của từng người (đã thích, đã lưu) vẫn phải hỏi API.

### SSR, SSG và ISR – ba cách dựng trang của Next.js
- **SSR** (Server-Side Rendering): mỗi lần có người mở trang, server gọi API rồi dựng HTML. Luôn mới nhất nhưng chậm hơn và tốn tài nguyên server.
- **SSG** (Static Site Generation): dựng HTML **một lần lúc build**, sau đó chỉ phát file tĩnh qua CDN. Rất nhanh nhưng dữ liệu "đóng băng" đến lần build sau.
- **ISR** (Incremental Static Regeneration): kết hợp hai cái trên. Trang được dựng sẵn và phát qua CDN như SSG, nhưng có "hạn dùng" – TravelPad đặt **60 giây** (`next: { revalidate: 60 }` trong `apps/web/src/lib/api.ts`). Hết hạn, người tiếp theo **vẫn nhận ngay bản cũ**, còn Vercel lặng lẽ dựng bản mới ở nền để thay.
  - **Mạnh**: nhanh như trang tĩnh, dữ liệu vẫn tự cập nhật; tốt cho SEO (Google đọc được HTML đầy đủ). Đặc biệt hợp với gói free: **khi API trên Render đang ngủ, khách vẫn thấy trang ngay** vì CDN phát bản đã dựng.
  - **Yếu**: dữ liệu có thể trễ tối đa ~60 giây (ví dụ số sao vừa chấm chưa hiện ngay trên trang công khai).

### Serverless và container
- **Serverless** (cách Vercel chạy phần server của Next.js): không có máy chủ chạy liên tục; mỗi request bật một "hàm" nhỏ, xong thì tắt. Bạn không quản lý máy, trả tiền (hoặc dùng free) theo lượt chạy. Hợp với web, không hợp với API cần giữ kết nối DB lâu dài như NestJS + Prisma.
- **Container** (cách Render chạy API): đóng gói ứng dụng + môi trường (Node, thư viện) thành một **image Docker** – chính file `apps/api/Dockerfile`. Chạy ở đâu cũng giống nhau, giống hệt lúc test ở máy.

### "Ngủ" (sleep) và cold start
Gói free của Render **tắt container sau ~15 phút không có request**. Request tiếp theo phải chờ Render bật lại container (**cold start**, khoảng 30–60 giây), sau đó chạy bình thường. Neon cũng tạm dừng database khi rảnh (~5 phút) nhưng thức dậy gần như tức thì (dưới 1 giây).
- Ảnh hưởng thực tế: trang công khai vẫn hiện nhờ ISR; nhưng **đăng nhập, thích, lưu, viết đánh giá** ở lần đầu sau khi ngủ sẽ quay chờ lâu.
- Đã chấp nhận ở giai đoạn này – cách chống ngủ ghi ở §7.

### Neon là gì
Dịch vụ **PostgreSQL chạy trên đám mây** (managed): bạn không cài, không backup, không vá lỗi – Neon lo. Điểm khác các dịch vụ Postgres thường:
- **Tách lưu trữ và tính toán**: dữ liệu nằm trên kho lưu trữ riêng, còn "máy tính toán" chỉ bật khi có truy vấn → vì vậy Neon cho free được và tự ngủ khi rảnh.
- **Branching**: tạo bản sao database trong vài giây (như nhánh git) để thử migration mà không đụng dữ liệu thật.
- Là Postgres "thật" nên Prisma, PostGIS, trigger `place_sync_geog`… chạy y như ở máy dev.
- **Yếu**: gói free giới hạn dung lượng (~0.5 GB – dư cho dữ liệu chữ của TravelPad, **không** dùng để chứa ảnh) và số giờ tính toán mỗi tháng; truy vấn đầu tiên sau khi ngủ chậm hơn chút.

### Proxy `/v1` và cookie "cùng domain"
Refresh token của web nằm trong cookie httpOnly `travelpad_rt`. Nếu trình duyệt gọi thẳng `travelpad-api.onrender.com` từ trang `travelpad.vercel.app` thì đó là cookie **khác domain** – nhiều trình duyệt (Safari, chế độ ẩn danh) chặn, người dùng bị đăng xuất liên tục. Vì vậy web gọi `/v1/...` trên chính domain Vercel, Vercel chuyển tiếp (proxy/rewrite) sang Render. Với trình duyệt, API và web là **một domain** → cookie hoạt động bình thường, không cần cấu hình CORS phức tạp.

## 3. Đánh giá từng dịch vụ

### Vercel – gói Hobby
| Mạnh | Yếu |
|---|---|
| Hỗ trợ Next.js tốt nhất (ISR, tối ưu ảnh, font) | Gói Hobby **chỉ cho mục đích cá nhân, phi thương mại** – kinh doanh thật phải lên Pro |
| CDN toàn cầu, HTTPS tự động, domain `*.vercel.app` miễn phí | Giới hạn băng thông và số lần tối ưu ảnh (`next/image`) mỗi tháng |
| Push GitHub là tự deploy; mỗi Pull Request có link xem trước | Server chỉ chạy ở 1 vùng (đã chọn Singapore `sin1`) |

### Render – gói Free
| Mạnh | Yếu |
|---|---|
| Chạy Docker → dùng lại `apps/api/Dockerfile`, không đổi code | **Ngủ sau ~15 phút**, cold start 30–60 giây |
| Cấu hình bằng file `render.yaml` (Blueprint), tự deploy khi push | 512 MB RAM, CPU yếu; build Docker chậm (vài phút) |
| Có vùng Singapore, HTTPS tự động, log xem trên web | 750 giờ chạy/tháng cho cả tài khoản (đủ cho 1 service) · không có bước pre-deploy → migration chạy lúc khởi động container |

### Neon – gói Free
| Mạnh | Yếu |
|---|---|
| Postgres thật, có PostGIS/unaccent/pg_trgm | ~0.5 GB dung lượng, giới hạn giờ tính toán |
| Không cần thẻ, tạo trong 1 phút, có vùng Singapore | Tự ngủ khi rảnh (thức rất nhanh) |
| Branching, sao lưu/khôi phục theo thời điểm (giới hạn ngắn ở gói free) | Không dành cho lưu file/ảnh |

## 4. Những gì đã chuẩn bị trong repo

| File | Thay đổi |
|---|---|
| `render.yaml` | Blueprint cho Render: service `travelpad-api`, Docker, gói free, vùng Singapore, health check `/v1/health`, tự sinh JWT secret |
| `apps/api/Dockerfile` | Sửa lỗi build (postinstall Prisma chạy khi chưa có schema); container **tự chạy `prisma migrate deploy`** trước khi bật API |
| `apps/api/package.json` | `prisma` chuyển sang `dependencies` để image production chạy được migration |
| `apps/api/src/main.ts`, `config/env.ts` | Biến `TRUST_PROXY` – sau proxy, rate limit tính theo IP thật của từng người thay vì gộp chung IP của Vercel |
| `apps/web/vercel.json` | Lệnh build monorepo (build `packages/*` trước rồi mới build web), vùng `sin1` |
| `apps/web/next.config.ts` | Khi `NEXT_PUBLIC_API_URL=/v1`: proxy `/v1/*` sang `API_INTERNAL_URL` |
| `apps/web/src/middleware.ts` | next-intl bỏ qua `/v1/` để không biến đường proxy thành trang `/vi/v1/...` |
| `packages/api-client/src/http.ts` | Chấp nhận `baseUrl` tương đối (`/v1`) |
| `dev` | Lệnh `./dev prod-migrate` và `./dev prod-seed` chạy lên DB Neon từ máy mình |

Đã kiểm tra ở máy: build image API production → chạy với database trống (migration tự áp, bật PostGIS) → seed → đăng nhập qua proxy `/v1` của web, trình duyệt giữ được phiên.

## 5. Hướng dẫn từng bước

Chuẩn bị: code đã **commit và push lên GitHub** (Render và Vercel đọc code từ GitHub). Cả ba dịch vụ đều đăng ký bằng nút "Continue with GitHub".

### Bước 1 – Neon: tạo database
1. Vào https://neon.tech → Sign up bằng GitHub.
2. **Create project**: tên `travelpad`, Postgres bản mới nhất, **Region: Asia Pacific (Singapore)**.
3. Ở **Connect / Connection string**: **tắt "Connection pooling"** (lấy chuỗi Direct), copy chuỗi dạng
   `postgresql://<user>:<mật-khẩu>@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`
4. Giữ chuỗi này bí mật (có mật khẩu). Không cần bật extension thủ công – migration `init` tự `CREATE EXTENSION`.

### Bước 2 – Render: chạy API
1. Vào https://render.com → Sign up bằng GitHub, cho phép truy cập repo `travelpad`.
2. **New → Blueprint** → chọn repo → Render đọc `render.yaml`.
3. Nhập biến được hỏi:
   - `DATABASE_URL` = chuỗi Neon ở bước 1
   - `CORS_ORIGINS` = tạm điền `https://travelpad.vercel.app` (sửa lại ở bước 5 nếu URL Vercel khác)
4. **Apply** → Render build Docker (lần đầu ~5–10 phút). Log sẽ có `All migrations have been successfully applied` rồi `Nest application successfully started`.
5. Mở `https://travelpad-api.onrender.com/v1/health` (nếu tên bị trùng, Render thêm hậu tố – xem URL ở dashboard) → thấy `{"status":"ok",...}` là xong.

### Bước 3 – Nạp dữ liệu mẫu (tuỳ chọn)
Ở máy mình, trong thư mục repo:
```bash
PROD_DATABASE_URL='postgresql://…chuỗi Neon…' ./dev prod-seed
```
> ⚠️ Seed tạo các tài khoản mẫu `…@travelpad.local` với mật khẩu **`password123`** – ai biết cũng đăng nhập được. Chỉ dùng khi demo; khi có người dùng thật, đừng seed (hoặc đổi mật khẩu/xoá các tài khoản này).

### Bước 4 – Vercel: chạy web
1. Vào https://vercel.com → Sign up bằng GitHub (chọn gói **Hobby**).
2. **Add New → Project** → Import repo `travelpad`.
3. **Root Directory**: chọn `apps/web` (Vercel tự nhận `vercel.json` trong đó). Giữ bật "Include files outside the root directory".
4. **Environment Variables**:

   | Tên | Giá trị |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `/v1` |
   | `API_INTERNAL_URL` | `https://travelpad-api.onrender.com/v1` (URL Render thật của bạn) |
   | `NEXT_PUBLIC_SITE_URL` | `https://travelpad.vercel.app` (URL Vercel thật – có thể sửa sau khi biết) |
5. Trước khi bấm **Deploy**, mở link `/v1/health` của Render để đánh thức API (lúc build, Next.js gọi API để dựng trang; API đang ngủ thì trang dựng ra rỗng và chỉ đầy dữ liệu sau ~60 giây).
6. **Deploy** → được URL `https://<tên>.vercel.app`.

### Bước 5 – Nối lại hai đầu
1. Nếu URL Vercel khác `travelpad.vercel.app`: sửa `CORS_ORIGINS` trên Render (Environment) và `NEXT_PUBLIC_SITE_URL` trên Vercel, rồi redeploy cả hai.
2. Kiểm tra: mở trang chủ → thấy dữ liệu; mở `https://<tên>.vercel.app/v1/health` → `ok` (proxy chạy); đăng nhập → tải lại trang vẫn còn đăng nhập.

### Cập nhật về sau
- **Sửa code**: push lên nhánh `main` → Vercel và Render tự deploy lại (Render chỉ build lại khi đổi `apps/api`, `packages/contracts`, `packages/config` hoặc lockfile).
- **Đổi database**: `./dev migrate-new <tên>` ở máy → commit cả thư mục migration → push. Container Render tự áp migration mới khi khởi động. Muốn áp tay: `PROD_DATABASE_URL='…' ./dev prod-migrate`.

## 6. Hạn chế và rủi ro cần biết

- **Lần gọi API đầu tiên sau khi ngủ chậm 30–60 giây** (xem §7).
- **Vercel Hobby cấm dùng thương mại** – khi có doanh thu, chuyển lên gói trả phí hoặc nơi khác.
- **Swagger `/docs` công khai** trên Render – ai cũng xem được danh sách endpoint (không lộ dữ liệu, nhưng nên tắt khi chạy thật).
- **Chưa có lưu trữ ảnh upload** – hiện ảnh là link Unsplash; khi cần upload, thêm Cloudflare R2 (free 10 GB).
- Rate limit sau proxy dựa vào header `X-Forwarded-For`; gọi thẳng vào Render có thể giả header này – chấp nhận được ở quy mô demo.
- Toàn bộ request Server Component từ Vercel dùng chung một IP khi tới API → cùng chung hạn mức 120 request/phút; ISR 60 giây giữ lượng này thấp, nhưng nếu thấy lỗi 429 thì cần xem lại.

## 7. Ghi chú để cân nhắc sau: chống ngủ cho API

**Chưa làm – ghi lại để quyết định sau.**

- **Cách làm**: đăng ký dịch vụ miễn phí **cron-job.org** hoặc **UptimeRobot**, tạo lịch gọi `https://travelpad-api.onrender.com/v1/health` **mỗi 10 phút**. Render thấy có request đều đặn nên không tắt container (ngưỡng ngủ ~15 phút).
- **Tốn gì**: vẫn 0 đồng. Render free cho 750 giờ/tháng – một service chạy liên tục cả tháng ≈ 720–744 giờ, vừa đủ **nếu chỉ có 1 service free** trong tài khoản.
- **Lợi thêm**: `/v1/health` có `SELECT 1` → Neon cũng được giữ thức một phần; UptimeRobot còn báo email khi API sập.
- **Đánh đổi**: Neon tốn giờ tính toán nhiều hơn (DB ít được ngủ) – theo dõi mục Usage trên Neon tháng đầu; nếu gần chạm giới hạn thì giãn lịch (ví dụ chỉ ping 7h–23h).
- **Khi nào nên bật**: khi có người dùng thật hoặc cần demo cho người khác mà không muốn họ chờ.

## 8. Xử lý sự cố

| Hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| Render log `P1001: Can't reach database` | Sai `DATABASE_URL`, hoặc dùng chuỗi pooler | Copy lại chuỗi **Direct** từ Neon, có `?sslmode=require` |
| Lỗi liên quan `channel_binding` | Chuỗi Neon mới có thêm `&channel_binding=require` | Xoá đoạn `&channel_binding=require` khỏi chuỗi |
| Render log `Invalid environment` / thiếu biến | Chưa nhập `DATABASE_URL` hoặc `CORS_ORIGINS` | Vào Environment của service, nhập rồi Manual Deploy |
| Web hiện trang nhưng trống dữ liệu | API đang ngủ lúc build, hoặc sai `API_INTERNAL_URL` | Mở `/v1/health` trên Render, chờ ~60 giây tải lại; kiểm tra biến trên Vercel |
| `/v1/health` trên domain Vercel trả 404 | Thiếu `NEXT_PUBLIC_API_URL=/v1` hoặc `API_INTERNAL_URL` lúc build | Thêm biến trên Vercel rồi **Redeploy** (rewrite được tính lúc build) |
| Đăng nhập xong tải lại bị đăng xuất | Trình duyệt gọi API khác domain | Đảm bảo `NEXT_PUBLIC_API_URL` là `/v1` (tương đối), không phải URL Render |
| Build Vercel lỗi không tìm thấy `@travelpad/...` | Root Directory sai hoặc tắt "Include files outside root" | Root Directory = `apps/web`, bật lại tuỳ chọn đó |
