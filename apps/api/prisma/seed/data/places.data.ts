import type { PlaceCategory, Region } from '@prisma/client';

// Dữ liệu mẫu (khớp bản thiết kế Lovable) – thay bằng dữ liệu thật trước khi ra mắt.
export type Dest = { slug: string; name: string; province: string; region: Region; lat: number; lng: number; bestSeason: string; description: string };
export const destinations: Dest[] = [
  { slug: 'sa-pa', name: 'Sapa', province: 'Lào Cai', region: 'north', lat: 22.34, lng: 103.84, bestSeason: 'Tháng 9 – 11',
    description: 'Ruộng bậc thang, biển mây Fansipan và văn hóa của các dân tộc vùng cao.' },
  { slug: 'ha-giang', name: 'Hà Giang', province: 'Hà Giang', region: 'north', lat: 22.82, lng: 104.98, bestSeason: 'Tháng 10 – 11',
    description: 'Cao nguyên đá, đèo Mã Pí Lèng và mùa hoa tam giác mạch.' },
  { slug: 'ha-noi', name: 'Hà Nội', province: 'Hà Nội', region: 'north', lat: 21.03, lng: 105.85, bestSeason: 'Tháng 9 – 12',
    description: 'Phố cổ, hồ Gươm và những gánh hàng rong của nghìn năm văn hiến.' },
  { slug: 'ha-long', name: 'Hạ Long', province: 'Quảng Ninh', region: 'north', lat: 20.95, lng: 107.07, bestSeason: 'Tháng 4 – 10',
    description: 'Hàng nghìn đảo đá vôi giữa làn nước xanh ngọc.' },
  { slug: 'da-nang', name: 'Đà Nẵng', province: 'Đà Nẵng', region: 'central', lat: 16.05, lng: 108.2, bestSeason: 'Tháng 2 – 8',
    description: 'Biển Mỹ Khê, bán đảo Sơn Trà và cầu Rồng.' },
  { slug: 'da-lat', name: 'Đà Lạt', province: 'Lâm Đồng', region: 'highlands', lat: 11.94, lng: 108.44, bestSeason: 'Tháng 12 – 3',
    description: 'Thành phố ngàn hoa, rừng thông và khí hậu se lạnh quanh năm.' },
  { slug: 'tp-hcm', name: 'TP.HCM', province: 'TP. Hồ Chí Minh', region: 'south', lat: 10.82, lng: 106.63, bestSeason: 'Tháng 12 – 4',
    description: 'Thành phố không ngủ, ẩm thực đường phố phong phú bậc nhất cả nước.' },
  { slug: 'phu-quoc', name: 'Phú Quốc', province: 'Kiên Giang', region: 'south', lat: 10.29, lng: 103.98, bestSeason: 'Tháng 11 – 4',
    description: 'Đảo ngọc với bãi cát trắng, hoàng hôn và hải sản tươi.' },
];

