/** Khung ứng dụng: điều hướng, chào mừng, đăng nhập, cài đặt. Quy tắc chữ: docs/content-style.md */
export const core = {
  brand: { tagline: 'Sổ tay du lịch cộng đồng' },
  nav: {
    home: 'Trang chủ', explore: 'Khám phá', map: 'Khám phá', mapShort: 'Khám phá', culture: 'Văn hóa', community: 'Cộng đồng', posts: 'Bài viết', exploreVn: 'Khám phá Việt Nam', about: 'Giới thiệu', placesTab: 'Địa điểm', itineraryTab: 'Lịch trình', stories: 'Câu chuyện', connect: 'Dịch vụ', me: 'Tôi', connectShort: 'Dịch vụ', following: 'Theo dõi', journeys: 'Hành trình',
    profile: 'Cá nhân', create: 'Viết bài', itinerary: 'Lịch trình', write: 'Viết bài', notifications: 'Thông báo', settings: 'Cài đặt',
    signIn: 'Đăng nhập', signOut: 'Đăng xuất', signUp: 'Đăng ký', login: 'Đăng nhập',
  },
  me: {
    guestTitle: 'Xin chào!', guestLead: 'Đăng nhập để chấm sao, lưu hành trình và theo dõi những người bạn thích.',
    signUp: 'Tạo tài khoản', myProfile: 'Hồ sơ của tôi', stories: 'Câu chuyện du lịch', becomeProvider: 'Đăng ký nhà cung cấp',
  },
  guest: {
    banner: 'Bạn đang xem với tư cách khách – cứ thoải mái tìm kiếm. Đăng nhập để chấm sao, lưu hành trình và viết bài.',
    loginPrompt: 'Đăng nhập để dùng tính năng này',
  },
  locked: {
    title: 'Dành cho thành viên',
    profile: 'Đăng nhập để lưu hành trình, địa điểm yêu thích và viết câu chuyện của bạn.',
    footprints: 'Đăng nhập để lưu lại dấu chân trên mọi hành trình.',
  },
  auth: {
    title: 'Đăng nhập TravelPad', signUpTitle: 'Tạo tài khoản TravelPad',
    lead: 'Lưu hành trình, theo dõi người bạn thích và kể lại chuyến đi của mình.',
    email: 'Email', password: 'Mật khẩu', displayName: 'Tên hiển thị',
    toSignUp: 'Chưa có tài khoản? Đăng ký', toSignIn: 'Đã có tài khoản? Đăng nhập',
    close: 'Đóng',
  },
  settings: {
    title: 'Cài đặt', lead: 'Ngôn ngữ, giao diện và quyền riêng tư.',
    language: 'Ngôn ngữ', display: 'Giao diện', theme: 'Chế độ màu', light: 'Sáng', dark: 'Tối', system: 'Theo thiết bị',
    mapStyle: 'Kiểu bản đồ', classic: 'Cổ điển', terrain: 'Địa hình', satellite: 'Vệ tinh',
    largeText: 'Chữ cỡ lớn', dataSaver: 'Tiết kiệm dữ liệu',
    notifications: 'Thông báo', notifyFollowing: 'Người bạn theo dõi có câu chuyện mới', notifyHot: 'Gợi ý điểm hot mỗi tuần', notifyComments: 'Bình luận và lượt thích',
    account: 'Tài khoản & quyền riêng tư', shareLocation: 'Chia sẻ vị trí trong hành trình',
    privacy: 'Quyền riêng tư',
  },
  footer: {
    about: 'Sổ tay du lịch Việt Nam do cộng đồng xây dựng và phát triển: điểm sao từ người đã đến, câu chuyện thật và dịch vụ được cộng đồng tin chọn.',
    discover: 'Khám phá', community: 'Cộng đồng', business: 'Dành cho doanh nghiệp', rights: 'Bảo lưu mọi quyền.', madeIn: 'Làm tại Việt Nam', photoCredits: 'Nguồn ảnh',
  },
  credits: { title: 'Nguồn ảnh', lead: 'Ảnh trên TravelPad lấy từ Wikimedia Commons theo giấy phép tự do. Cảm ơn các tác giả đã chia sẻ.', photo: 'Ảnh', author: 'Tác giả', license: 'Giấy phép', view: 'Xem gốc', note: 'Ảnh món ăn, chỗ ở và ảnh bìa dịch vụ là ảnh minh họa, không phải ảnh của chính quán hay cơ sở đó.' },
  common: { loading: 'Đang tải…', error: 'Đã có lỗi. Bạn thử lại sau ít phút nhé.', retry: 'Thử lại', seeAll: 'Xem tất cả', photoBy: 'Ảnh: {artist} · {license}' },
  about: {
    eyebrow: 'Về TravelPad', title: 'Đồng hành cùng du\u00a0lịch Việt',
    lead: 'Cộng đồng trải nghiệm, đánh giá và cùng phát\u00a0triển văn hóa du lịch Việt Nam.',
    howTitle: 'Một chuyến đi trọn vẹn bắt đầu từ đây',
    s1Title: 'Lên lịch trình', s1Body: 'Chọn điểm đến và số ngày, TravelPad xếp sẵn lịch Sáng – Trưa – Chiều – Tối trên bản đồ. Bớt tra cứu, thêm thời gian cho chuyến đi.',
    s2Title: 'Chọn dịch vụ đáng tin', s2Body: 'Chỗ ở, quán ăn, xe, hướng dẫn viên tại điểm đến – điểm sao từ người đã dùng, liên hệ thẳng với nhà cung cấp.',
    s3Title: 'Hiểu văn hóa Việt', s3Body: 'Nón lá, áo dài, di sản, ẩm thực… mỗi chủ đề đọc trong vài phút, kèm nơi để bạn tự mình trải nghiệm.',
    s1Cta: 'Tạo lịch trình', s2Cta: 'Xem dịch vụ', s3Cta: 'Tìm hiểu văn hóa',
    missionTitle: 'Điều TravelPad theo đuổi',
    healthyTitle: 'Du lịch lành mạnh, minh bạch',
    healthyBody: 'Điểm sao do người trải nghiệm chấm; chỉ người đã kết nối mới chấm sao được dịch vụ. Không thu phí đặt chỗ – bạn thống nhất giá trực tiếp với nhà cung cấp.',
    localTitle: 'Góp sức cho du lịch nước nhà',
    localBody: 'Mỗi câu chuyện bạn kể, mỗi homestay hay quán ăn địa phương bạn chọn đều giúp điểm đến được biết đến nhiều hơn và người làm du lịch có thêm cơ hội.',
    providerTitle: 'Dành cho nhà cung cấp', start: 'Bắt đầu khám phá', plan: 'Lên lịch trình',
  },
  /** Chú thích ảnh polaroid trang trí hai lề (components/decor) */
  decor: { khueVanCac: 'Văn Miếu', hoanKiem: 'Hồ Gươm', haLong: 'Vịnh Hạ Long', muCangChai: 'Mù Cang Chải', pho: 'Phở Hà Nội', hoiAn: 'Phố cổ Hội An', cauVang: 'Cầu Vàng', miQuang: 'Mì Quảng', benThanh: 'Chợ Bến Thành', caiRang: 'Chợ nổi Cái Răng' },
};
