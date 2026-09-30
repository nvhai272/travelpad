# Design review #02 – Tách Bản đồ và Tìm kiếm khỏi trang chủ (26/09/2026)

## Quyết định
- Quả cầu và tìm/lọc địa điểm chuyển sang trang riêng **`/map`**. Trang chủ bỏ quả cầu.
- Ô tìm kiếm trên header chỉ tìm **bài viết**; kết quả ra `/posts`.

## Đánh giá: **đồng ý**, vì
1. **Mỗi trang một việc.** Trang chủ là tạp chí (đọc, cảm hứng). Bản đồ là công cụ (tìm, lọc, so sánh). Trộn chung khiến cả hai đều yếu.
2. **Quả cầu quá chật khi đặt trong cột phụ.** Ở cột 5/12 quả cầu chỉ rộng khoảng 380px, lại có 2 hàng chip cuộn ngang che mất lựa chọn ("Tham q…" bị cắt). Sang trang riêng, quả cầu rộng tới 560px và các chip xuống dòng đủ hiển thị.
3. **Trang chủ nhẹ hơn**: không còn SVG và vòng lặp animation, trang tải nhanh và ổn định hơn cho SEO.
4. **Bộ lọc đặt cạnh kết quả** theo mẫu quen thuộc của Airbnb và Google Maps: người dùng thấy ngay tác động của từng lựa chọn.

## Vấn đề của thiết kế cũ (ảnh bộ lọc popover + thẻ quả cầu)
| Vấn đề | Mức | Đã xử lý |
|---|---|---|
| Popover quá cao (~600px), gộp lịch sử + xu hướng + 4 nhóm lọc, **che mất hero** | Cao | Bộ lọc hiện cố định bên cạnh kết quả trên `/map` |
| Phải bấm "Xem kết quả" mới thấy hiệu quả, không biết trước còn bao nhiêu kết quả | Cao | Lọc tức thì, hiện "N kết quả" và "Xoá bộ lọc (n)" |
| **Hai bộ lọc loại trùng nhau** (popover và chip trên quả cầu) có thể mâu thuẫn | Cao | Chỉ còn một bộ lọc |
| Chip cuộn ngang giấu lựa chọn (Tham quan, TP.HCM… bị cắt) | TB | Chip xuống dòng |
| Ký hiệu giá không nhất quán: bộ lọc dùng "$", danh sách dùng "đ" | TB | Thống nhất "₫ / ₫₫ / ₫₫₫" |
| Ô tìm chung một chỗ cho cả bài viết và địa điểm → kết quả khó đoán | TB | Header chỉ tìm bài viết; có lối tắt "Tìm địa điểm … trên bản đồ" |
| Quả cầu mở đầu bằng xoay từ Ấn Độ Dương; tab nền/reduced-motion đứng yên sai chỗ | TB | Mở sẵn ở Việt Nam, chỉ xoay khi chọn |
| Chữ gợi ý "Kéo để xoay" tương phản thấp, cỡ 10px | Thấp | Tăng lên 11px; nên kiểm tra lại WCAG ở bước sau |

## Rủi ro của hướng mới và cách giảm
- **Người dùng gõ tên địa điểm vào ô header và không thấy gì.** Giảm bằng lối tắt "Tìm địa điểm … trên bản đồ" luôn có trong gợi ý, và cũng có trên trang `/posts`.
- **Mất lối vào bản đồ từ trang chủ.** Giảm bằng mục "Bản đồ" trên menu, trên thanh điều hướng mobile, và thẻ **"Khám phá trên bản đồ"** ở cột phải trang chủ.

## Đề xuất tiếp theo
1. **Mobile `/map`**: quả cầu thu nhỏ ở đầu trang, bộ lọc dạng bottom-sheet có nút "Lọc (n)" cố định, danh sách bên dưới. Cần review trên điện thoại thật.
2. **Đồng bộ bản đồ ↔ danh sách**: rê chuột lên một kết quả thì ghim tương ứng sáng lên; lọc theo loại thì chỉ hiện ghim những vùng có kết quả.
3. **Quả cầu SVG chỉ nên là lớp tổng quan.** Khi cần zoom tới cấp phường/phố, chuyển sang MapLibre 2D (ADR-0005) trên cùng trang.
4. **Trang `/posts`** cần bộ lọc theo địa điểm/tag và phân trang vô hạn (TL-204).

---

# Design review #03 – Bố cục trang chủ (26/09/2026)

**Thay đổi:** bỏ ô tìm kiếm header, bỏ thẻ "Khám phá trên bản đồ", "Điểm đến tuần này" → "mùa này", xếp hạng cộng đồng = Đánh giá hữu ích nhất + Dịch vụ du lịch uy tín.

**Nguyên tắc bố cục mới – 5 tầng, mỗi tầng một mục đích:**
1. *Chào mừng* (khách): hiểu sản phẩm trong 5 giây, có 4 lối vào.
2. *Cảm hứng + bằng chứng*: ảnh lớn điểm đến mùa này đặt cạnh **Top 5 địa điểm** – đẹp và đáng tin trong cùng một tầm mắt.
3. *Dành cho bạn* (thành viên): nội dung cá nhân ở vị trí thứ hai, khách không thấy khoảng trống.
4. *Địa điểm nổi bật*: lưới 3 cột toàn chiều rộng (trước đây 2 cột bị ép trong cột 7/12, ảnh nhỏ).
5. *Xếp hạng cộng đồng*: 2 bảng **đặt cạnh nhau** thay vì tab – so sánh được ngay, không phải bấm.

**Lý do bỏ ô tìm kiếm header:** tìm kiếm không có ngữ cảnh (tìm bài viết hay địa điểm?) gây nhầm lẫn. Mỗi trang công cụ (Khám phá, Lịch trình, Kết nối) có ô tìm riêng, đúng đối tượng.

**Theo dõi sau khi ra mắt:** tỉ lệ khách bấm vào 4 lối vào của khối chào mừng; nếu "Khám phá" thấp, cân nhắc đưa ô "Tìm tỉnh, thành phố…" vào hero.