// [slug, tên, destination, loại, sao mục tiêu, độ phổ biến, mức giá, hot?, lat, lng] – ảnh: placeImage(slug)
// sao mục tiêu + độ phổ biến chỉ dùng để SINH vote mẫu; điểm hiển thị luôn tính từ vote thật (BR-REV-03).
export type Spot = [string, string, string, PlaceCategory, number, number, 1 | 2 | 3, boolean, number, number];
export const spots: Spot[] = [
  ['dinh-fansipan', 'Đỉnh Fansipan', 'sa-pa', 'hiking', 4.9, 2400, 3, true, 22.3033, 103.775],
  ['ban-cat-cat', 'Bản Cát Cát', 'sa-pa', 'sightseeing', 4.7, 1800, 1, true, 22.3296, 103.8316],
  ['homestay-ta-van', 'Homestay Tả Van', 'sa-pa', 'stay', 4.6, 640, 2, true, 22.3094, 103.8856],
  ['cam-trai-doi-mong-ngua', 'Cắm trại đồi Móng Ngựa', 'sa-pa', 'camping', 4.5, 310, 1, true, 22.35, 103.86],
  ['thang-co-cho-sapa', 'Thắng cố chợ Sapa', 'sa-pa', 'food', 4.3, 520, 1, false, 22.3356, 103.8437],
  ['deo-ma-pi-leng', 'Đèo Mã Pí Lèng', 'ha-giang', 'hiking', 4.9, 1900, 1, true, 23.2361, 105.4089],
  ['pho-co-dong-van', 'Phố cổ Đồng Văn', 'ha-giang', 'sightseeing', 4.6, 880, 1, true, 23.2786, 105.3614],
  ['pho-bat-dan', 'Phở Bát Đàn', 'ha-noi', 'food', 4.6, 3200, 1, true, 21.0343, 105.8466],
  ['ho-hoan-kiem', 'Hồ Hoàn Kiếm', 'ha-noi', 'sightseeing', 4.8, 5100, 1, true, 21.0288, 105.8525],
  ['du-thuyen-vinh-ha-long', 'Du thuyền Vịnh Hạ Long', 'ha-long', 'stay', 4.8, 2700, 3, true, 20.9101, 107.1839],
  ['dao-ti-top', 'Đảo Ti Tốp', 'ha-long', 'hiking', 4.5, 900, 2, false, 20.8627, 107.0868],
  ['ban-dao-son-tra', 'Bán đảo Sơn Trà', 'da-nang', 'hiking', 4.7, 1300, 1, true, 16.1197, 108.2764],
  ['mi-quang-ba-mua', 'Mì Quảng Bà Mua', 'da-nang', 'food', 4.5, 1500, 1, true, 16.0678, 108.2208],
  ['ba-na-hills', 'Bà Nà Hills', 'da-nang', 'sightseeing', 4.6, 4100, 3, true, 15.9977, 107.9881],
  ['cam-trai-langbiang', 'Cắm trại Langbiang', 'da-lat', 'camping', 4.7, 760, 1, true, 12.0471, 108.4406],
  ['ca-phe-doi-thong', 'Cà phê đồi thông', 'da-lat', 'food', 4.4, 690, 2, false, 11.9311, 108.4297],
  ['resort-ven-ho-tuyen-lam', 'Resort ven hồ Tuyền Lâm', 'da-lat', 'stay', 4.8, 450, 3, true, 11.8989, 108.4296],
  ['pho-am-thuc-vinh-khanh', 'Phố ẩm thực Vĩnh Khánh', 'tp-hcm', 'food', 4.5, 2100, 1, true, 10.7609, 106.7054],
  ['bai-sao', 'Bãi Sao', 'phu-quoc', 'stay', 4.8, 1700, 2, true, 10.0578, 104.0364],
  ['cam-trai-hon-thom', 'Cắm trại Hòn Thơm', 'phu-quoc', 'camping', 4.4, 280, 2, true, 9.9536, 104.0186],
  // Bổ sung để gợi ý lịch trình đủ các buổi (BR-ITIN-02)
  ['homestay-dong-van', 'Homestay Đồng Văn', 'ha-giang', 'stay', 4.5, 400, 1, false, 23.2779, 105.3622],
  ['banh-cuon-trung-ha-giang', 'Bánh cuốn trứng Hà Giang', 'ha-giang', 'food', 4.4, 300, 1, false, 22.8233, 104.9836],
  ['ca-phe-trung-pho-co', 'Cà phê trứng phố cổ', 'ha-noi', 'food', 4.7, 1400, 1, false, 21.0341, 105.8514],
  ['khach-san-pho-co', 'Khách sạn phố cổ Hàng Bạc', 'ha-noi', 'stay', 4.5, 600, 2, false, 21.0345, 105.8527],
  ['cha-muc-ha-long', 'Chả mực Hạ Long', 'ha-long', 'food', 4.6, 800, 2, false, 20.9517, 107.0822],
  ['resort-bien-my-khe', 'Resort biển Mỹ Khê', 'da-nang', 'stay', 4.6, 900, 3, false, 16.0626, 108.2469],
  ['ho-xuan-huong', 'Hồ Xuân Hương', 'da-lat', 'sightseeing', 4.5, 1100, 1, false, 11.9423, 108.4432],
  ['cho-ben-thanh', 'Chợ Bến Thành', 'tp-hcm', 'sightseeing', 4.4, 3000, 1, false, 10.7725, 106.698],
  ['khach-san-quan-1', 'Khách sạn trung tâm Quận 1', 'tp-hcm', 'stay', 4.3, 500, 2, false, 10.7769, 106.7009],
  ['cho-dem-dinh-cau', 'Chợ đêm Dinh Cậu', 'phu-quoc', 'food', 4.5, 1200, 2, false, 10.2167, 103.9587],
];
export const FEATURED = new Set(['dinh-fansipan', 'ban-cat-cat', 'homestay-ta-van', 'cam-trai-doi-mong-ngua', 'thang-co-cho-sapa', 'deo-ma-pi-leng']);

