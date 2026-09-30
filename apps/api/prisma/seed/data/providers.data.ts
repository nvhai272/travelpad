
// Kết nối du lịch: nhà cung cấp mẫu (tên & số điện thoại là dữ liệu giả).
export type Prov = [string, string, 'hotel' | 'guesthouse' | 'homestay' | 'resort' | 'restaurant' | 'cafe' | 'tour_guide' | 'tour_operator' | 'car_rental' | 'motorbike_rental' | 'shuttle',
  string, number, 'night' | 'day' | 'trip' | 'person', string[], boolean, string];
export const providers: Prov[] = [
  ['nha-nghi-may-trang', 'Nhà nghỉ Mây Trắng', 'guesthouse', 'sa-pa', 350_000, 'night', [], true, 'Phòng đôi view thung lũng Mường Hoa, cách chợ Sapa 5 phút đi bộ.'],
  ['huong-dan-vien-a-su', 'Hướng dẫn viên A Sử', 'tour_guide', 'sa-pa', 600_000, 'day', ['vi', 'en'], true, 'Người H’Mông bản địa, dẫn trekking Lao Chải – Tả Van và leo Fansipan.'],
  ['homestay-cao-nguyen-da', 'Homestay Cao Nguyên Đá', 'homestay', 'ha-giang', 250_000, 'night', [], true, 'Nhà trình tường ở Đồng Văn, có bữa tối cùng gia chủ.'],
  ['thue-xe-may-ha-giang-loop', 'Thuê xe máy Hà Giang Loop', 'motorbike_rental', 'ha-giang', 200_000, 'day', ['vi', 'en'], true, 'Xe số và xe côn tay, kèm mũ bảo hiểm, áo mưa, bản đồ cung đường.'],
  ['khach-san-pho-co-lua', 'Khách sạn Phố Cổ Lụa', 'hotel', 'ha-noi', 900_000, 'night', [], true, 'Khách sạn boutique giữa phố cổ, gần hồ Hoàn Kiếm.'],
  ['xe-dua-don-noi-bai', 'Xe đưa đón sân bay Nội Bài', 'shuttle', 'ha-noi', 250_000, 'trip', [], false, 'Xe 4–16 chỗ đón tiễn sân bay, đặt trước 6 tiếng.'],
  ['du-thuyen-vinh-xanh', 'Du thuyền Vịnh Xanh', 'tour_operator', 'ha-long', 1_800_000, 'person', ['vi', 'en'], true, 'Tour ngủ đêm trên vịnh, chèo kayak hang Luồn.'],
  ['thue-o-to-tu-lai-da-nang', 'Thuê ô tô tự lái Đà Nẵng', 'car_rental', 'da-nang', 800_000, 'day', [], true, 'Xe 4–7 chỗ đời mới, giao xe tận khách sạn.'],
  ['khach-san-bien-an-thuong', 'Khách sạn biển An Thượng', 'hotel', 'da-nang', 700_000, 'night', [], false, 'Cách biển Mỹ Khê 200m, có hồ bơi tầng thượng.'],
  ['homestay-doi-thong', 'Homestay Đồi Thông', 'homestay', 'da-lat', 400_000, 'night', [], true, 'Nhà gỗ giữa rừng thông, lò sưởi, cách trung tâm 4km.'],
  ['jeep-tour-langbiang', 'Jeep tour Langbiang', 'tour_operator', 'da-lat', 350_000, 'person', ['vi'], true, 'Xe jeep lên đỉnh Radar, săn mây sáng sớm.'],
  ['saigon-food-tour', 'Hướng dẫn viên Sài Gòn Food Tour', 'tour_guide', 'tp-hcm', 500_000, 'person', ['vi', 'en', 'ko'], true, 'Tour ẩm thực đêm bằng xe máy qua Quận 4, Quận 5.'],
  ['resort-sao-bien', 'Resort Sao Biển', 'resort', 'phu-quoc', 2_200_000, 'night', [], true, 'Bungalow sát biển Bãi Sao, có đưa đón sân bay.'],
  // Ăn uống
  ['nha-hang-thang-co-a-phu', 'Nhà hàng Thắng cố A Phủ', 'restaurant', 'sa-pa', 150_000, 'person', [], true, 'Đặc sản vùng cao: thắng cố, cá hồi, lợn cắp nách nướng.'],
  ['quan-bun-cha-pho-co', 'Quán bún chả Phố Cổ', 'restaurant', 'ha-noi', 60_000, 'person', [], true, 'Bún chả than hoa, nem cua bể giữa phố cổ.'],
  ['ca-phe-may-da-lat', 'Cà phê Mây Đà Lạt', 'cafe', 'da-lat', 45_000, 'person', [], true, 'Quán cà phê view đồi thông, săn mây buổi sớm.'],
  ['banh-xeo-ba-duong', 'Bánh xèo Bà Dưỡng', 'restaurant', 'da-nang', 50_000, 'person', [], true, 'Bánh xèo giòn, nem lụi, nước chấm gan heo.'],
  ['hai-san-ham-ninh', 'Hải sản làng chài Hàm Ninh', 'restaurant', 'phu-quoc', 300_000, 'person', [], false, 'Ghẹ, nhum, gỏi cá trích tươi trong ngày.'],
  ['thue-xe-may-phu-quoc', 'Thuê xe máy Phú Quốc', 'motorbike_rental', 'phu-quoc', 150_000, 'day', [], false, 'Giao xe tận nơi ở Dương Đông, An Thới.'],
];


// [slug, số người vote, sao mục tiêu]
export const providerVotes: [string, number, number][] = [
  ['huong-dan-vien-a-su', 14, 4.9], ['thue-xe-may-ha-giang-loop', 12, 4.8], ['saigon-food-tour', 11, 4.9],
  ['homestay-cao-nguyen-da', 10, 4.7], ['nha-nghi-may-trang', 9, 4.5], ['du-thuyen-vinh-xanh', 8, 4.6],
  ['homestay-doi-thong', 7, 4.7], ['jeep-tour-langbiang', 6, 4.4], ['thue-o-to-tu-lai-da-nang', 5, 4.6],
  ['resort-sao-bien', 4, 4.8], ['khach-san-pho-co-lua', 2, 5],
  ['quan-bun-cha-pho-co', 13, 4.7], ['nha-hang-thang-co-a-phu', 11, 4.5], ['banh-xeo-ba-duong', 9, 4.6],
  ['ca-phe-may-da-lat', 7, 4.8], ['hai-san-ham-ninh', 5, 4.4],
];

/** Chủ dịch vụ (tài khoản "Nhà cung cấp" – BR-USER-01): slug dịch vụ → username. */
export const providerOwners: Record<string, string> = {
  'nha-nghi-may-trang': 'thuha',
  'quan-bun-cha-pho-co': 'quocbao',
};

/** Hồ sơ đăng ký mẫu đang chờ duyệt – để có dữ liệu cho hàng đợi quản trị. */
export const pendingRegistration = {
  slug: 'homestay-ben-suoi-ha-giang', owner: 'ducanh', name: 'Homestay Bên Suối', type: 'homestay' as const, destination: 'ha-giang',
  priceFrom: 300_000, priceUnit: 'night' as const, phone: '0900 000 200', licenseNumber: 'HKD-0123456',
  description: 'Nhà sàn bên suối ở Du Già, có bữa tối cùng gia chủ và cho thuê xe máy đi cung Mã Pí Lèng.',
};
