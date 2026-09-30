# Đặc tả nghiệp vụ TravelPad

> Mỗi quy tắc có mã `BR-<NHÓM>-<số>` để code, test và ticket tham chiếu (VD: comment `// BR-RANK-01`).
> Trạng thái: ✅ đã có trong code · 🟡 có một phần · ⬜ chưa làm (xem task `TL-xxx` trong [backlog.md](./backlog.md)).
> Những điểm cần chủ sản phẩm chốt nằm ở **§17 Câu hỏi mở**.

## 0. Điều hướng chính (chốt 27/09/2026 – 2 mục)

| Menu | Trang | Nội dung |
|---|---|---|
| **Trang chủ** | `/` | **Giới thiệu TravelPad** (`/#about`) · Những nơi nên đến ở Việt Nam · Đang vào mùa đẹp (BR-HOME-03). Tìm kiếm, lịch trình, dịch vụ, văn hóa đều ở Khám phá Việt Nam |
| **Khám phá Việt Nam** | `/map` · `/itinerary` · `/connect` · `/culture` (+ `/places/*`, `/culture/*`) | Bốn tab (ExploreTabs): **Địa điểm** · **Lịch trình** · **Dịch vụ** · **Văn hóa**. Tab Địa điểm: chưa tìm gì → dưới quả cầu là *Nơi nên đến, dịch vụ nên chọn* (Top 5 địa điểm + dịch vụ uy tín theo nhóm); **tìm / chọn một điểm đến** → khung **"Gợi ý ở …"** (điểm sao, mùa đẹp, nơi nên đến, dịch vụ được chấm sao cao, nút lên lịch trình) (BR-MAP-07) |

Không còn mục "Giới thiệu" trên menu – nội dung nằm trên trang chủ, chân trang trỏ tới `/#about`.

**Điện thoại** (thanh tab dưới): Trang chủ · Khám phá · **Tôi** (bảng trượt: hồ sơ, Dịch vụ của tôi / Đăng ký nhà cung cấp, Duyệt – quản trị, Cài đặt, Đăng xuất). Header điện thoại chỉ có logo + Đăng nhập.

**Cộng đồng bỏ khỏi điều hướng** (27/09): `/stories`, `/posts`, `/following` vẫn chạy (link cũ, hồ sơ) nhưng không lên menu, chân trang, trang chủ. Nhận xét vẫn hiện ngay trên trang địa điểm và dịch vụ.

### 0b. Văn hóa
- Nội dung **tóm tắt, thận trọng**: chỉ nêu điều phổ biến, có nguồn công khai; không bịa số liệu. Mỗi chủ đề: tóm tắt 1 câu + 2 đoạn ngắn + "Trải nghiệm ở đâu" (địa điểm có thật trong dữ liệu, hoặc điểm đến / cả miền) + chủ đề khác cùng nhóm. Cuối trang có lời mời góp ý sửa nội dung.
- Chữ nằm ở `packages/i18n` (`culture.topics.*`, vi + en); ảnh, nhóm và liên kết ở `features/culture/culture-topics.ts`. Ảnh Wikimedia Commons đúng giấy phép, ghi công ở `lib/photo-credits.ts`.
- TODO: chuyển sang CMS/DB khi cần biên tập viên sửa không qua code.

## 0.1 Vai trò & ma trận quyền

| Vai trò | Mô tả |
|---|---|
| **Khách** | Chưa đăng nhập. Đọc, tìm kiếm, xem bản đồ và bảng xếp hạng. |
| **Thành viên** | Đã đăng nhập. Mọi hành động cá nhân và xã hội. |
| **Kiểm duyệt viên** | Xử lý báo cáo, ẩn nội dung. |
| **Quản trị** | Quản lý địa điểm, người dùng, cấu hình, gắn "nổi bật", **duyệt & xác minh nhà cung cấp**. |
| **Nhà cung cấp** | Chủ khách sạn/nhà nghỉ/homestay, nhà hàng/quán, hướng dẫn viên, nhà xe. Là thành viên có **loại tài khoản "Nhà cung cấp dịch vụ du lịch"** (BR-USER-01): vẫn đánh giá, chia sẻ như du khách, nhưng **không** được đánh giá hay gửi yêu cầu kết nối tới dịch vụ của chính mình (BR-CONN-10). *(Phase 2: quản lý hồ sơ dịch vụ, phản hồi yêu cầu kết nối.)* |

