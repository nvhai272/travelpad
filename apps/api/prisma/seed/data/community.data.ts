// Người dùng, nhận xét, check-in và bài chia sẻ mẫu cho BXH cộng đồng.

export const reviewerSeeds = [
  { username: 'hoanglong', displayName: 'Hoàng Long', level: 6 },
  { username: 'thuha', displayName: 'Thu Hà', level: 5 },
  { username: 'quocbao', displayName: 'Quốc Bảo', level: 4 },
  { username: 'mailinh', displayName: 'Mai Linh', level: 5 },
  { username: 'ducanh', displayName: 'Đức Anh', level: 3 },
  { username: 'ngoctram', displayName: 'Ngọc Trâm', level: 4 },
];

export const voterNames = ['An Nhiên', 'Bảo Ngọc', 'Chí Thanh', 'Diệu Linh', 'Gia Huy', 'Hải Yến', 'Khánh Vy', 'Lâm Phong', 'Minh Khoa', 'Ngân Hà',
  'Phương Thảo', 'Quang Vinh', 'Sơn Tùng', 'Thanh Trúc', 'Trọng Nhân', 'Tuệ Lâm', 'Uyên Phương', 'Việt Hoàng', 'Xuân Mai', 'Yến Nhi',
  'Hữu Phước', 'Kim Chi', 'Nhật Minh', 'Thảo Vy'];

// [người viết, địa điểm, sao, nội dung, cách đây (ngày), số lượt Hữu ích]
export const reviews: [string, string, number, string, number, number][] = [
  ['hoanglong', 'deo-ma-pi-leng', 5, 'Đi xe máy qua đèo lúc 6h sáng, sông Nho Quế xanh như ngọc. Nên dừng ở điểm ngắm phía trên, tránh đi lúc trời mưa vì đường trơn.', 3, 6],
  ['hoanglong', 'dinh-fansipan', 5, 'Leo bộ tuyến Trạm Tôn mất 2 ngày 1 đêm, đoạn cuối rất dốc. Thuê porter người địa phương khoảng 800k, rất đáng. Mang găng tay và áo gió.', 9, 5],
  ['thuha', 'ban-cat-cat', 4, 'Bản đẹp và dễ đi bộ từ trung tâm, nhưng cuối tuần khá đông. Đến trước 8h sáng để chụp ảnh thác nước không bị chen.', 2, 4],
  ['thuha', 'homestay-ta-van', 5, 'Homestay sạch, chủ nhà nấu cơm lam và gà đồi rất ngon. Buổi tối ngồi bên bếp lửa nghe kể chuyện bản làng, trải nghiệm khó quên.', 12, 3],
  ['mailinh', 'cam-trai-langbiang', 5, 'Cắm trại đêm thứ Sáu, săn được biển mây lúc 5h30. Nhớ mang túi ngủ vì nhiệt độ xuống 10 độ, bãi có sẵn thuê lều.', 1, 5],
  ['mailinh', 'resort-ven-ho-tuyen-lam', 4, 'View hồ rất chill, phòng rộng. Đồ ăn trong resort hơi đắt, nên ra ngoài thị trấn ăn tối cho đa dạng.', 20, 1],
  ['quocbao', 'pho-bat-dan', 4, 'Phở gia truyền, nước dùng trong và ngọt xương. Phải tự bưng và xếp hàng khoảng 15 phút vào giờ cao điểm buổi sáng.', 4, 2],
  ['quocbao', 'mi-quang-ba-mua', 4, 'Mì Quảng đậm vị, topping nhiều. Giá hợp lý, quán sạch sẽ, phục vụ nhanh. Nên thử thêm bánh tráng cuốn thịt heo.', 6, 1],
  ['ducanh', 'bai-sao', 5, 'Cát trắng mịn, nước trong. Đi buổi chiều để ngắm hoàng hôn, thuê ghế nằm 50k. Tránh đi mùa mưa vì biển có rác trôi vào.', 5, 2],
  ['ngoctram', 'cam-trai-hon-thom', 4, 'Đi cáp treo ra đảo rồi cắm trại qua đêm, yên tĩnh. Chuẩn bị đèn pin và kem chống muỗi, đêm có gió biển mát.', 8, 1],
  ['ngoctram', 'ho-hoan-kiem', 5, 'Tối cuối tuần phố đi bộ rất vui, có nhiều hoạt động văn hóa. Nên ghé kem Tràng Tiền rồi dạo quanh hồ.', 26, 0],
  ['minhanh', 'cam-trai-doi-mong-ngua', 5, 'Đồi thoáng, săn mây đẹp nhất tầm tháng 10. Đường lên hơi khó cho xe máy số, nên gửi xe dưới chân đồi và đi bộ 15 phút.', 2, 3],
  ['luukhach01', 'ho-hoan-kiem', 5, 'Đi dạo quanh hồ lúc 6 giờ sáng, thấy các cụ tập dưỡng sinh, không khí trong lành và yên bình lạ thường.', 1, 2],
  ['luukhach02', 'ba-na-hills', 4, 'Cầu Vàng đẹp nhưng đông, nên mua vé sớm và lên cáp treo chuyến đầu tiên để tránh xếp hàng lâu.', 2, 1],
  ['luukhach03', 'du-thuyen-vinh-ha-long', 5, 'Ngủ đêm trên vịnh, sáng dậy chèo kayak giữa các đảo đá – trải nghiệm đáng tiền nhất chuyến đi.', 3, 3],
  ['luukhach04', 'cho-ben-thanh', 4, 'Nên ghé khu ẩm thực phía trong chợ vào buổi trưa, mặc cả nhẹ nhàng khi mua đồ lưu niệm.', 4, 0],
  ['luukhach05', 'ban-dao-son-tra', 5, 'Chạy xe máy lên đỉnh Bàn Cờ lúc hoàng hôn, gặp cả voọc chà vá chân nâu – nhớ đổ đầy xăng trước.', 5, 2],
  ['luukhach06', 'pho-co-dong-van', 4, 'Phố cổ nhỏ nhưng có hồn, sáng chủ nhật có chợ phiên rất đông người dân tộc xuống bản.', 6, 1],
  ['luukhach07', 'cam-trai-hon-thom', 4, 'Cáp treo vượt biển rất đẹp, bãi cắm trại sạch sẽ, tối có tiệc nướng hải sản bên lửa trại.', 7, 0],
  ['luukhach08', 'mi-quang-ba-mua', 5, 'Tô mì đậm vị, tôm thịt nhiều, nước dùng vừa đủ sệt – ăn một lần là nhớ.', 8, 1],
  ['luukhach09', 'homestay-ta-van', 4, 'Phòng sạch, chủ nhà thân thiện, buổi tối ngồi bên bếp lửa nghe kể chuyện bản làng rất ấm cúng.', 9, 0],
  ['luukhach10', 'cam-trai-langbiang', 5, 'Săn mây thành công lúc 5 giờ 30 sáng, đường lên hơi dốc nhưng xứng đáng từng bước chân.', 10, 2],
  ['tuandung', 'ca-phe-doi-thong', 4, 'Quán nhỏ giữa rừng thông, cà phê ngon.', 3, 0], // < 50 ký tự → không đạt chuẩn xếp hạng
];

