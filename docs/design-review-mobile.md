# Design review – Web trên điện thoại (26/09/2026)

Đánh giá trên ảnh chụp thật ở **iPhone 14 (390×844)** bằng `./dev shots` (Playwright trong Docker), cả khách lẫn thành viên.

## Vấn đề (trước) → Giải pháp (sau)

| # | Vấn đề | Mức | Giải pháp |
|---|---|---|---|
| 1 | Màn hình đầu trang chủ toàn là khối chào mừng (tiêu đề 3 dòng + 4 thẻ dọc) | Cao | Khối chào mừng gọn: tiêu đề 2 dòng, ẩn câu dẫn, CTA cạnh ghi chú, 4 lối vào thành **hàng vuốt ngang** chỉ có icon + tên |
| 2 | Trang chủ dài **~7.000px** (6 câu chuyện + 6 địa điểm thẻ lớn xếp dọc) | Cao | **Băng chuyền vuốt ngang** (`ScrollRow`, lộ 18% thẻ sau để gợi ý vuốt) → **~3.200px** (−54%) |
| 3 | Thanh dưới nổi đè nội dung; nút **(+) không làm gì**; thiếu Lịch trình, Theo dõi | Cao | Thanh tab chuẩn full-width, chừa vùng an toàn iPhone: **Trang chủ · Khám phá · Lịch trình · Kết nối · Tôi** |
| 4 | Lối vào cá nhân rải rác (bánh răng, chuông, chip hồ sơ trên header chật) | TB | Bảng **"Tôi"** trượt từ dưới: hồ sơ, Theo dõi, Câu chuyện, Dịch vụ của tôi / Đăng ký nhà cung cấp, Duyệt (quản trị), Cài đặt, Đăng xuất. Header điện thoại chỉ còn logo + Đăng nhập |
| 5 | Khám phá: quả cầu + 4 nhóm lọc chiếm ~2 màn hình trước kết quả | Cao | Nút **"Lọc (n)"** mở **bảng trượt** với nút "Xem N kết quả" cập nhật trực tiếp; chip điểm đến cuộn ngang; quả cầu **thu gọn**, bấm "Xem trên quả cầu" mới mở → kết quả thấy ngay màn hình đầu |
| 6 | Trang nhà cung cấp: ảnh chiếm cả màn hình, khối Liên hệ ở cuối trang | Cao | **Thanh hành động cố định** trên thanh tab: "Từ 600.000 đ/ngày · [Liên hệ]" (cuộn tới #contact) |
| 7 | Ô nhập 14px → iOS tự phóng to khi chạm | TB | Ô nhập ≥ 16px dưới 640px (CSS toàn cục) |
| 8 | Chip lọc ~30px khó chạm | TB | Chip 36px trên điện thoại; hàng mục trong bảng "Tôi" ≥ 48px |
| 9 | Tiêu đề trang 36px chiếm 2–3 dòng | Thấp | 30px trên điện thoại, câu dẫn phụ ẩn ở trang Khám phá |
| 10 | Bảng "Đánh giá hữu ích nhất": nhãn loại tài khoản đẩy tên bị cắt ("Quố…") | TB | Điện thoại: loại tài khoản xuống dưới tên |
| 11 | Tab xếp hạng dịch vụ xuống 2 hàng | Thấp | Cuộn ngang một hàng |
| 12 | Lỗi `useNow` ở thẻ câu chuyện (server component) | – | Tách `RelativeTime` thành client component |

## Nguyên tắc mobile đã áp dụng
1. **Nội dung chính trong màn hình đầu** (above the fold): kết quả tìm kiếm, ảnh điểm đến, nút liên hệ.
2. **Vùng ngón cái**: điều hướng và hành động chính ở đáy màn hình (tab bar, thanh CTA, nút trong bảng trượt).
3. **Giảm cuộn dọc**: nội dung phụ (câu chuyện, địa điểm, chip) vuốt ngang.
4. **Tiết lộ dần**: bộ lọc, quả cầu, menu cá nhân chỉ mở khi cần (bảng trượt từ dưới lên).
5. Vùng chạm ≥ 44px cho hành động chính; ô nhập 16px; chừa `safe-area-inset` cho tai thỏ / thanh home.

## Việc tiếp theo
- Kiểm tra màn 360px (Android nhỏ) và iPad; chế độ tối trên điện thoại.
- Vuốt xuống để đóng bảng trượt; giữ vị trí cuộn khi quay lại trang.
- PWA: cài lên màn hình chính, biểu tượng app, màn hình chờ.

---

# Review trải nghiệm & thiết kế #2 (26/09/2026)

Đi thử 5 hành trình người dùng trên desktop (1440) và điện thoại (390).

| Hành trình / vấn đề | Góc nhìn | Đã sửa |
|---|---|---|
| Nút lưu 🔖 trên ảnh và chuông 🔔 số "3" **không làm gì thật** | Người dùng mất tin | Ẩn tới khi có chức năng (TL-506, TL-703) – không hiển thị điều khiển giả |
| Trang địa điểm **kết thúc cụt** | Người dùng không biết làm gì tiếp | Khối "Lên kế hoạch cho {điểm đến}" → Lịch trình · "Dịch vụ quanh đây" → Kết nối · "Địa điểm khác tại …" (BR-CONN-08) |
| Lịch trình có buổi "Tự do khám phá" trống, không có lối sang dịch vụ | Người dùng phải tự tìm | Buổi trống có link "Tìm thêm ở …"; cuối lịch trình: "Cần chỗ ở, xe hay hướng dẫn viên ở …?" → Kết nối |
| 6 nút "Theo dõi" màu đặc trên thẻ câu chuyện tranh chú ý | Thiết kế | Nút phụ viền nhẹ trên thẻ; màu đặc chỉ ở trang hồ sơ; ẩn trên thẻ của chính tác giả ở hồ sơ |
| Nhãn "Người trải nghiệm" lặp mọi dòng BXH | Thiết kế (nhiễu) | Chỉ nhấn mạnh "Nhà cung cấp" (nhãn cam); người trải nghiệm hiện chữ nhạt |
| Thẻ Top 5 thừa khoảng trống | Thiết kế | Danh sách giãn đều theo chiều cao thẻ |
| Footer chỉ một dòng | Điều hướng phụ | Footer 4 cột: giới thiệu, Khám phá, Cộng đồng, Dành cho doanh nghiệp |
| Cột phải trang địa điểm trống khi cuộn | Thiết kế | Khối điểm & thông tin dính theo khi cuộn (desktop) |
| Dịch vụ quanh đây, câu chuyện theo dõi xếp dọc trên điện thoại | Mobile | Băng chuyền vuốt ngang |

**Vấn đề nội dung (không sửa bằng code – cần dữ liệu thật):**
- Chỉ có 4 ảnh dùng lặp cho mọi địa điểm/dịch vụ → giảm lòng tin nghiêm trọng. Cần bộ ảnh thật (TL-005) và upload ảnh (TL-301, TL-718).
- Mô tả địa điểm đang theo khuôn "X – một trong những điểm được cộng đồng yêu thích nhất ở Y" → cần nội dung biên tập riêng (TL-721).
