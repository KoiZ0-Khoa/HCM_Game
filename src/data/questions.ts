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
    question: "Theo Hồ Chí Minh, chủ thể của khối đại đoàn kết toàn dân tộc là ai?",
    options: [
      "Giai cấp công nhân",
      "Đội ngũ trí thức",
      "Toàn thể nhân dân Việt Nam yêu nước",
      "Chỉ những người tham gia cách mạng"
    ],
    answerIndex: 2,
    explanation: "Theo Hồ Chí Minh, chủ thể của khối đại đoàn kết toàn dân tộc là toàn thể nhân dân Việt Nam yêu nước, không phân biệt giai cấp, tầng lớp, tôn giáo, dân tộc."
  },
  {
    id: 2,
    letter: "B",
    question: "Trong tư tưởng Hồ Chí Minh, “nhân dân” được hiểu như thế nào?",
    options: [
      "Chỉ gồm công nhân và nông dân",
      "Chỉ gồm những người sống trong nước",
      "Chỉ gồm những người có cùng tôn giáo, dân tộc",
      "Gồm tất cả người Việt Nam yêu nước, không phân biệt giai cấp, tầng lớp, tôn giáo, dân tộc, trong nước hay ngoài nước"
    ],
    answerIndex: 3,
    explanation: "Nhân dân trong tư tưởng Hồ Chí Minh là một khái niệm rộng lớn, tập hợp tất cả những người Việt Nam yêu nước, không phân biệt giai cấp, tầng lớp, tôn giáo, dân tộc, dù ở trong nước hay kiều bào ở nước ngoài."
  },
  {
    id: 3,
    letter: "C",
    question: "Ý nào sau đây thể hiện đúng quan điểm đoàn kết của Hồ Chí Minh?",
    options: [
      "Đoàn kết càng hẹp càng dễ quản lý",
      "Chỉ đoàn kết với những người có cùng xuất thân giai cấp",
      "Đoàn kết rộng rãi, bao dung nhưng vẫn có nguyên tắc",
      "Đoàn kết là không cần mục tiêu chung"
    ],
    answerIndex: 2,
    explanation: "Đoàn kết rộng rãi phải luôn đi đôi với bao dung, độ lượng đối với mọi người Việt Nam yêu nước, nhưng phải có nguyên tắc vững vàng dựa trên lợi ích tối cao của dân tộc."
  },
  {
    id: 4,
    letter: "D",
    question: "Đại đoàn kết toàn dân tộc phải dựa trên mục tiêu chung nào?",
    options: [
      "Độc lập dân tộc, thống nhất Tổ quốc, tự do và hạnh phúc của nhân dân",
      "Phát triển kinh tế bằng mọi giá",
      "Lợi ích riêng của từng nhóm xã hội",
      "Mở rộng quan hệ quốc tế là mục tiêu duy nhất"
    ],
    answerIndex: 0,
    explanation: "Đại đoàn kết toàn dân tộc phải có điểm quy tụ chung là Độc lập dân tộc, thống nhất Tổ quốc, tự do và hạnh phúc của nhân dân, giải quyết hài hòa các lợi ích khác biệt trên cơ sở mục tiêu chung đó."
  },
  {
    id: 5,
    letter: "E",
    question: "Vì sao Hồ Chí Minh nhấn mạnh khối đại đoàn kết toàn dân tộc cần có nền tảng vững chắc?",
    options: [
      "Vì đoàn kết chỉ cần hình thức bên ngoài",
      "Vì khối đại đoàn kết muốn rộng lớn và lâu dài thì phải có điểm tựa ổn định",
      "Vì chỉ cần một lực lượng lãnh đạo là đủ",
      "Vì nhân dân không có vai trò quan trọng trong cách mạng"
    ],
    answerIndex: 1,
    explanation: "Để khối đại đoàn kết toàn dân tộc thực sự bền vững và có sức mạnh to lớn, nó cần phải được xây dựng trên một nền tảng vững chắc và ổn định của khối liên minh công - nông - trí thức."
  },
  {
    id: 6,
    letter: "F",
    question: "Hồ Chí Minh ví nền tảng của khối đại đoàn kết toàn dân tộc giống với hình ảnh nào?",
    options: [
      "Ngọn đèn và ánh sáng",
      "Con thuyền và dòng sông",
      "Nền của nhà, gốc của cây",
      "Ngọn núi và biển cả"
    ],
    answerIndex: 2,
    explanation: "Hồ Chí Minh khẳng định: 'Đoàn kết phải có nền tảng. Nền có vững nhà mới chắc, gốc có sâu cây mới tốt. Nền tảng của đại đoàn kết toàn dân tộc là liên minh công - nông - trí thức'."
  },
  {
    id: 7,
    letter: "G",
    question: "Trong liên minh công nhân – nông dân – trí thức, giai cấp công nhân được nhấn mạnh với đặc điểm nào?",
    options: [
      "Đông đảo nhất trong xã hội Việt Nam truyền thống",
      "Có tinh thần cách mạng, tính tổ chức và kỷ luật cao",
      "Chỉ có vai trò trong sản xuất nông nghiệp",
      "Chủ yếu đóng góp về văn hóa nghệ thuật"
    ],
    answerIndex: 1,
    explanation: "Giai cấp công nhân Việt Nam tuy số lượng không lớn lúc bấy giờ nhưng có tinh thần cách mạng triệt để, có tính tổ chức và tính kỷ luật cao nhờ phương thức sản xuất hiện đại, là lực lượng lãnh đạo cách mạng."
  },
  {
    id: 8,
    letter: "H",
    question: "Đội ngũ trí thức có vai trò gì trong khối đại đoàn kết?",
    options: [
      "Đóng góp về tư tưởng, khoa học, kỹ thuật, giáo dục, văn hóa và quản lý xã hội",
      "Chỉ tham gia vào hoạt động quân sự",
      "Không có vai trò quan trọng trong cách mạng",
      "Chỉ là lực lượng hỗ trợ tạm thời"
    ],
    answerIndex: 0,
    explanation: "Trí thức là một bộ phận không thể thiếu trong khối liên minh, đóng vai trò then chốt trong việc truyền bá tư tưởng, phát triển khoa học, kỹ thuật, nâng cao dân trí và phát triển đất nước."
  },
  {
    id: 9,
    letter: "I",
    question: "Câu nói “Đoàn kết, đoàn kết, đại đoàn kết/ Thành công, thành công, đại thành công” thể hiện điều gì?",
    options: [
      "Vai trò của kinh tế",
      "Vai trò của quân sự",
      "Vai trò của đại đoàn kết dân tộc",
      "Vai trò của khoa học công nghệ"
    ],
    answerIndex: 2,
    explanation: "Câu thơ nổi tiếng của Chủ tịch Hồ Chí Minh là chân lý đúc kết sâu sắc về vai trò cực kỳ quan trọng của đại đoàn kết toàn dân tộc, quyết định sự thành bại và tầm vóc thành công của cách mạng."
  },
  {
    id: 10,
    letter: "J",
    question: "Theo Hồ Chí Minh, Đảng giữ vai trò gì trong Mặt trận dân tộc thống nhất?",
    options: [
      "Chỉ lãnh đạo",
      "Chỉ tham gia",
      "Vừa là thành viên vừa lãnh đạo",
      "Không tham gia"
    ],
    answerIndex: 2,
    explanation: "Đảng Cộng sản Việt Nam vừa là một thành viên bình đẳng của Mặt trận dân tộc thống nhất, vừa là lực lượng giữ vai trò hạt nhân lãnh đạo Mặt trận thông qua đường lối đúng đắn và sự gương mẫu của đảng viên."
  },
  {
    id: 11,
    letter: "K",
    question: "Theo Hồ Chí Minh, yếu tố “hạt nhân” trong khối đại đoàn kết toàn dân tộc là gì?",
    options: [
      "Nhân dân lao động",
      "Mặt trận dân tộc thống nhất",
      "Đoàn kết và thống nhất trong Đảng",
      "Quốc hội"
    ],
    answerIndex: 2,
    explanation: "Đoàn kết và thống nhất trong Đảng chính là hạt nhân, là cơ sở vững chắc nhất để xây dựng và giữ vững khối đại đoàn kết toàn dân tộc rộng rãi bên ngoài."
  },
  {
    id: 12,
    letter: "L",
    question: "Theo Hồ Chí Minh, nếu dân tộc không đoàn kết thì điều gì sẽ xảy ra?",
    options: [
      "Đất nước phát triển chậm",
      "Bị nước ngoài xâm lấn",
      "Kinh tế suy giảm",
      "Không có giao lưu quốc tế"
    ],
    answerIndex: 1,
    explanation: "Lịch sử đã chứng minh khi nào toàn dân tộc đoàn kết một lòng thì bờ cõi được giữ vững, ngược lại nếu chia rẽ, mất đoàn kết sẽ tạo cơ hội cho giặc ngoại xâm dòm ngó và xâm lấn đất nước."
  }
];