| Chức năng | Khách | Thành viên | Ghi chú |
|---|:-:|:-:|---|
| Xem trang chủ, địa điểm, bài viết, hồ sơ công khai | ✅ | ✅ | |
| Tìm & lọc **địa điểm** (trang Khám phá `/map`) | ✅ | ✅ | §3, §8 |
| Vote sao nhà cung cấp | ❌ → mời đăng nhập | ✅ (đã gửi yêu cầu kết nối) | BR-CONN-07 |
| Trang **Bản đồ** – quả cầu, tab **Điểm hot**, tìm tỉnh/thành, bộ lọc địa điểm | ✅ | ✅ | §8 |
| **Gợi ý lịch trình** (trang riêng `/itinerary`) | ✅ | ✅ | §8b |
| **Kết nối du lịch**: xem danh sách & chi tiết nhà cung cấp | ✅ (số điện thoại bị che) | ✅ | §10b |
| Xem liên hệ đầy đủ, gửi yêu cầu kết nối | ❌ → mời đăng nhập | ✅ | BR-CONN-03/04 |
| Đăng ký nhà cung cấp, xem "Dịch vụ của tôi" | ❌ → mời đăng nhập | ✅ | BR-CONN-06, 12 |
| Duyệt hồ sơ nhà cung cấp | ❌ | ❌ (chỉ Quản trị / Kiểm duyệt viên) | BR-CONN-11 |
| Lưu lịch trình thành hành trình | ❌ → mời đăng nhập | ✅ | BR-JRN-02 |
| Bản đồ – tab **Của tôi** (dấu chân) | ❌ → mời đăng nhập | ✅ | |
| BXH địa điểm (theo tổng số người vote) · Top chia sẻ & đánh giá (tổng tim / tổng Hữu ích) | ✅ | ✅ | §7 |
| Thích, lưu, bình luận bài viết | ❌ → mời đăng nhập | ✅ | BR-AUTH-06 |
| Xem điểm sao, phân bố sao, nhận xét | ✅ | ✅ | §6 |
| **Vote sao** địa điểm (kèm nhận xét tuỳ chọn), bấm "Hữu ích" | ❌ → mời đăng nhập | ✅ | §6 |
| Viết bài, check-in, tạo hành trình | ❌ → mời đăng nhập | ✅ | |
| Xem câu chuyện (`/stories`), hồ sơ công khai | ✅ | ✅ | §5b |
| Theo dõi người khác, trang Theo dõi | ❌ → mời đăng nhập | ✅ | §12 |
| Cài đặt | ✅ (lưu trên máy) | ✅ (đồng bộ tài khoản) | §15 |

---

## 1. Tài khoản & xác thực

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-USER-01 | Mỗi tài khoản có **loại**: *Người trải nghiệm* (mặc định) hoặc *Nhà cung cấp dịch vụ du lịch* (khi sở hữu ít nhất một dịch vụ trên Kết nối du lịch – được duyệt ở BR-CONN-06). Loại tài khoản hiện công khai cạnh tên trên bảng xếp hạng để cộng đồng biết người đánh giá là ai. | ✅ |

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-AUTH-01 | Đăng ký bằng email, mật khẩu (8–72 ký tự) và tên hiển thị (2–50 ký tự). Mỗi email chỉ một tài khoản. | ✅ |
| BR-AUTH-02 | `username` tự sinh từ phần trước `@` của email (chỉ `a-z0-9_`, tối đa 20 ký tự); trùng thì thêm số ngẫu nhiên. Người dùng đổi được 1 lần mỗi 30 ngày. | 🟡 (chưa cho đổi) |
| BR-AUTH-03 | Phiên đăng nhập: access token 15 phút + refresh token 30 ngày, xoay vòng mỗi lần dùng. Refresh token đã dùng/thu hồi thì bị từ chối. | ✅ |
| BR-AUTH-04 | Đăng nhập sai không nói rõ sai email hay sai mật khẩu. Sai 5 lần trong 15 phút → khoá đăng nhập email đó 15 phút. | 🟡 (chưa khoá) |
| BR-AUTH-05 | Đăng xuất thu hồi refresh token của thiết bị hiện tại. "Đăng xuất mọi thiết bị" thu hồi tất cả. | 🟡 |
| BR-AUTH-06 | Khách bấm một hành động cần đăng nhập → mở hộp đăng nhập **tại chỗ**, không chuyển trang. Đăng nhập thành công thì **tự thực hiện tiếp** hành động đó. | ✅ |
| BR-AUTH-07 | Quên mật khẩu: gửi link đặt lại qua email, hết hạn sau 30 phút, dùng một lần. Không tiết lộ email có tồn tại hay không. | ⬜ TL-107 |
| BR-AUTH-08 | Chưa xác minh email thì vẫn dùng được, nhưng **không** được viết bài/đánh giá công khai cho tới khi xác minh (chống spam). | ⬜ TL-107 |