// Check-in trong 7 ngày: [địa điểm, số người]
export const recentCheckins: [string, number][] = [
  ['cam-trai-langbiang', 6], ['deo-ma-pi-leng', 5], ['ban-cat-cat', 5], ['dinh-fansipan', 4],
  ['bai-sao', 3], ['pho-bat-dan', 3], ['cam-trai-doi-mong-ngua', 2], ['mi-quang-ba-mua', 1],
];

// [slug, tác giả, tiêu đề, nội dung, địa điểm, số tim từ người khác, giờ trước]
export const stories: [string, string, string, string, string, number, number][] = [
  ['suong-mu-sapa-5-gio-sang', 'minhanh', 'Sương mù Sapa lúc 5 giờ sáng',
    'Sương mù phủ kín đồi chè lúc 5 giờ sáng, lạnh nhưng đáng từng giây. Ai lên Sapa nhớ mang áo ấm nhé!', 'sa-pa', 24, 2],
  ['vuot-ma-pi-leng-bang-xe-may', 'hoanglong', 'Vượt Mã Pí Lèng bằng xe máy',
    'Hai ngày chạy vòng cung Hà Giang, khoảnh khắc đứng trên Mã Pí Lèng nhìn xuống sông Nho Quế là lý do mình sẽ quay lại.', 'deo-ma-pi-leng', 22, 5],
  ['san-may-langbiang', 'mailinh', 'Săn mây Langbiang cuối tuần',
    'Dựng lều lúc 9 giờ tối, 5 giờ sáng mở lều ra là biển mây trắng xóa. Nhớ mang túi ngủ đủ ấm!', 'cam-trai-langbiang', 18, 20],
  ['mot-ngay-o-cat-cat', 'thuha', 'Một ngày chậm ở bản Cát Cát',
    'Đi bộ từ thị trấn xuống bản, ghé nhà người H’Mông xem dệt thổ cẩm, trưa ăn cơm lam bên suối.', 'ban-cat-cat', 15, 30],
  ['pho-sang-ha-noi', 'quocbao', 'Bát phở sáng Hà Nội',
    'Xếp hàng 15 phút cho một bát phở gia truyền, nước dùng trong mà ngọt – đúng vị Hà Nội.', 'pho-bat-dan', 9, 48],
  ['hoang-hon-bai-sao', 'ducanh', 'Hoàng hôn Bãi Sao',
    'Cát trắng mịn như bột, hoàng hôn cam rực. Chiều nào ở Phú Quốc mình cũng ra đây.', 'bai-sao', 6, 72],
];
export const commentTexts = ['Đẹp quá, lưu lại cho chuyến sau!', 'Cảm ơn bạn chia sẻ kinh nghiệm chi tiết.', 'Mùa này đi có đông không bạn?'];

/** Theo dõi mẫu (BR-FOL-01): [người theo dõi, người được theo dõi]. */
export const follows: [string, string][] = [
  ['minhanh', 'hoanglong'], ['minhanh', 'thuha'], ['minhanh', 'mailinh'],
  ['hoanglong', 'minhanh'], ['thuha', 'minhanh'], ['mailinh', 'hoanglong'], ['quocbao', 'hoanglong'],
  ['luukhach01', 'hoanglong'], ['luukhach02', 'hoanglong'], ['luukhach03', 'thuha'], ['luukhach04', 'minhanh'],
];
