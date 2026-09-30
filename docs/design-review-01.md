# Design review #01 – Đối chiếu web với bản Lovable (26/09/2026)

## Vấn đề phát hiện (bản trước)
| # | Mức | Vấn đề | Xử lý |
|---|---|---|---|
| 1 | Cao | Bố cục 1 cột dài kiểu blog, mất cấu trúc "dashboard tạp chí" 7/5 cột | Lưới 12 cột: nội dung 7 · aside 5 |
| 2 | Cao | Tự bật dark mode theo hệ điều hành → khác hẳn tông giấy kem | Mặc định sáng; tối là tuỳ chọn trong Cài đặt |
| 3 | Cao | Không ảnh, hero chỉ là chữ | Hero ảnh full + gradient + eyebrow + tiêu đề serif 72px + chip vùng + nút lưu |
| 4 | Cao | Header thiếu tìm kiếm, bộ lọc, cài đặt, nav có trạng thái | Header đầy đủ theo Lovable + chip hồ sơ/thông báo khi đăng nhập |
| 5 | Cao | Thiếu chế độ khách, quả cầu, bạn bè, cá nhân | Banner khách, thẻ khoá, quả cầu SVG, thẻ bạn bè/cá nhân |
| 6 | TB | Sai font (Be Vietnam Pro), sai màu (tự chọn) | Manrope + Cormorant Garamond, token oklch gốc |
| 7 | TB | Thẻ địa điểm chữ đè ảnh, không có huy hiệu sao | Ảnh 16:10, chip vùng, sao trên nền vàng ấm |
| 8 | TB | Mobile không có điều hướng đáy | Nav nổi 5 mục |
| 9 | TB | Tự chuyển /en theo ngôn ngữ trình duyệt | Mặc định tiếng Việt, đổi trong Cài đặt |

## Cải tiến vượt bản Lovable
- **Nhãn ghim quả cầu không đè nhau**: chỉ ghi nhãn ghim đang chọn (ghim khác có tooltip), ghim chọn vẽ trên cùng, chữ có viền.
- **Tab "Của tôi" có đường nối hành trình** (nét đứt) theo thứ tự thời gian check-in.
- **Đăng nhập thật** (JWT + refresh cookie) thay cho nút "đăng nhập nhanh" giả; sau khi đăng nhập tự chạy tiếp hành động đang dở.
- **Tìm kiếm dẫn tới trang kết quả `/places?...`** – URL chia sẻ được, SEO được (Lovable chỉ lọc tại chỗ).
- Trang chi tiết địa điểm cùng ngôn ngữ thiết kế (hero ảnh + thẻ thông tin), có JSON-LD.
- Hỗ trợ `prefers-reduced-motion`, Esc đóng dialog/sheet, `aria-pressed` cho nút thích/lưu.

## Còn lại (đưa vào backlog)
- Ảnh: mới có 4 ảnh gốc, nhiều địa điểm dùng lặp → cần bộ ảnh thật (TL-005).
- Trang `/places` chưa có bộ lọc hiển thị cố định + infinite scroll (TL-204/205).
- Bạn bè đang đi còn dữ liệu tĩnh (TL-702); chuông thông báo chưa nối API (TL-703/704).
- Nút lưu điểm đến chưa lưu thật (TL-506). Access token chưa tự làm mới sau 15 phút (TL-101).