## 2. Trang chủ

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-HOME-01 | **Điểm đến mùa này** (hero, tiêu đề `<h2>`): biên tập chọn điểm đến đang vào mùa đẹp (dựa trên "mùa đẹp nhất"), đổi theo mùa – không phải theo tuần. Câu dẫn lấy **số địa điểm thật** từ dữ liệu, không ghi cứng. | 🟡 (chọn tay, chưa tự đổi theo mùa) |
| BR-HOME-02 | ~~Địa điểm nổi bật~~ – **bỏ khỏi trang chủ (27/09)**: trùng với Top 5 địa điểm; xem đủ ở Khám phá. | — |
| BR-HOME-03 | **Bố cục trang chủ** (27/09): ① **Giới thiệu TravelPad** (`<h1>`, 3 bước dùng, nguyên tắc điểm sao & miễn phí, mời nhà cung cấp) · ② **Những nơi nên đến ở Việt Nam**: tối đa 8 **điểm đến cấp tỉnh, thành** (không điểm sao), xếp theo tổng lượt đánh giá của địa điểm bên trong; thẻ ghi miền, tỉnh, số địa điểm và 2 địa điểm cụ thể nổi bật · ③ **Đang vào mùa đẹp** (BR-HOME-06). Không có ô tìm kiếm, văn hóa hay BXH – đã có trong Khám phá Việt Nam. | ✅ |
| BR-HOME-04 | ~~Khối chào mừng~~ – **bỏ (27/09)**: hero đã nói rõ 3 việc chính; nội dung giới thiệu chuyển sang trang **Giới thiệu** (`/about`). `<h1>` trang chủ là tiêu đề hero. | — |
| BR-HOME-05 | ~~Tầng thành viên trên trang chủ~~ – **bỏ (27/09)** cùng mục Cộng đồng; `FollowingFeed` vẫn dùng ở `/following`. | — |
| BR-HOME-06 | **Tháng này nên đi đâu**: điểm đến có "mùa đẹp nhất" chứa tháng hiện tại (giờ Việt Nam; nhãn dạng "Tháng 11 – 4" được hiểu là vắt qua năm – `seasonMonths` trong contracts), xếp theo số người đánh giá, tối đa 4. Ít hơn 3 thì bù điểm đến **sắp vào mùa** (tháng sau), gắn nhãn riêng. Mỗi thẻ: ảnh, nhãn mùa đẹp (không có điểm sao – BR-PLACE-06), 3 địa điểm được đánh giá nhiều nhất, nút "Gợi ý lịch trình". | ✅ |

## 3. Tìm kiếm

**Chốt 26/09/2026:** bỏ ô tìm kiếm trên header. Tìm kiếm chỉ có ở những trang có ngữ cảnh rõ ràng:

| Nơi | Tìm gì | Bộ lọc |
|---|---|---|
| **Khám phá** `/map` | Địa điểm theo tên, tỉnh, thành phố | Khu vực, loại, giá, sao (§8) |
| **Lịch trình** `/itinerary` | Điểm đến theo tỉnh, thành phố | Số ngày |
| **Kết nối du lịch** `/connect` | Nhà cung cấp theo tên, tỉnh, thành phố | Nhóm dịch vụ, điểm đến |
| Trang `/posts?q=` | Bài viết (qua URL, chưa có ô nhập riêng) | – |

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-SRCH-02 | Tìm **không dấu**: đã có ở Khám phá và Lịch trình (lọc phía client); ở `/connect` và `/posts` (tìm phía server) chưa hỗ trợ. | 🟡 TL-201 |
| BR-SRCH-04 | Lịch sử tìm địa điểm trên Khám phá: tối đa 8 từ khoá, bỏ trùng; khách lưu trên trình duyệt, thành viên đồng bộ server. | 🟡 (chưa đồng bộ) |
| BR-SRCH-05 | **Xu hướng** trên Khám phá: 5 từ khoá địa điểm được tìm nhiều nhất trong 7 ngày. | ⬜ TL-201 (hiện là danh sách cố định) |

## 4. Địa điểm

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-PLACE-01 | Có hai cấp: **Điểm đến** (vùng lớn, là ghim trên quả cầu: Sapa, Đà Lạt) và **Địa điểm** (thuộc một điểm đến: Đỉnh Fansipan). Địa điểm con phải có điểm đến cha. | ✅ |
| BR-PLACE-02 | Mỗi địa điểm có đúng **1 loại** chính và **1 vùng**. `slug` duy nhất, viết không dấu, không đổi sau khi xuất bản (đổi thì phải có redirect 301). | ✅ / ⬜ redirect |
| BR-PLACE-03 | **Điểm của địa điểm = trung bình vote sao của người dùng** (chỉ tính vote đang hiển thị), làm tròn 1 chữ số, kèm số lượt vote và biểu đồ phân bố 1–5★. **Dưới 3 vote** thì hiện nhãn "Mới" thay cho điểm, không vào BXH và không xuất rich snippet sao cho Google. Không có điểm do biên tập nhập tay. | ✅ |
| BR-PLACE-06 | **Điểm đến (Sapa, Hạ Long…) không có đánh giá** (27/09): không hiện điểm sao, không cho chấm sao (API trả `DESTINATION_NOT_RATABLE`). Điểm gộp từ địa điểm con vẫn được tính nội bộ để xếp độ phổ biến. Trang điểm đến hiển thị đánh giá của từng địa điểm con. | ✅ |
| BR-PLACE-04 | Hiện tại chỉ Quản trị tạo/sửa địa điểm. Phase 4: thành viên đề xuất → kiểm duyệt duyệt → được cộng XP. | ⬜ |
| BR-PLACE-05 | "Mùa đẹp nhất" và "Mức giá" là dữ liệu biên tập (khác với điểm sao). "Check-in tuần này" = số check-in hợp lệ trong 7 ngày (BR-CHK-02). | ✅ |

