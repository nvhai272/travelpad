# Quy tắc nội dung & chữ hiển thị – TravelPad

Áp dụng cho mọi chữ trên giao diện (`packages/i18n`), thông báo lỗi API, email và dữ liệu biên tập.

## 1. Giọng văn
- **Thân thiện, gọn, rõ ràng** – như một người bạn đi nhiều, không như văn bản hành chính.
- Xưng **"bạn"** với người dùng; tự gọi là **"TravelPad"** (không "chúng tôi", không "hệ thống").
- Câu ngắn, động từ trước: "Chấm sao cho địa điểm" thay vì "Việc chấm sao cho địa điểm sẽ…".
- Không cường điệu, không hứa điều sản phẩm chưa làm ("đặt phòng ngay", "được đảm bảo"…).
- **Cộng đồng là trung tâm**: nội dung do cộng đồng xây dựng và phát triển – nói rõ điểm sao, xếp hạng, lịch trình đến từ ai ("được cộng đồng chấm sao", "người trải nghiệm đánh giá"); mời người dùng góp phần thay vì chỉ dùng.
- Không để lộ chữ kỹ thuật cho người dùng (`seed`, `API`, mã lỗi) – chỉ nằm trong log.

## 2. Thuật ngữ (dùng đúng một cách gọi)

| Khái niệm | Dùng | Không dùng |
|---|---|---|
| Cho điểm 1–5 sao | **chấm sao** (động từ), **đánh giá** (danh từ, đếm: "25 đánh giá") | vote, vote sao, lượt vote, chấm điểm, rate |
| Số người đã chấm sao | **"25 người đánh giá"** | người vote |
| Phần chữ kèm sao | **nhận xét** | review, bình luận (bình luận là của bài viết) |
| Nhận xét hiển thị cho cộng đồng | **câu chuyện** | review, bài đánh giá |
| Nút đánh dấu nhận xét có ích | **Hữu ích** (trong ngoặc kép khi nhắc tới) | like, đồng tình (trừ câu mô tả BXH đã chốt) |
| Người dùng thường | **người trải nghiệm** | du khách (chỉ dùng trong câu văn), user |
| Doanh nghiệp đăng dịch vụ | **nhà cung cấp** (đầy đủ: nhà cung cấp dịch vụ du lịch) | đối tác, vendor |
| Vùng lớn (Sapa, Đà Lạt) | **điểm đến** | vùng, khu du lịch |
| Nơi cụ thể (Đỉnh Fansipan) | **địa điểm** | spot, điểm |
| Theo dõi một chiều | **theo dõi / bỏ theo dõi** | kết bạn, follow |
| Cấp độ người dùng | **"Cấp 4"** | Nhà du hành cấp 4, level |
| Thương hiệu | **TravelPad** · mô tả: **sổ tay du lịch cộng đồng** | cẩm nang, travelpad (chữ thường) |

Từ mượn được chấp nhận (quen thuộc với người Việt): homestay, resort, tour, check-in, Zalo, email, website, điểm hot.

## 3. Chính tả & định dạng
- Dấu thanh theo kiểu mới, **thống nhất**: *xóa, tùy, hòa, thủy* (không *xoá, tuỳ*).
- **Viết hoa kiểu câu**: chỉ chữ đầu và tên riêng ("Địa điểm nổi bật", không "Địa Điểm Nổi Bật").
- Gạch nối **"–"** (có cách hai bên) để tách ý: "Sapa – Lào Cai". Khoảng số dùng "–" không cách: "1–3 ngày".
- Dấu ba chấm là **một ký tự "…"**.
- Ngoặc kép **“ ”** cho từ khóa người dùng gõ và tên nút: “Hữu ích”.
- Tiền: **350.000 ₫** (dấu chấm ngăn nghìn, ký hiệu sau, có cách); đơn vị: "/đêm", "/người".
- Ngày: **26/9/2026**; thời gian tương đối: "2 giờ trước", "3 ngày trước".
- Số đếm đi kèm danh từ: "25 người đánh giá", "1 câu chuyện" (không "1 câu chuyện(s)").

## 4. Mẫu câu theo tình huống

| Tình huống | Mẫu |
|---|---|
| Nút hành động | Động từ + tân ngữ ngắn: "Gợi ý lịch trình", "Gửi yêu cầu", "Xem 12 kết quả" |
| Trạng thái rỗng | Nói điều gì đang xảy ra **+ gợi ý bước tiếp**: "Không có địa điểm phù hợp. Thử bỏ bớt bộ lọc nhé." |
| Lỗi | Không đổ lỗi, nói cách sửa: "Không gửi được. Kiểm tra kết nối rồi thử lại." |
| Xác nhận thành công | Ngắn + điều gì xảy ra tiếp: "Đã gửi! Nhà cung cấp sẽ liên hệ lại với bạn." |
| Mời đăng nhập | Nêu lợi ích: "Đăng nhập để theo dõi người khác và xem câu chuyện của họ." |
| Gợi ý ô nhập (placeholder) | Ví dụ cụ thể, kết thúc bằng "…": "Tìm địa điểm, tỉnh, thành phố…" |

## 5. Nội dung biên tập (địa điểm, điểm đến)
- Mô tả địa điểm 1–2 câu (≤ 180 ký tự): **điều đặc trưng + lời khuyên thực tế** (giờ đẹp, mùa, lưu ý).
- Không lặp khuôn "X – một trong những điểm được yêu thích nhất ở Y".
- Không bịa số liệu cụ thể (giá vé, giờ mở cửa) khi chưa kiểm chứng.

## 6. Tiếng Anh
Giữ cùng nghĩa, không dịch từng chữ; dùng "ratings/rate" cho chấm sao, "stories" cho câu chuyện, "provider" cho nhà cung cấp.
