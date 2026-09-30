/**
 * Văn hóa Việt: chữ giao diện + nội dung biên tập tóm tắt (tổng hợp từ nguồn công khai, ưu tiên điều đã phổ biến,
 * không nêu số liệu chưa kiểm chứng). Quy tắc chữ: docs/content-style.md
 */
export const culture = {
  culture: {
    eyebrow: 'Văn hóa Việt', title: 'Hiểu một vùng đất trước khi đặt chân đến',
    lead: 'Biểu tượng, di sản, nghệ thuật và món ăn – mỗi chủ đề đọc trong vài phút, kèm những nơi bạn có thể tự mình trải nghiệm.',
    groups: { symbols: 'Biểu tượng', heritage: 'Di sản', life: 'Nghệ thuật & đời sống', cuisine: 'Ẩm thực' },
    groupSubs: {
      symbols: 'Những hình ảnh quen thuộc gắn với người Việt', heritage: 'Nơi lịch sử và thiên nhiên được gìn giữ',
      life: 'Nghệ thuật dân gian và nhịp sống thường ngày', cuisine: 'Món ăn kể chuyện vùng miền',
    },
    readMore: 'Đọc thêm', minutes: '{count} phút đọc', seeAll: 'Xem tất cả', homeCta: 'Tìm hiểu văn hóa',
    whereTitle: 'Trải nghiệm ở đâu', exploreDest: 'Khám phá {name}', exploreRegion: 'Xem địa điểm ở {region}',
    moreTopics: 'Chủ đề khác', note: 'Nội dung tóm tắt, tổng hợp từ nguồn công khai. Bạn thấy chỗ nào chưa đúng? Góp ý để TravelPad sửa nhé.',
    topics: {
      nonLa: {
        title: 'Nón lá', summary: 'Chiếc nón hình chóp che nắng che mưa, gắn với hình ảnh người Việt trên đồng ruộng và bến chợ.',
        body1: 'Nón lá được chằm từ lá (thường là lá nón, lá cọ) trên khung nhiều vòng tre chuốt mảnh. Dáng chóp giúp nước mưa trôi nhanh và che nắng rộng; vành nón còn được dùng để quạt, múc nước hay đựng đồ khi cần.',
        body2: 'Huế nổi tiếng với nón bài thơ – giữa hai lớp lá có lồng hình hoặc câu thơ, chỉ hiện ra khi soi nón lên ánh sáng. Bạn có thể tìm mua nón ở các làng nghề và chợ địa phương trên khắp cả nước.',
      },
      aoDai: {
        title: 'Áo dài', summary: 'Tà áo dài xẻ tà mặc cùng quần – trang phục của những dịp trang trọng và ngày Tết.',
        body1: 'Áo dài gồm thân áo dài chấm gót hoặc quá gối, xẻ hai bên từ eo, mặc cùng quần ống rộng. Dáng áo ôm người như ngày nay được định hình từ khoảng đầu thế kỷ 20 và vẫn tiếp tục được cách tân.',
        body2: 'Áo dài xuất hiện trong lễ cưới, ngày Tết, lễ hội và ở nhiều trường học. Nhiều điểm đến có tiệm cho thuê áo dài để bạn chụp ảnh ở phố cổ hay trong đền, chùa.',
      },
      trongDong: {
        title: 'Trống đồng Đông Sơn', summary: 'Bảo vật hơn 2.000 năm tuổi, mặt trống khắc ngôi sao, chim Lạc và cảnh sinh hoạt của người Việt cổ.',
        body1: 'Trống đồng thuộc văn hóa Đông Sơn, nền văn hóa thời đại kim khí ở lưu vực sông Hồng, sông Mã. Giữa mặt trống là ngôi sao nhiều cánh, bao quanh là các vành hoa văn: chim Lạc bay, thuyền, nhà sàn, người giã gạo, đánh trống.',
        body2: 'Trống đồng Ngọc Lũ và Hoàng Hạ là hai chiếc tiêu biểu, đều được công nhận là bảo vật quốc gia. Hoa văn chim Lạc trong logo TravelPad cũng lấy cảm hứng từ đây. Nên xem tận mắt ở Bảo tàng Lịch sử Quốc gia tại Hà Nội.',
      },
      hoaSen: {
        title: 'Hoa sen', summary: 'Loài hoa vươn lên từ bùn, thường được xem là biểu tượng cho sự thanh cao của người Việt.',
        body1: 'Sen mọc ở ao, đầm khắp ba miền, nở rộ vào mùa hè. Câu ca dao “Gần bùn mà chẳng hôi tanh mùi bùn” khiến sen trở thành hình ảnh quen thuộc trong văn chương, hội họa và kiến trúc chùa chiền.',
        body2: 'Mọi phần của cây sen đều được dùng: hạt sen nấu chè, lá sen gói xôi, tâm sen pha trà. Trà ướp hoa sen Hồ Tây là thức quà cầu kỳ của Hà Nội. Đầm sen đẹp nhất vào sáng sớm mùa hè.',
      },
      haLong: {
        title: 'Vịnh Hạ Long', summary: 'Gần hai nghìn hòn đảo đá vôi giữa làn nước xanh – di sản thiên nhiên thế giới được UNESCO công nhận.',
        body1: 'Vịnh Hạ Long ở Quảng Ninh là quần thể đảo đá vôi nhô lên từ mặt biển, được tạo nên qua hàng triệu năm. Nhiều đảo có hang động lớn và làng chài trên mặt nước.',
        body2: 'Cách phổ biến nhất để ngắm vịnh là đi tàu trong ngày hoặc ngủ đêm trên du thuyền, chèo kayak vào các áng nước kín. Mùa xuân và mùa thu trời trong, biển êm hơn.',
      },
      hoiAn: {
        title: 'Phố cổ Hội An', summary: 'Thương cảng xưa bên sông Thu Bồn với nhà cổ, hội quán và những đêm đèn lồng.',
        body1: 'Hội An từng là thương cảng sầm uất, nơi thương nhân Nhật Bản, Trung Hoa và phương Tây ghé buôn bán. Dấu ấn đó còn trong kiến trúc nhà gỗ, các hội quán và Chùa Cầu. Khu phố cổ được UNESCO công nhận là di sản văn hóa thế giới.',
        body2: 'Buổi tối, phố cổ lung linh đèn lồng lụa và hoa đăng trên sông. Nên đi bộ hoặc đạp xe, ghé thử cao lầu, bánh mì và mua đèn lồng làm quà.',
      },
      vanMieu: {
        title: 'Văn Miếu – Quốc Tử Giám', summary: 'Nơi thờ Khổng Tử và được xem là trường đại học đầu tiên của Việt Nam, giữa lòng Hà Nội.',
        body1: 'Văn Miếu được dựng vào thời Lý (năm 1070), sau đó Quốc Tử Giám được lập bên cạnh để dạy con vua quan và người học giỏi. Khuê Văn Các – gác nhỏ với bốn ô cửa tròn – nay là biểu tượng của Hà Nội.',
        body2: 'Trong khuôn viên có các bia tiến sĩ khắc tên người đỗ đạt qua các khoa thi, được UNESCO ghi danh là di sản tư liệu. Mùa thi, nhiều học sinh đến đây cầu may.',
      },
      hue: {
        title: 'Cố đô Huế', summary: 'Kinh đô của triều Nguyễn bên sông Hương – thành quách, lăng tẩm và nhã nhạc cung đình.',
        body1: 'Huế là kinh đô của Việt Nam dưới triều Nguyễn (1802–1945). Quần thể di tích Cố đô Huế gồm Kinh thành, Hoàng thành, các lăng vua và nhiều đền miếu, được UNESCO công nhận là di sản văn hóa thế giới.',
        body2: 'Nhã nhạc cung đình Huế cũng là di sản văn hóa phi vật thể được UNESCO ghi danh. Hãy dành một buổi đi thuyền trên sông Hương và thử các món ăn cung đình, bún bò Huế.',
      },
      muaRoiNuoc: {
        title: 'Múa rối nước', summary: 'Loại hình sân khấu dân gian độc đáo của đồng bằng sông Hồng, con rối diễn trên mặt nước.',
        body1: 'Múa rối nước ra đời từ các làng quê trồng lúa nước. Nghệ nhân đứng sau tấm mành, điều khiển con rối bằng sào và dây ngầm dưới nước. Các tích trò kể chuyện cày cấy, câu cá, đua thuyền, múa rồng, múa tiên.',
        body2: 'Chú Tễu là nhân vật dẫn chuyện vui nhộn quen thuộc. Ở Hà Nội, bạn có thể xem múa rối nước tại các nhà hát gần hồ Hoàn Kiếm; buổi diễn kèm nhạc dân tộc và hát chèo.',
      },
      choNoi: {
        title: 'Chợ nổi miền Tây', summary: 'Chợ họp ngay trên sông, ghe thuyền treo hàng lên cây bẹo để mời khách từ xa.',
        body1: 'Ở đồng bằng sông Cửu Long, sông ngòi là đường đi chính nên chợ họp trên mặt nước. Mỗi ghe treo mẫu hàng lên một cây sào cao gọi là cây bẹo – nhìn là biết ghe bán gì.',
        body2: 'Chợ nổi Cái Răng (Cần Thơ) là một trong những chợ lớn và dễ đến nhất. Chợ đông vào sáng sớm; hãy thử ăn hủ tiếu, uống cà phê ngay trên ghe.',
      },
      pho: {
        title: 'Phở', summary: 'Bát bánh phở nước dùng trong, thơm quế hồi – món ăn được nhắc tới nhiều nhất khi nói về ẩm thực Việt.',
        body1: 'Phở ra đời ở miền Bắc vào khoảng đầu thế kỷ 20. Nước dùng ninh từ xương, thơm quế, hồi, gừng nướng; ăn cùng bánh phở mềm và thịt bò hoặc gà.',
        body2: 'Phở Hà Nội thường thanh vị, ít rau ăn kèm; phở miền Nam hay có giá, rau húng và tương. Người Hà Nội ăn phở vào bữa sáng, nhiều quán gia truyền bán hết từ trưa.',
      },
      banhMi: {
        title: 'Bánh mì', summary: 'Ổ bánh mì giòn kẹp pa-tê, chả, rau thơm và đồ chua – món ăn đường phố ai cũng thích.',
        body1: 'Bánh mì được người Pháp đưa vào Việt Nam, rồi người Việt làm ổ bánh nhẹ, vỏ giòn hơn và kẹp nhân theo cách riêng: pa-tê, chả lụa, thịt nguội, trứng, rau thơm, dưa góp, nước sốt.',
        body2: 'Mỗi vùng có kiểu bánh mì riêng, nổi tiếng nhất là ở Sài Gòn và Hội An. Bánh mì bán từ sáng sớm đến khuya ở xe đẩy, tiệm nhỏ ven đường.',
      },
      caPhe: {
        title: 'Cà phê', summary: 'Cà phê phin nhỏ giọt, cà phê sữa đá, cà phê trứng – văn hóa ngồi quán của người Việt.',
        body1: 'Việt Nam là một trong những nước xuất khẩu cà phê lớn trên thế giới, phần lớn là cà phê vối trồng ở Tây Nguyên. Cà phê pha phin nhỏ giọt chậm, uống đen hoặc với sữa đặc, thêm đá.',
        body2: 'Hà Nội có cà phê trứng béo ngậy; Sài Gòn có cà phê vỉa hè; Đà Lạt có quán cà phê giữa đồi thông. Ngồi quán cà phê là cách hay để ngắm nhịp sống địa phương.',
      },
    },
  },
};