## 5. Bài viết trải nghiệm

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-POST-01 | Trạng thái: `draft` (chỉ tác giả thấy) → `published` → `hidden` (bị kiểm duyệt ẩn; tác giả vẫn thấy kèm lý do). | 🟡 |
| BR-POST-02 | Tiêu đề 5–150 ký tự, nội dung ≥ 20 ký tự, tối đa 20 ảnh và 10 tag. Có thể gắn 1 địa điểm và/hoặc 1 hành trình. | 🟡 (chưa có API tạo) |
| BR-POST-03 | Thích và Lưu là bật/tắt; bấm nhiều lần không cộng dồn. Tự thích bài của mình được, nhưng không tính vào BXH. | ✅ |
| BR-POST-04 | Bình luận 1–1000 ký tự, trả lời tối đa 1 cấp. Tác giả bình luận xoá được bình luận của mình; tác giả bài xoá được mọi bình luận trong bài. | ⬜ TL-403 |
| BR-POST-05 | Danh sách "Đã lưu" chỉ chủ tài khoản xem được. | ⬜ TL-405 |
| BR-POST-06 | Sửa bài sau khi đăng thì hiện nhãn "đã chỉnh sửa". Xoá bài là xoá mềm, sau 30 ngày mới xoá hẳn. | ⬜ |

## 5b. Câu chuyện (đánh giá của người dùng)

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-STORY-01 | **Câu chuyện** = vote sao **có kèm nhận xét** của người dùng cho một địa điểm (vote chỉ-sao không hiện). | ✅ |
| BR-STORY-02 | Trang chủ mục **"Câu chuyện mới"**: **6 câu chuyện mới nhất**. Thẻ hiện ảnh + tên địa điểm, số sao, trích đoạn (tối đa 180 ký tự), tác giả, loại tài khoản, thời gian, nút **Theo dõi** tác giả. | ✅ |
| BR-STORY-03 | Trang **`/stories`**: tất cả câu chuyện, **mới nhất → cũ nhất**, phân trang theo số trang (9/trang, `?page=N`), render phía server để Google đọc được. Hồ sơ công khai hiện 6 câu chuyện gần nhất của người đó. | ✅ |

## 6. Vote sao, nhận xét & "Hữu ích"

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-REV-01 | Mỗi thành viên có **1 vote sao cho mỗi địa điểm**. Chấm sao là **lưu ngay**; vote lại thì ghi đè vote cũ (không cộng thêm lượt); xoá được vote của mình. | ✅ |
| BR-REV-02 | Sao nguyên 1–5 (1 Tệ · 2 Chưa tốt · 3 Bình thường · 4 Tốt · 5 Tuyệt vời). **Nhận xét không bắt buộc**; nếu viết thì 10–2000 ký tự. Danh sách "Nhận xét gần đây" chỉ hiện vote có kèm nhận xét, nhưng vote chỉ-sao vẫn tính vào điểm. | ✅ |
| BR-REV-03 | Tạo, sửa hoặc xoá vote thì tính lại điểm, số vote và phân bố sao của địa điểm **và điểm đến cha** trong cùng giao dịch; người vote thấy kết quả mới ngay. | ✅ |
| BR-REV-04 | ~~Đánh giá đạt chuẩn ≥ 50 ký tự mới được tính BXH~~ – **bỏ (26/09)**: BXH người đánh giá giờ tính theo tổng lượt "Hữu ích" (BR-RANK-04). | — |
| BR-REV-05 | Thành viên bấm **"Hữu ích"** cho đánh giá của người khác, tối đa 1 lần mỗi đánh giá, bỏ được. **Không tự vote** đánh giá của mình (API trả 403). | ✅ API / ⬜ nút trên UI |
| BR-REV-07 | Chống vote ảo: vote từ tài khoản chưa xác minh email vẫn lưu nhưng **không tính vào điểm** cho tới khi xác minh; mỗi tài khoản tối đa 30 vote/ngày. | ⬜ |
| BR-REV-06 | Đánh giá bị báo cáo ≥ 3 lần bởi 3 người khác nhau thì tạm ẩn chờ kiểm duyệt; khi đó không tính vào điểm sao lẫn BXH. | ⬜ |
| BR-REV-08 | Chỉ chấm sao **địa điểm cụ thể** (`kind = spot`) và **dịch vụ**; điểm đến lớn thì không (BR-PLACE-06). | ✅ |

## 7. Bảng xếp hạng

**Chốt 26/09/2026:** mọi bảng xếp hạng tính trên **toàn bộ thời gian**, không giới hạn 30 ngày hay 7 ngày. Kết quả cache 1 phút. Công thức khai báo trong `packages/contracts/src/rankings.ts` và tài liệu này; giao diện **không** hiện nút giải thích công thức (bỏ nút ⓘ – 26/09/2026), chỉ có một dòng mô tả ngắn dưới tiêu đề mỗi bảng.

### 7.1 Địa điểm được yêu thích nhất

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-RANK-01 | Xếp **địa điểm con** theo **tổng số người đã vote sao** (toàn thời gian). Cùng số người thì **sao trung bình** cao hơn đứng trước, rồi đến tên A→Z. Mỗi dòng hiện số người vote và sao trung bình. | ✅ |
| BR-RANK-02 | Chỉ địa điểm có **≥ 3 vote** (BR-PLACE-03) mới vào bảng. | ✅ |

