export interface Question {
  id: number;
  letter: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export const questions: Question[] = [
  {
    id: 1,
    letter: "A",
    question: "Theo tư tưởng Hồ Chí Minh, đại đoàn kết toàn dân tộc có vai trò chiến lược như thế nào trong sự nghiệp cách mạng?",
    options: [
      "Là một thủ thuật chính trị nhất thời trong chiến tranh",
      "Là nhân tố quyết định thành bại, là đường lối chiến lược xuyên suốt",
      "Chỉ quan trọng trong giai đoạn đấu tranh giành chính quyền",
      "Là biện pháp hỗ trợ cho lực lượng vũ trang chính quy"
    ],
    answerIndex: 1,
    explanation: "Đại đoàn kết toàn dân tộc không phải là một khẩu hiệu hay thủ thuật nhất thời, mà là đường lối chiến lược lâu dài, nhất quán xuyên suốt toàn bộ tiến trình cách mạng Việt Nam, quyết định sự thành bại của sự nghiệp cách mạng."
  },
  {
    id: 2,
    letter: "B",
    question: "Bác Hồ đã tổng kết chân lý lịch sử vĩ đại nào qua câu thơ: 'Đoàn kết, đoàn kết, đại đoàn kết / Thành công, thành công, đại thành công'?",
    options: [
      "Đoàn kết càng rộng rãi thì thành công càng to lớn và vững chắc",
      "Chỉ cần đoàn kết trong nội bộ Đảng là đủ chiến thắng mọi kẻ thù",
      "Thành công của cách mạng hoàn toàn phụ thuộc vào viện trợ quốc tế",
      "Đoàn kết là kết quả tự nhiên sau khi đã giành được thắng lợi"
    ],
    answerIndex: 0,
    explanation: "Câu nói nổi tiếng của Người nhấn mạnh quy luật nhân quả của cách mạng: Đoàn kết là nguồn gốc của sức mạnh, đoàn kết càng rộng rãi, đồng lòng từ nhân dân thì thắng lợi gặt hái được càng to lớn và toàn diện."
  },
  {
    id: 3,
    letter: "C",
    question: "Trong khối đại đoàn kết toàn dân tộc, lực lượng nào được xác định là nền tảng, là 'gốc' của khối đại đoàn kết?",
    options: [
      "Liên minh công nhân - nông dân và tầng lớp trí thức",
      "Các nhà tư sản dân tộc và phú nông yêu nước",
      "Các tổ chức tôn giáo và nhân sĩ yêu nước lớn tuổi",
      "Các lực lượng vũ trang giải phóng quân"
    ],
    answerIndex: 0,
    explanation: "Hồ Chí Minh khẳng định khối đại đoàn kết toàn dân tộc phải dựa trên cơ sở liên minh công - nông - trí thức, do Đảng Cộng sản lãnh đạo. Đây là lực lượng đông đảo nhất, chịu áp bức nhiều nhất và là động lực cốt lõi của cách mạng."
  },
  {
    id: 4,
    letter: "D",
    question: "Để xây dựng khối đại đoàn kết toàn dân tộc rộng rãi, nguyên tắc hàng đầu trong ứng xử của Chủ tịch Hồ Chí Minh là gì?",
    options: [
      "Nghiêm khắc trừng trị những người có quan điểm khác biệt",
      "Tin vào dân, dựa vào dân, khoan dung và tìm kiếm điểm tương đồng",
      "Áp đặt tuyệt đối tư tưởng cá nhân lên mọi tầng lớp xã hội",
      "Chỉ tập hợp những người có cùng tôn giáo và giai cấp xuất thân"
    ],
    answerIndex: 1,
    explanation: "Người chủ trương 'cầu đồng tồn dị' - tìm kiếm điểm chung lớn nhất là lòng yêu nước, độc lập dân tộc để tập hợp lực lượng, đồng thời có lòng khoan dung độ lượng đối với những người lầm đường lạc lối nhưng biết hối cải."
  },
  {
    id: 5,
    letter: "E",
    question: "Hình thức tổ chức cụ thể của khối đại đoàn kết toàn dân tộc dưới sự lãnh đạo của Đảng là gì?",
    options: [
      "Hợp tác xã nông nghiệp kiểu mới",
      "Chính phủ lâm thời Cộng hòa miền Nam Việt Nam",
      "Mặt trận dân tộc thống nhất (như Mặt trận Việt Minh, Liên Việt, Tổ quốc...)",
      "Các câu lạc bộ tự nguyện của thanh niên yêu nước"
    ],
    answerIndex: 2,
    explanation: "Mặt trận Dân tộc Thống nhất là nơi quy tụ, tập hợp rộng rãi nhất mọi tổ chức, cá nhân yêu nước, không phân biệt giai cấp, tôn giáo, dân tộc để chung tay thực hiện mục tiêu chung của đất nước."
  },
  {
    id: 6,
    letter: "F",
    question: "Chủ tịch Hồ Chí Minh chỉ ra yếu tố cốt lõi nào là hạt nhân lãnh đạo và giữ vững khối đại đoàn kết toàn dân tộc?",
    options: [
      "Sự chỉ đạo trực tiếp từ các đồng minh quốc tế",
      "Vai trò lãnh đạo của Đảng Cộng sản Việt Nam",
      "Sức mạnh tài chính của các nhà tư sản yêu nước",
      "Lực lượng thanh niên xung phong tình nguyện"
    ],
    answerIndex: 1,
    explanation: "Đảng Cộng sản Việt Nam vừa là một thành viên của Mặt trận, vừa là hạt nhân lãnh đạo Mặt trận. Sự lãnh đạo đúng đắn của Đảng là bảo đảm duy nhất để khối đại đoàn kết không bị chệch hướng và phân rã."
  },
  {
    id: 7,
    letter: "G",
    question: "Động lực sâu xa và mục tiêu tối cao để quy tụ sức mạnh đại đoàn kết toàn dân tộc là gì?",
    options: [
      "Lợi ích cục bộ của giai cấp công nhân",
      "Độc lập tự do của Tổ quốc và hạnh phúc của nhân dân",
      "Mở rộng tầm ảnh hưởng địa chính trị của quốc gia",
      "Xây dựng một nền kinh tế khép kín, tự cung tự cấp"
    ],
    answerIndex: 1,
    explanation: "Quyền lợi tối cao của dân tộc và lợi ích thiết thực của nhân dân chính là điểm tương đồng lớn nhất để khơi dậy tinh thần yêu nước, tập hợp mọi lực lượng vào cuộc đấu tranh giải phóng dân tộc và xây dựng đất nước."
  },
  {
    id: 8,
    letter: "H",
    question: "Mặt trận Việt Minh (Việt Nam Độc lập Đồng minh) được thành lập vào năm nào dưới sự chủ trì trực tiếp của Nguyễn Ái Quốc?",
    options: [
      "Năm 1930",
      "Năm 1941",
      "Năm 1945",
      "Năm 1954"
    ],
    answerIndex: 1,
    explanation: "Tháng 5/1941, tại Hội nghị Trung ương Đảng lần thứ 8 ở Pác Bó (Cao Bằng), Nguyễn Ái Quốc đã sáng lập Mặt trận Việt Minh, tạo nên bước ngoặt vĩ đại trong việc tập hợp lực lượng toàn dân tiến tới Cách mạng Tháng Tám."
  },
  {
    id: 9,
    letter: "I",
    question: "Câu ca dao được Bác Hồ vận dụng: 'Bầu ơi thương lấy bí cùng / Tuy rằng khác giống nhưng chung một giàn' thể hiện tinh thần nào?",
    options: [
      "Chỉ yêu thương những người cùng dòng họ với mình",
      "Sự chấp nhận số phận nghèo khó của người lao động",
      "Tình yêu thương đồng bào, tinh thần tương thân tương ái, khoan dung độ lượng",
      "Quy luật sinh tồn cạnh tranh khốc liệt trong tự nhiên"
    ],
    answerIndex: 2,
    explanation: "Bác Hồ thường mượn văn hóa dân gian để nhắc nhở rằng dù có sự khác biệt nhất định về hoàn cảnh, dân tộc hay tôn giáo, nhân dân Việt Nam đều chung một cội nguồn Tổ quốc và cần đùm bọc lẫn nhau."
  },
  {
    id: 10,
    letter: "J",
    question: "Theo Hồ Chí Minh, để đại đoàn kết toàn dân tộc thực sự bền vững thì lòng tin phải bắt nguồn từ đâu?",
    options: [
      "Lòng yêu nước, tin vào sức mạnh và tinh thần tự giác của nhân dân",
      "Sự đe dọa bằng các hình phạt pháp lý nghiêm khắc",
      "Những lời hứa hẹn vật chất chưa được kiểm chứng",
      "Lòng tin mù quáng vào các thế lực siêu nhiên"
    ],
    answerIndex: 0,
    explanation: "Bác Hồ khẳng định: 'Trong bầu trời không gì quý bằng nhân dân. Trong thế giới không gì mạnh bằng lực lượng đoàn kết của nhân dân'. Lòng tin vào sức mạnh vô địch của dân là gốc rễ của mọi thắng lợi."
  },
  {
    id: 11,
    letter: "K",
    question: "Trong bài báo 'Dân vận' (1949), Bác Hồ viết: 'Dân vận kém thì việc gì cũng kém. Dân vận khéo thì... '?",
    options: [
      "Mọi việc sẽ tự động hoàn thành",
      "Việc gì cũng thành công",
      "Không cần đến cán bộ chỉ đạo",
      "Chỉ cần làm nửa chừng là đủ"
    ],
    answerIndex: 1,
    explanation: "Người nhấn mạnh công tác vận động quần chúng (dân vận khéo) chính là chìa khóa để tập hợp sức mạnh nhân dân, khơi dậy tinh thần tự giác đồng lòng tham gia kháng chiến và kiến quốc."
  },
  {
    id: 12,
    letter: "L",
    question: "Khái niệm 'Đoàn kết quốc tế' trong tư tưởng Hồ Chí Minh nhằm mục đích chủ yếu nào?",
    options: [
      "Tìm kiếm sự can thiệp quân sự trực tiếp của các nước lớn",
      "Phụ thuộc hoàn toàn vào đường lối đối ngoại của các nước xã hội chủ nghĩa",
      "Kết hợp sức mạnh dân tộc với sức mạnh thời đại, tạo thế trận ủng hộ Việt Nam rộng khắp",
      "Đưa đất nước tham gia vào các liên minh quân sự đối đầu trực tiếp"
    ],
    answerIndex: 2,
    explanation: "Đoàn kết quốc tế là để tranh thủ sự đồng tình, ủng hộ của nhân dân yêu chuộng hòa bình trên thế giới, chuyển hóa sức mạnh chính nghĩa của dân tộc thành sức mạnh thời đại, cô lập kẻ thù xâm lược."
  },
  {
    id: 13,
    letter: "M",
    question: "Lời khẳng định đanh thép: 'Nước Việt Nam là một, dân tộc Việt Nam là một. Sông có thể cạn, núi có thể mòn, song chân lý ấy không bao giờ thay đổi' phản ánh tinh thần gì?",
    options: [
      "Ý chí kiên quyết bảo vệ toàn vẹn lãnh thổ và thống nhất quốc gia",
      "Dự báo về những thay đổi khí hậu và địa chất ở Việt Nam",
      "Ý thức tự mãn về tài nguyên thiên nhiên phong phú",
      "Chỉ là lời thơ ca lãng mạn hóa cuộc sống chiến khu"
    ],
    answerIndex: 0,
    explanation: "Lời tuyên bố của Người khắc sâu ý chí độc lập thống nhất Bắc - Nam một nhà, củng cố lòng tin sắt đá của toàn dân tộc chống lại mọi âm mưu chia cắt đất nước của thực dân đế quốc."
  },
  {
    id: 14,
    letter: "N",
    question: "Để củng cố khối đại đoàn kết trong Đảng, Chủ tịch Hồ Chí Minh yêu cầu toàn thể đảng viên phải coi trọng điều gì nhất?",
    options: [
      "Coi giữ gìn sự đoàn kết thống nhất trong Đảng như giữ gìn con ngươi của mắt mình",
      "Tránh thảo luận các vấn đề nhạy cảm để giữ hòa khí bề ngoài",
      "Tuyệt đối trung thành với ý kiến của các cấp trên bất kể đúng sai",
      "Ưu tiên nâng cao vị thế và quyền lợi cá nhân trước hết"
    ],
    answerIndex: 0,
    explanation: "Trong Di chúc, Người căn dặn: 'Đoàn kết là một truyền thống cực kỳ quý báu của Đảng và của dân ta... Các đồng chí từ Trung ương đến các chi bộ cần phải giữ gìn sự đoàn kết nhất trí của Đảng như giữ gìn con ngươi của mắt mình'."
  },
  {
    id: 15,
    letter: "O",
    question: "Tổ chức nào ngày nay tiếp tục kế thừa và phát huy sứ mệnh tập hợp khối đại đoàn kết toàn dân tộc tại Việt Nam?",
    options: [
      "Hiệp hội các doanh nghiệp vừa và nhỏ Việt Nam",
      "Mặt trận Tổ quốc Việt Nam",
      "Liên đoàn bóng đá Việt Nam",
      "Hội cựu du học sinh Việt Nam tại nước ngoài"
    ],
    answerIndex: 1,
    explanation: "Mặt trận Tổ quốc Việt Nam chính là tổ chức kế thừa trực tiếp vai trò của Mặt trận Việt Minh và các mặt trận trước đây, là liên minh chính trị rộng rãi tập hợp khối đại đoàn kết toàn dân tộc hiện nay."
  },
  {
    id: 16,
    letter: "P",
    question: "Phương châm nào của Hồ Chí Minh giúp giải quyết hài hòa các mâu thuẫn, khác biệt lợi ích giữa các tầng lớp trong nhân dân?",
    options: [
      "Đặt lợi ích quốc gia - dân tộc lên trên hết, tôn trọng và bảo đảm lợi ích chính đáng của cá nhân, tập thể",
      "Xóa bỏ hoàn toàn mọi tư hữu và quyền lợi riêng của cá nhân",
      "Bỏ mặc các mâu thuẫn tự phát sinh và tự biến mất",
      "Cưỡng ép tất cả các giai cấp có chung một mức thu nhập bằng nhau"
    ],
    answerIndex: 0,
    explanation: "Để đoàn kết bền vững, phải giải quyết hài hòa mối quan hệ lợi ích: kết hợp hài hòa lợi ích cá nhân, tập thể và lợi ích quốc gia, lấy lợi ích chung của đất nước làm điểm quy tụ tối cao."
  }
];