### 7.2 Xếp hạng cộng đồng (trang chủ, 2 bảng đặt cạnh nhau)

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-RANK-03 | *(API giữ lại, không hiện trên trang chủ)* Top người đóng góp theo **tổng tim** bài chia sẻ, không tính tim tự thả. Có thể dùng cho trang hồ sơ hoặc trang BXH đầy đủ sau này. | ✅ API |
| BR-RANK-04 | **Đánh giá hữu ích nhất**: xếp người dùng theo **tổng lượt "Hữu ích"** trên các nhận xét của họ (toàn thời gian), kèm nhận xét nổi bật. Mỗi dòng hiện **loại tài khoản** (Người trải nghiệm / Nhà cung cấp dịch vụ du lịch) thay cho số lượt. Mô tả bảng: "Người có nhiều đánh giá “Hữu ích” hoặc được đồng tình nhiều nhất". **27/09: gỡ khỏi trang chủ** (ít giá trị với khách mới) – API `GET /rankings/creators` vẫn giữ, chưa có chỗ hiển thị. | 🟡 |
| BR-RANK-09 | **Dịch vụ du lịch uy tín** – *theo đánh giá của người trải nghiệm*, **tách thành 4 bảng theo nhóm** (tab): **Lưu trú · Ăn uống · Di chuyển · Hướng dẫn viên & tour**. Mỗi bảng top 5, xếp theo tổng số người vote sao (toàn thời gian), hoà thì sao TB cao hơn; tối thiểu 3 vote; chỉ nhà cung cấp `active`. Vote chỉ đến từ người đã gửi yêu cầu kết nối và không phải chủ dịch vụ (BR-CONN-07, BR-CONN-10). | ✅ |
| BR-RANK-08 | Mỗi người trên bảng hiện kèm **bài/đánh giá nổi bật nhất** của họ (nhiều tim/hữu ích nhất) có link. Người có tổng = 0 không xuất hiện. | ✅ |
| BR-RANK-06 | Chống gian lận: tim/vote từ tài khoản tạo dưới 7 ngày hoặc chưa xác minh email **không** được tính. Một người cho một người khác tối đa 20 tim được tính mỗi tháng. | ⬜ TL-309 |
| BR-RANK-07 | Hằng tháng chụp lại bảng; top 1 mỗi tab nhận huy hiệu ("Cây bút được yêu thích" / "Người đánh giá tận tâm") và +200 XP. | ⬜ |
| BR-RANK-05 | Phase 2: tab "Hot tuần này" và mũi tên tăng/giảm hạng. | ⬜ TL-502 |

## 8. Trang Bản đồ (`/map`) – tìm & gợi ý địa điểm

Trang riêng (menu "Bản đồ"), không nhúng ở trang chủ. Bên trái là quả cầu, bên phải là ô tìm địa điểm + bộ lọc + danh sách kết quả. Gợi ý lịch trình là phần riêng (§8b). Khách dùng được toàn bộ, trừ tab "Của tôi".

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-MAP-01 | Tab **Điểm hot**: hiện mọi điểm đến đang hoạt động. Chọn một ghim thì quả cầu xoay về tâm và hiện danh sách địa điểm con, lọc được theo loại. | ✅ |
| BR-MAP-02 | Tab **Của tôi**: chỉ dành cho thành viên. Hiện các điểm đến đã check-in, nối bằng đường nét đứt theo thứ tự thời gian. Chưa có dấu chân thì hiện hướng dẫn check-in. | ✅ |
| BR-MAP-03 | Chế độ **Tiết kiệm dữ liệu** tắt hiệu ứng xoay mở đầu và vòng sóng quanh ghim, dùng ảnh nhỏ. | ✅ |
| BR-MAP-06 | Bộ lọc hiện **cố định**, không nằm trong popover: **Khu vực** (Bắc / Trung / Tây Nguyên / Nam & Đảo), **Loại**, **Mức giá** (₫ < 300k hoặc miễn phí vé; ₫₫ 300k–1tr; ₫₫₫ > 1tr, tính theo chi phí/người/lượt), **Sao tối thiểu** (4+ / 4.5+, chỉ xét địa điểm đủ 3 vote). Kết quả **cập nhật ngay** khi chọn, không có nút "Xem kết quả". Hiện số kết quả và nút "Xoá bộ lọc (n)". Chỉ có **một** bộ lọc loại (không lặp trên quả cầu). Kết quả xếp theo số người vote rồi sao trung bình. | ✅ |
| BR-MAP-07 | **Gợi ý theo điểm đến khi tìm**: từ khóa khớp tên / tỉnh của một điểm đến (không dấu), hoặc chọn ghim, hoặc mọi kết quả cùng một điểm đến → hiện khung "Gợi ý ở …" trên danh sách kết quả: mùa đẹp của điểm đến, 3 nơi nên đến, dịch vụ được chấm sao cao theo 4 nhóm, nút lên lịch trình / xem điểm đến. | ✅ |
| BR-MAP-05 | Ô **tìm tỉnh/thành phố** lọc các điểm đến theo tên điểm đến **hoặc tên tỉnh**, không phân biệt dấu ("da lat", "lam dong" → Đà Lạt; "quang ninh" → Hạ Long). Nhấn Enter là chọn kết quả đầu tiên và xoay quả cầu tới đó. | ✅ |
| BR-MAP-04 | Thẻ nhanh của điểm đến: mùa đẹp nhất, thời tiết hiện tại (cache 30 phút), số check-in tuần, nút "Lưu vào chuyến đi". | ⬜ TL-503/506 |

## 8b. Gợi ý lịch trình (phần riêng)

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-ITIN-01 | Trang riêng **`/itinerary`** (menu "Lịch trình"): chọn điểm đến (tìm theo tỉnh/thành, không dấu) và **1–5 ngày**. Kết quả nằm trên URL (`?destination=sa-pa&days=2`) nên chia sẻ được và Google đọc được. Khách dùng được; **lưu thành hành trình** cần đăng nhập (BR-JRN-02). | ✅ / ⬜ lưu |
| BR-ITIN-02 | Mỗi ngày có 4 buổi, mỗi buổi ưu tiên loại địa điểm: **Sáng** tham quan → leo núi · **Trưa** ăn uống · **Chiều** leo núi → cắm trại → tham quan · **Tối** nghỉ dưỡng → ăn uống → cắm trại. | ✅ |
| BR-ITIN-03 | Chọn địa điểm con của điểm đến, **nhiều người vote nhất trước** (cùng thứ tự BXH, BR-RANK-01); mỗi địa điểm chỉ dùng 1 lần trong lịch trình, riêng chỗ nghỉ buổi tối được lặp cho các đêm sau. Thiếu địa điểm phù hợp thì buổi đó hiện "Tự do khám phá". | ✅ |
| BR-ITIN-04 | Phase 4: cá nhân hoá (sở thích, ngân sách, mùa, khoảng cách di chuyển) bằng AI, nhưng **chỉ chọn trong dữ liệu địa điểm thật** của travelpad. | ⬜ |

## 9. Check-in & dấu chân

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-CHK-01 | Check-in gắn với 1 địa điểm (hoặc điểm đến), có thể kèm ảnh, ghi chú và số ngày ở lại. | 🟡 (chỉ có trong dữ liệu mẫu) |
| BR-CHK-02 | Check-in trên **app mobile** cần GPS cách địa điểm ≤ 2km mới được huy hiệu "Đã đến thật" và tính vào BXH. Check-in trên web (nhật ký bổ sung) **không** tính vào BXH. | ⬜ |
| BR-CHK-03 | Mỗi người tính 1 check-in/địa điểm/ngày cho các chỉ số (có thể lưu nhiều lần làm nhật ký). | ✅ (khi xếp hạng) |
| BR-CHK-04 | Chia sẻ vị trí tuân theo Cài đặt `shareLocation`: tắt / người theo dõi / công khai. Tắt thì check-in không hiện với người khác. | ⬜ |

## 10. Hành trình & "Lưu vào chuyến đi"

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-JRN-01 | Trạng thái: `planning` (đang lên kế hoạch) → `ongoing` (đang đi) → `completed` (đã xong). Mỗi người có tối đa **1 hành trình `ongoing`** cùng lúc. | ⬜ TL-602 |
| BR-JRN-02 | "Lưu vào chuyến đi" thêm địa điểm vào hành trình `planning` gần nhất; chưa có thì tự tạo "Chuyến đi mới". | ⬜ TL-506 |
| BR-JRN-03 | Quyền xem: công khai / người theo dõi / riêng tư. Tổng quãng đường tính theo đường chim bay giữa các điểm dừng liên tiếp. | ⬜ |

## 10b. Kết nối du lịch (`/connect`)

Mục tiêu: nối du khách với **dịch vụ địa phương** – lưu trú, người dẫn tour, phương tiện – để **liên hệ trực tiếp**. TravelPad **không** đặt chỗ hay thu tiền hộ ở giai đoạn này.

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-CONN-01 | 4 nhóm, theo thứ tự: **Lưu trú** (khách sạn, nhà nghỉ, homestay, resort) · **Ăn uống** (nhà hàng, quán cà phê) · **Di chuyển** (thuê ô tô, thuê xe máy, xe đưa đón) · **Hướng dẫn viên & tour** (hướng dẫn viên cá nhân, công ty tour). Lọc theo nhóm, điểm đến; tìm theo tên, tỉnh, thành phố. | ✅ |
| BR-CONN-02 | Mỗi nhà cung cấp gắn với **1 điểm đến**, có giá **"Từ …"** theo đơn vị (đêm/ngày/chuyến/người) và ngôn ngữ (với hướng dẫn viên). Chỉ hiện nhà cung cấp trạng thái `active`. Thứ tự: đã xác minh → nhiều đánh giá → mới nhất. | ✅ |
| BR-CONN-03 | **Khách** thấy số điện thoại **đã che** (`0912 ••• 678`); bấm "Xem liên hệ" thì mời đăng nhập. **Thành viên** xem được số điện thoại, Zalo, website và bấm gọi hoặc mở Zalo trực tiếp. (Chống thu thập số hàng loạt, tạo động lực đăng ký.) | ✅ |
| BR-CONN-04 | Thành viên **gửi yêu cầu kết nối**: lời nhắn 10–1000 ký tự, ngày đi, số người, số điện thoại (tuỳ chọn). Tối đa **10 yêu cầu/ngày** mỗi tài khoản. Trạng thái: `new` → `contacted` → `closed`. | ✅ lưu / ⬜ báo cho nhà cung cấp |
| BR-CONN-05 | Huy hiệu **"Đã xác minh"** do quản trị/kiểm duyệt viên cấp **khi duyệt** hồ sơ, sau khi đối chiếu số giấy phép kinh doanh / thẻ hướng dẫn viên / đăng ký xe và gọi xác nhận số điện thoại. Số giấy phép chỉ chủ hồ sơ và quản trị thấy. | ✅ |
| BR-CONN-06 | **Đăng ký nhà cung cấp** (`/connect/register`): thành viên đã đăng nhập điền hồ sơ – tên, loại (theo 4 nhóm), điểm đến, địa chỉ, giới thiệu ≥ 30 ký tự, giá từ + đơn vị, ngôn ngữ (HDV), điện thoại, Zalo/website (tuỳ chọn), **số giấy phép** (bắt buộc) và tích cam kết → trạng thái **Chờ duyệt**, **chưa hiện công khai**. Tối đa **3 hồ sơ chờ duyệt**/người. | ✅ |
| BR-CONN-11 | **Duyệt** (`/admin/providers`, chỉ ADMIN/MODERATOR): *Duyệt* → `active`, hiện công khai, tài khoản chủ chuyển thành **Nhà cung cấp** (BR-USER-01), có thể kèm "Đã xác minh". *Từ chối* → `rejected` với **lý do ≥ 10 ký tự** (chủ hồ sơ thấy). Chỉ xử lý được hồ sơ đang chờ. | ✅ |
| BR-CONN-12 | **Dịch vụ của tôi** (`/me/providers`): chủ xem trạng thái (Chờ duyệt / Đang hiển thị / Bị từ chối / Tạm ẩn) và lý do từ chối; hồ sơ *chờ duyệt* hoặc *bị từ chối* được **sửa rồi gửi lại** (về Chờ duyệt, xoá lý do cũ). Sửa dịch vụ đang hiển thị: TL-717. Trang cá nhân & quản trị không cho máy tìm kiếm index. | ✅ |
| BR-CONN-07 | **Vote sao cho nhà cung cấp** (1–5★, nhận xét tuỳ chọn, sửa/xoá được): chỉ thành viên **đã gửi yêu cầu kết nối** tới nhà cung cấp đó mới được vote – chưa gửi thì API trả `NOT_CONNECTED`. Dưới 3 vote hiện "Mới". Điểm dùng cho BXH "Dịch vụ du lịch uy tín" (BR-RANK-09). | ✅ |
| BR-CONN-10 | Nhà cung cấp **không** được gửi yêu cầu kết nối hay vote sao cho **dịch vụ do chính mình sở hữu** (API trả `OWN_SERVICE`); vẫn được đánh giá dịch vụ của người khác như một người trải nghiệm. | ✅ |
| BR-CONN-08 | **Liên kết chéo**: trang địa điểm hiện "Lên kế hoạch cho {điểm đến}" (→ Lịch trình), **"Dịch vụ quanh đây"** (3 nhà cung cấp cùng điểm đến → Kết nối) và "Địa điểm khác tại …"; kết quả lịch trình có lối "Cần chỗ ở, xe hay hướng dẫn viên ở …?" → Kết nối, buổi trống có "Tìm thêm ở …" → Khám phá. | ✅ |
| BR-CONN-09 | Báo cáo nhà cung cấp (lừa đảo, sai giá, không liên lạc được): ≥ 3 báo cáo từ 3 người khác nhau → tạm ẩn chờ quản trị. | ⬜ |

## 11. Hồ sơ & cấp độ

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-PROF-01 | Hồ sơ công khai hiện: tên, avatar, loại tài khoản, cấp độ, số câu chuyện, người theo dõi, đang theo dõi, nút Theo dõi và 6 câu chuyện gần nhất. | ✅ |
| BR-PROF-02 | Chế độ riêng tư "chỉ người theo dõi" ẩn hành trình với người lạ; câu chuyện (đánh giá) luôn công khai. | ⬜ |

## 12. Theo dõi (thay cho Bạn bè – chốt 26/09/2026)

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-FOL-01 | **Theo dõi một chiều**: bấm "Theo dõi" là xong, **không cần người kia đồng ý**; bấm lại để bỏ theo dõi. Không tự theo dõi chính mình. Bấm nhiều lần không tạo trùng. Khách bấm → mời đăng nhập. | ✅ |
| BR-FOL-02 | Nút Theo dõi có ở **hồ sơ công khai** và **mỗi thẻ câu chuyện**; trạng thái đồng bộ ở mọi nơi trên trang. | ✅ |
| BR-FOL-03 | Trang **Theo dõi** (`/following`, không index): danh sách người đang theo dõi (bỏ theo dõi tại chỗ) + **câu chuyện mới của họ**, mới → cũ, phân trang. | ✅ |
| BR-FOL-04 | Hồ sơ hiện số **người theo dõi** và **đang theo dõi**, số câu chuyện. Không còn khái niệm lời mời kết bạn / bạn bè đang đi. | ✅ |
| BR-FOL-05 | Thông báo "X bắt đầu theo dõi bạn" và "người bạn theo dõi có câu chuyện mới" (bật/tắt trong Cài đặt). | ⬜ TL-703 |
| BR-FOL-06 | Chặn người dùng: người bị chặn không theo dõi được và không thấy câu chuyện của người chặn. | ⬜ |

## 13. Thông báo

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-NTF-01 | Các loại: có người theo dõi mới, người đang theo dõi có câu chuyện mới, thích/bình luận bài của tôi, đánh giá của tôi được "Hữu ích", lên cấp, gợi ý điểm hot hằng tuần. | ⬜ TL-703 |
| BR-NTF-02 | Mỗi loại bật/tắt được trong Cài đặt. Thích bài gộp thành 1 thông báo ("A và 12 người khác…") trong 1 giờ. | ⬜ |
| BR-NTF-03 | Badge trên chuông = số thông báo chưa đọc (hiện "9+" nếu lớn hơn 9). Mở trang thông báo thì đánh dấu đã xem. | ⬜ (đang là số cố định) |

## 14. Kinh nghiệm (XP) & cấp độ

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-XP-01 | Cộng XP: check-in hợp lệ +10, đánh giá đạt chuẩn +20, nhận 1 "Hữu ích" +5, bài viết đã đăng +30, được thích +1 (tối đa 50 XP/ngày từ lượt thích). | ⬜ TL-705 |
| BR-XP-02 | Cấp n cần tổng `100 × n × (n − 1) / 2` XP (cấp 2 = 100, cấp 5 = 1000…). Tên gọi: "Nhà du hành cấp n". | ⬜ |
| BR-XP-03 | Nội dung bị ẩn do vi phạm thì bị thu hồi XP tương ứng. | ⬜ |

## 15. Cài đặt

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-SET-01 | Ngôn ngữ: vi (mặc định) / en; đổi xong áp dụng ngay, URL đổi theo (`/en/...`). | ✅ |
| BR-SET-02 | Chế độ màu mặc định **Sáng**; có Tối và Theo máy. Có Cỡ chữ lớn và Tiết kiệm dữ liệu. | ✅ |
| BR-SET-03 | Khách lưu cài đặt trên trình duyệt. Thành viên đồng bộ với tài khoản; lần đăng nhập đầu tiên thì cài đặt khách được đẩy lên tài khoản. | 🟡 (chưa đồng bộ) |

## 16. Kiểm duyệt

| Mã | Quy tắc | TT |
|---|---|:-:|
| BR-MOD-01 | Mọi bài viết, bình luận, đánh giá và ảnh đều có nút "Báo cáo" (lý do: spam, sai sự thật, phản cảm, quảng cáo trá hình…). | ⬜ |
| BR-MOD-02 | Kiểm duyệt viên ẩn hoặc khôi phục nội dung, ghi lý do; tác giả nhận thông báo và được khiếu nại 1 lần. | ⬜ |
| BR-MOD-03 | Giới hạn tốc độ: tối đa 10 bài/ngày, 30 bình luận/giờ, 20 đánh giá/ngày cho mỗi tài khoản. | 🟡 (chỉ có giới hạn chung 120 request/phút) |

---

## 17. Câu hỏi mở – cần chủ sản phẩm chốt

| # | Câu hỏi | Đề xuất mặc định (đang áp dụng) |
|---|---|---|
| Q1 | ~~"Người có bài đánh giá tốt nhất" đo bằng gì?~~ **Đã chốt (26/09):** 2 bảng toàn thời gian – tổng tim bài chia sẻ và tổng lượt "Hữu ích" của đánh giá (§7.2). | — |
| Q2 | ~~BXH địa điểm theo tuần hay tháng?~~ **Đã chốt (26/09): theo tổng số người vote sao, toàn thời gian (§7.1).** Còn mở: có cần thêm BXH theo từng vùng/loại không? | BXH theo vùng/loại để Phase 2 |
| Q3 | BXH có tính cả **điểm đến** (Sapa) hay chỉ **địa điểm con** (Fansipan)? | Chỉ địa điểm con |
| Q4 | Check-in trên web có được tính vào BXH không? | Không – chỉ check-in có GPS trên app (BR-CHK-02) |
| Q5 | Có trao thưởng/huy hiệu cho top BXH không? | Có huy hiệu + XP, không có quà vật chất |
| Q6 | Ai được tạo địa điểm mới? | Chỉ quản trị ở giai đoạn đầu; cộng đồng đề xuất ở Phase 4 |
| Q8 | Gợi ý lịch trình có cần tính **khoảng cách di chuyển** giữa các điểm trong ngày (tránh sáng Sapa – chiều Fansipan quá xa) không? | Phase 2: gom các địa điểm trong bán kính ≤ 15km cho cùng một buổi |
| Q9 | **Mô hình doanh thu** của Kết nối du lịch: miễn phí để có nguồn cung · phí đăng tin/gói nổi bật · hoa hồng trên đặt chỗ (khi làm đặt chỗ trực tuyến)? | Giai đoạn đầu miễn phí; Phase 4 gói "Nổi bật" (gắn nhãn Tài trợ) |
| Q10 | Có làm **đặt chỗ & thanh toán trực tuyến** không, hay chỉ kết nối? | Chỉ kết nối tới khi có ≥ 200 nhà cung cấp hoạt động |
| Q7 | Khách có được xem **hồ sơ đầy đủ** của người trên BXH? | Có với hồ sơ công khai; hồ sơ "chỉ người theo dõi" chỉ hiện tên, avatar, cấp độ |
