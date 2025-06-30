import bcrypt from 'bcryptjs';
export async function seed(knex) {
  // 1. Tạo user public nếu chưa có
  let publicUser = await knex('users')
    .where({ email: 'public@memorix.com' })
    .first();
  if (!publicUser) {
    const [user] = await knex('users')
      .insert({
        username: 'public',
        email: 'public@memorix.com',
        password_hash: '',
        is_verified: true,
      })
      .returning('*');
    publicUser = user;
  }
  
let demoUser = await knex('users')
    .where({ email: 'demo@memorix.com' })
    .first();
  if (!demoUser) {
    const passwordHash = await bcrypt.hash('demo123', 10);
    const [user] = await knex('users')
      .insert({
        username: 'demo',
        email: 'demo@memorix.com',
        password_hash: passwordHash,
        is_verified: true,
      })
      .returning('*');
    demoUser = user;
  }
  // --------- Deck 1: 100 English Communication Words ---------
  const [deck1] = await knex('decks')
    .insert({
      user_id: publicUser.user_id,
      name: '100 English Communication Words',
      description:
        '100 từ vựng tiếng Anh giao tiếp cơ bản, thường gặp trong đời sống hàng ngày. Phù hợp cho người mới bắt đầu hoặc ôn luyện nền tảng.',
      is_public: true,
      image_url: null,
      category: 'Tiếng Anh',
    })
    .returning('*');

  const words = [
    ['hello', 'xin chào', 'Hello, how are you?'],
    ['goodbye', 'tạm biệt', 'Goodbye! See you soon.'],
    ['thank you', 'cảm ơn', 'Thank you for your help.'],
    ['sorry', 'xin lỗi', 'Sorry, I’m late.'],
    ['please', 'làm ơn', 'Please, open the door.'],
    ['yes', 'vâng', 'Yes, I understand.'],
    ['no', 'không', 'No, I don’t know.'],
    ['excuse me', 'xin lỗi/làm phiền', 'Excuse me, where is the restroom?'],
    ['how much', 'bao nhiêu', 'How much is this?'],
    ['help', 'giúp đỡ', 'Help! I need assistance.'],
    ['where', 'ở đâu', 'Where is the bus stop?'],
    ['when', 'khi nào', 'When does it start?'],
    ['what', 'cái gì', 'What is your name?'],
    ['who', 'ai', 'Who is that?'],
    ['which', 'cái nào', 'Which one do you want?'],
    ['how', 'như thế nào', 'How are you?'],
    ['can', 'có thể', 'Can you help me?'],
    ['could', 'có thể (lịch sự)', 'Could you repeat that?'],
    ['would', 'sẽ (lịch sự)', 'Would you like some tea?'],
    ['should', 'nên', 'You should see a doctor.'],
    ['must', 'phải', 'You must stop here.'],
    ['need', 'cần', 'I need some water.'],
    ['want', 'muốn', 'I want to go home.'],
    ['like', 'thích', 'I like this song.'],
    ['love', 'yêu', 'I love my family.'],
    ['hate', 'ghét', 'I hate waiting.'],
    ['friend', 'bạn', 'He is my friend.'],
    ['family', 'gia đình', 'My family is big.'],
    ['work', 'làm việc', 'I work in a bank.'],
    ['school', 'trường học', 'She goes to school.'],
    ['teacher', 'giáo viên', 'My teacher is kind.'],
    ['student', 'học sinh', 'I am a student.'],
    ['food', 'thức ăn', 'The food is delicious.'],
    ['water', 'nước', 'Can I have some water?'],
    ['coffee', 'cà phê', 'I like coffee.'],
    ['tea', 'trà', 'Would you like some tea?'],
    ['milk', 'sữa', 'Milk is good for you.'],
    ['bread', 'bánh mì', 'I eat bread for breakfast.'],
    ['rice', 'cơm', 'Rice is a staple food.'],
    ['meat', 'thịt', 'Do you eat meat?'],
    ['vegetable', 'rau', 'Vegetables are healthy.'],
    ['fruit', 'trái cây', 'I like fruit.'],
    ['money', 'tiền', 'How much money do you have?'],
    ['price', 'giá', 'What is the price?'],
    ['cheap', 'rẻ', 'This is cheap.'],
    ['expensive', 'đắt', 'That is expensive.'],
    ['open', 'mở', 'Open the window, please.'],
    ['close', 'đóng', 'Close the door.'],
    ['hot', 'nóng', 'It is hot today.'],
    ['cold', 'lạnh', 'It is cold outside.'],
    ['big', 'to', 'The house is big.'],
    ['small', 'nhỏ', 'The room is small.'],
    ['old', 'cũ', 'This book is old.'],
    ['new', 'mới', 'My phone is new.'],
    ['happy', 'vui', 'I am happy.'],
    ['sad', 'buồn', 'She is sad.'],
    ['tired', 'mệt', 'I feel tired.'],
    ['hungry', 'đói', 'I am hungry.'],
    ['thirsty', 'khát', 'He is thirsty.'],
    ['sick', 'ốm', 'I am sick.'],
    ['beautiful', 'đẹp', 'The view is beautiful.'],
    ['ugly', 'xấu', 'That is ugly.'],
    ['easy', 'dễ', 'This is easy.'],
    ['difficult', 'khó', 'The test is difficult.'],
    ['fast', 'nhanh', 'He runs fast.'],
    ['slow', 'chậm', 'The car is slow.'],
    ['early', 'sớm', 'I wake up early.'],
    ['late', 'muộn', 'You are late.'],
    ['right', 'đúng', 'You are right.'],
    ['wrong', 'sai', 'That is wrong.'],
    ['left', 'trái', 'Turn left.'],
    ['right', 'phải', 'Turn right.'],
    ['up', 'lên', 'Go up the stairs.'],
    ['down', 'xuống', 'Go down.'],
    ['in', 'trong', 'Come in, please.'],
    ['out', 'ngoài', 'Go out.'],
    ['here', 'ở đây', 'Come here.'],
    ['there', 'ở đó', 'Put it there.'],
    ['now', 'bây giờ', 'Do it now.'],
    ['then', 'sau đó', 'Then what happened?'],
    ['today', 'hôm nay', 'Today is Monday.'],
    ['tomorrow', 'ngày mai', 'See you tomorrow.'],
    ['yesterday', 'hôm qua', 'Yesterday was Sunday.'],
    ['always', 'luôn luôn', 'I always do my homework.'],
    ['sometimes', 'thỉnh thoảng', 'Sometimes I go out.'],
    ['never', 'không bao giờ', 'I never smoke.'],
    ['often', 'thường xuyên', 'I often read books.'],
    ['usually', 'thường', 'I usually get up at 6.'],
    ['because', 'bởi vì', 'I am late because of traffic.'],
    ['but', 'nhưng', 'I like tea but not coffee.'],
    ['and', 'và', 'You and I are friends.'],
    ['or', 'hoặc', 'Tea or coffee?'],
    ['if', 'nếu', 'If it rains, I will stay home.'],
    ['with', 'với', 'Come with me.'],
    ['without', 'không có', 'I can’t live without you.'],
    ['for', 'cho', 'This is for you.'],
    ['to', 'đến', 'Go to school.'],
    ['from', 'từ', 'I am from Vietnam.'],
    ['about', 'về', 'Tell me about yourself.'],
    ['at', 'tại', 'Meet me at the station.'],
    ['on', 'trên', 'The book is on the table.'],
    ['under', 'dưới', 'The cat is under the chair.'],
  ];

  const flashcards1 = words.map(([front, back, example]) => ({
    card_type: 'two_sided',
    content: { front, back: `${back}\nVí dụ: ${example}` },
  }));

  flashcards1.push(
    {
      card_type: 'multiple_choice',
      content: {
        question: "What does 'goodbye' mean?",
        options: ['tạm biệt', 'xin chào', 'cảm ơn', 'xin lỗi'],
        answer: 'tạm biệt',
      },
    },
    {
      card_type: 'multiple_choice',
      content: {
        question: "What is the meaning of 'please'?",
        options: ['làm ơn', 'cảm ơn', 'xin lỗi', 'vâng'],
        answer: 'làm ơn',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: '____, my name is Anna.',
        answer: 'Hello',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: '____ you for your help.',
        answer: 'Thank',
      },
    }
  );

  // Ensure exactly 100 flashcards
  if (flashcards1.length > 100) flashcards1.length = 100;
  else if (flashcards1.length < 100) {
    const additionalWords = [
      ['between', 'giữa', 'The ball is between the boxes.'],
      ['before', 'trước', 'Wash your hands before eating.'],
      ['after', 'sau', 'Call me after work.'],
      ['during', 'trong khi', 'Don’t talk during class.'],
      ['over', 'trên', 'The lamp is over the desk.'],
      ['again', 'lại', 'Please say it again.'],
    ];
    const additionalFlashcards = additionalWords.map(
      ([front, back, example]) => ({
        card_type: 'two_sided',
        content: { front, back: `${back}\nVí dụ: ${example}` },
      })
    );
    flashcards1.push(
      ...additionalFlashcards.slice(0, 100 - flashcards1.length)
    );
  }

  await knex('flashcards').insert(
    flashcards1.map((f) => ({
      deck_id: deck1.deck_id,
      card_type: f.card_type,
      content: f.content,
    }))
  );

  // --------- Deck 2: Vietnam History Milestones ---------
  const [deck2] = await knex('decks')
    .insert({
      user_id: publicUser.user_id,
      name: 'Lịch sử Việt Nam: Các mốc sự kiện quan trọng',
      description:
        '40 câu hỏi trắc nghiệm về các mốc sự kiện quan trọng trong lịch sử Việt Nam. Mỗi câu có 4 đáp án, chọn đáp án đúng.',
      is_public: true,
      image_url: null,
      category: 'Lịch sử',
    })
    .returning('*');

  const historyQuestions = [
    {
      question:
        'Sự kiện nào đánh dấu sự thành lập nước Việt Nam Dân chủ Cộng hòa?',
      options: [
        'Cách mạng tháng Tám thành công',
        'Chiến thắng Điện Biên Phủ',
        'Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình',
        'Hiệp định Genève được ký kết',
      ],
      answer: 'Bác Hồ đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình',
    },
    {
      question:
        'Chiến thắng nào đã kết thúc hoàn toàn ách đô hộ của thực dân Pháp ở Việt Nam?',
      options: [
        'Chiến thắng Điện Biên Phủ',
        'Chiến dịch Hồ Chí Minh',
        'Tổng tiến công và nổi dậy Tết Mậu Thân',
        'Hiệp định Paris được ký kết',
      ],
      answer: 'Chiến thắng Điện Biên Phủ',
    },
    {
      question: 'Năm nào diễn ra cuộc Tổng khởi nghĩa Tháng Tám?',
      options: ['1945', '1954', '1975', '1930'],
      answer: '1945',
    },
    {
      question: 'Ai là người lãnh đạo cuộc khởi nghĩa Lam Sơn?',
      options: ['Nguyễn Huệ', 'Trần Hưng Đạo', 'Lê Lợi', 'Phan Bội Châu'],
      answer: 'Lê Lợi',
    },
    {
      question:
        'Chiến dịch nào đã giải phóng hoàn toàn miền Nam, thống nhất đất nước?',
      options: [
        'Chiến dịch Hồ Chí Minh',
        'Chiến dịch Điện Biên Phủ',
        'Chiến dịch Tây Nguyên',
        'Chiến dịch Đường 9 - Nam Lào',
      ],
      answer: 'Chiến dịch Hồ Chí Minh',
    },
    {
      question: 'Năm nào diễn ra chiến thắng Bạch Đằng lần thứ ba?',
      options: ['938', '1288', '1075', '1427'],
      answer: '1288',
    },
    {
      question: 'Ai là người sáng lập Đảng Cộng sản Việt Nam?',
      options: ['Hồ Chí Minh', 'Phan Bội Châu', 'Trần Phú', 'Lê Duẩn'],
      answer: 'Hồ Chí Minh',
    },
    {
      question:
        'Hiệp định nào đã chấm dứt chiến tranh, lập lại hòa bình ở Việt Nam năm 1973?',
      options: [
        'Hiệp định Paris',
        'Hiệp định Genève',
        'Hiệp định Sơ bộ',
        'Hiệp định Lausanne',
      ],
      answer: 'Hiệp định Paris',
    },
    {
      question: 'Năm nào miền Nam Việt Nam hoàn toàn giải phóng?',
      options: ['1975', '1954', '1968', '1945'],
      answer: '1975',
    },
    {
      question: 'Ai là vị vua đầu tiên của nhà Nguyễn?',
      options: ['Gia Long', 'Minh Mạng', 'Tự Đức', 'Duy Tân'],
      answer: 'Gia Long',
    },
    {
      question: 'Ai lãnh đạo cuộc khởi nghĩa Tây Sơn?',
      options: ['Nguyễn Huệ', 'Nguyễn Ánh', 'Trần Hưng Đạo', 'Lê Lợi'],
      answer: 'Nguyễn Huệ',
    },
    {
      question: 'Năm nào diễn ra chiến thắng Ngô Quyền trên sông Bạch Đằng?',
      options: ['938', '1288', '1075', '1427'],
      answer: '938',
    },
    {
      question:
        'Ai là vị tướng đánh bại quân Thanh trong trận Ngọc Hồi - Đống Đa?',
      options: ['Nguyễn Huệ', 'Trần Hưng Đạo', 'Lê Lợi', 'Lý Thường Kiệt'],
      answer: 'Nguyễn Huệ',
    },
    {
      question:
        'Hội nghị thành lập Đảng Cộng sản Việt Nam diễn ra vào năm nào?',
      options: ['1930', '1925', '1945', '1955'],
      answer: '1930',
    },
    {
      question: 'Ai là tác giả của bài thơ "Nam quốc sơn hà"?',
      options: [
        'Lý Thường Kiệt',
        'Trần Hưng Đạo',
        'Nguyễn Trãi',
        'Hồ Chí Minh',
      ],
      answer: 'Lý Thường Kiệt',
    },
    {
      question: 'Năm nào diễn ra trận chiến trên sông Như Nguyệt?',
      options: ['1077', '938', '1288', '1427'],
      answer: '1077',
    },
    {
      question: 'Ai là người viết "Bình Ngô đại cáo"?',
      options: [
        'Nguyễn Trãi',
        'Hồ Chí Minh',
        'Lý Thường Kiệt',
        'Trần Hưng Đạo',
      ],
      answer: 'Nguyễn Trãi',
    },
    {
      question: 'Cuộc kháng chiến chống quân Minh kết thúc vào năm nào?',
      options: ['1427', '1288', '938', '1077'],
      answer: '1427',
    },
    {
      question: 'Năm nào thực dân Pháp xâm lược Việt Nam lần đầu tiên?',
      options: ['1858', '1873', '1884', '1862'],
      answer: '1858',
    },
    {
      question: 'Ai là lãnh đạo phong trào Cần Vương?',
      options: [
        'Hàm Nghi',
        'Tôn Thất Thuyết',
        'Phan Đình Phùng',
        'Tất cả đều đúng',
      ],
      answer: 'Tất cả đều đúng',
    },
    {
      question: 'Phong trào Đông Du do ai khởi xướng?',
      options: [
        'Phan Bội Châu',
        'Phan Châu Trinh',
        'Hồ Chí Minh',
        'Nguyễn Thái Học',
      ],
      answer: 'Phan Bội Châu',
    },
    {
      question: 'Năm nào diễn ra khởi nghĩa Yên Bái?',
      options: ['1930', '1925', '1945', '1917'],
      answer: '1930',
    },
    {
      question: 'Hiệp định Genève được ký kết vào năm nào?',
      options: ['1954', '1973', '1946', '1968'],
      answer: '1954',
    },
    {
      question: 'Ai là vị vua cuối cùng của triều Nguyễn?',
      options: ['Bảo Đại', 'Duy Tân', 'Khải Định', 'Thành Thái'],
      answer: 'Bảo Đại',
    },
    {
      question: 'Năm nào diễn ra phong trào Xô Viết Nghệ Tĩnh?',
      options: ['1930', '1945', '1925', '1954'],
      answer: '1930',
    },
    {
      question: 'Chiến dịch Biên giới diễn ra vào năm nào?',
      options: ['1950', '1947', '1954', '1975'],
      answer: '1950',
    },
    {
      question: 'Ai là tổng chỉ huy chiến dịch Điện Biên Phủ?',
      options: [
        'Võ Nguyên Giáp',
        'Hồ Chí Minh',
        'Phạm Văn Đồng',
        'Trường Chinh',
      ],
      answer: 'Võ Nguyên Giáp',
    },
    {
      question: 'Năm nào diễn ra Tổng tiến công và nổi dậy Tết Mậu Thân?',
      options: ['1968', '1975', '1954', '1945'],
      answer: '1968',
    },
    {
      question: 'Ai là người viết "Tuyên ngôn Độc lập" năm 1945?',
      options: [
        'Hồ Chí Minh',
        'Nguyễn Trãi',
        'Phan Bội Châu',
        'Lý Thường Kiệt',
      ],
      answer: 'Hồ Chí Minh',
    },
    {
      question: 'Cuộc kháng chiến chống Pháp kéo dài từ năm nào đến năm nào?',
      options: ['1945-1954', '1858-1884', '1930-1945', '1965-1975'],
      answer: '1945-1954',
    },
    {
      question: 'Ai lãnh đạo cuộc khởi nghĩa Hai Bà Trưng?',
      options: [
        'Trưng Trắc và Trưng Nhị',
        'Bà Triệu',
        'Nguyễn Thị Minh Khai',
        'Lý Chiêu Hoàng',
      ],
      answer: 'Trưng Trắc và Trưng Nhị',
    },
    {
      question: 'Năm nào diễn ra cuộc khởi nghĩa Bà Triệu?',
      options: ['248', '40', '938', '1288'],
      answer: '248',
    },
    {
      question: 'Nhà Trần được thành lập vào năm nào?',
      options: ['1225', '968', '1428', '1802'],
      answer: '1225',
    },
    {
      question: 'Ai là vị vua đầu tiên của nhà Lý?',
      options: [
        'Lý Thái Tổ',
        'Lý Thường Kiệt',
        'Lý Nhân Tông',
        'Lý Chiêu Hoàng',
      ],
      answer: 'Lý Thái Tổ',
    },
    {
      question:
        'Năm nào nhà Hồ thất bại trong cuộc kháng chiến chống quân Minh?',
      options: ['1407', '1427', '1288', '938'],
      answer: '1407',
    },
    {
      question: 'Phong trào Duy Tân do ai khởi xướng?',
      options: [
        'Phan Châu Trinh',
        'Phan Bội Châu',
        'Hồ Chí Minh',
        'Nguyễn Thái Học',
      ],
      answer: 'Phan Châu Trinh',
    },
    {
      question: 'Ai là lãnh đạo Việt Nam Quốc dân Đảng?',
      options: ['Nguyễn Thái Học', 'Phan Bội Châu', 'Hồ Chí Minh', 'Trần Phú'],
      answer: 'Nguyễn Thái Học',
    },
    {
      question: 'Năm nào diễn ra chiến thắng Việt Bắc?',
      options: ['1947', '1950', '1954', '1968'],
      answer: '1947',
    },
    {
      question: 'Cuộc kháng chiến chống Mỹ kéo dài từ năm nào đến năm nào?',
      options: ['1955-1975', '1945-1954', '1930-1945', '1968-1973'],
      answer: '1955-1975',
    },
    {
      question: 'Ai là vị vua sáng lập nhà Hậu Lê?',
      options: ['Lê Lợi', 'Lê Thánh Tông', 'Lê Chiêu Thống', 'Lê Hoàn'],
      answer: 'Lê Lợi',
    },
  ];

  await knex('flashcards').insert(
    historyQuestions.map((q) => ({
      deck_id: deck2.deck_id,
      card_type: 'multiple_choice',
      content: q,
    }))
  );

  // --------- Deck 3: Basic Vietnamese Phrases for Travelers ---------
  const [deck3] = await knex('decks')
    .insert({
      user_id: publicUser.user_id,
      name: 'Basic Vietnamese Phrases for Travelers',
      description:
        '50 cụm từ tiếng Việt cơ bản dành cho du khách, giúp giao tiếp trong các tình huống du lịch như hỏi đường, mua sắm, và ăn uống.',
      is_public: true,
      image_url: null,
      category: 'Ngôn ngữ',
    })
    .returning('*');

  const travelerPhrases = [
    ['Hello', 'Xin chào', 'Xin chào, bạn khỏe không?'],
    ['Goodbye', 'Tạm biệt', 'Tạm biệt, hẹn gặp lại.'],
    ['Thank you', 'Cảm ơn', 'Cảm ơn vì sự giúp đỡ.'],
    ['Sorry', 'Xin lỗi', 'Xin lỗi, tôi làm phiền bạn.'],
    ['Please', 'Làm ơn', 'Làm ơn đưa tôi thực đơn.'],
    ['How much is this?', 'Cái này bao nhiêu?', 'Cái áo này bao nhiêu tiền?'],
    ['Where is...?', 'Ở đâu là...?', 'Ở đâu là nhà vệ sinh?'],
    ['I don’t understand', 'Tôi không hiểu', 'Tôi không hiểu bạn nói gì.'],
    [
      'Can you help me?',
      'Bạn có thể giúp tôi không?',
      'Bạn có thể giúp tôi tìm đường không?',
    ],
    ['What is your name?', 'Tên bạn là gì?', 'Tên bạn là gì vậy?'],
    ['My name is...', 'Tên tôi là...', 'Tên tôi là Anna.'],
    ['I’m from...', 'Tôi đến từ...', 'Tôi đến từ Mỹ.'],
    ['How are you?', 'Bạn khỏe không?', 'Bạn khỏe không, hôm nay thế nào?'],
    ['I’m fine, thank you', 'Tôi khỏe, cảm ơn', 'Tôi khỏe, cảm ơn bạn.'],
    ['Where is the hotel?', 'Khách sạn ở đâu?', 'Khách sạn Grand ở đâu?'],
    [
      'Can I have the menu?',
      'Cho tôi xem thực đơn?',
      'Cho tôi xem thực đơn được không?',
    ],
    ['Delicious', 'Ngon', 'Món ăn này rất ngon!'],
    ['Water, please', 'Nước, làm ơn', 'Cho tôi xin nước, làm ơn.'],
    ['I want this', 'Tôi muốn cái này', 'Tôi muốn mua cái túi này.'],
    ['Too expensive', 'Quá đắt', 'Cái này quá đắt, giảm giá được không?'],
    [
      'Can you make it cheaper?',
      'Giảm giá được không?',
      'Cái này giảm giá được không?',
    ],
    ['Where is the market?', 'Chợ ở đâu?', 'Chợ Bến Thành ở đâu?'],
    ['I need a taxi', 'Tôi cần taxi', 'Tôi cần taxi để đi sân bay.'],
    ['Take me to...', 'Chở tôi đến...', 'Chở tôi đến nhà ga.'],
    ['What time is it?', 'Bây giờ là mấy giờ?', 'Bây giờ là mấy giờ rồi?'],
    ['I’m lost', 'Tôi bị lạc', 'Tôi bị lạc đường, giúp tôi với.'],
    ['Is it far?', 'Có xa không?', 'Chỗ đó có xa đây không?'],
    ['Turn left', 'Rẽ trái', 'Rẽ trái ở ngã tư tiếp theo.'],
    ['Turn right', 'Rẽ phải', 'Rẽ phải ở kia.'],
    ['Go straight', 'Đi thẳng', 'Đi thẳng khoảng 200 mét.'],
    ['One ticket', 'Một vé', 'Cho tôi một vé đi Đà Nẵng.'],
    ['Two tickets', 'Hai vé', 'Tôi muốn mua hai vé.'],
    ['How long does it take?', 'Mất bao lâu?', 'Đi đến Hà Nội mất bao lâu?'],
    ['I’m hungry', 'Tôi đói', 'Tôi đói, có quán ăn nào gần đây không?'],
    ['I’m thirsty', 'Tôi khát', 'Tôi khát, có nước ở đâu?'],
    ['Where is the beach?', 'Bãi biển ở đâu?', 'Bãi biển Nha Trang ở đâu?'],
    [
      'Can I pay by card?',
      'Tôi có thể trả bằng thẻ không?',
      'Ở đây có chấp nhận thẻ không?',
    ],
    ['No spicy food', 'Không cay', 'Tôi muốn món không cay.'],
    ['Vegetarian food', 'Đồ ăn chay', 'Có món ăn chay nào không?'],
    ['Emergency', 'Cấp cứu', 'Gọi cấp cứu giúp tôi!'],
    ['Hospital', 'Bệnh viện', 'Bệnh viện gần nhất ở đâu?'],
    ['Police', 'Cảnh sát', 'Tôi cần liên hệ cảnh sát.'],
  ];

  const flashcards3 = travelerPhrases.map(([front, back, example]) => ({
    card_type: 'two_sided',
    content: { front, back: `${back}\nVí dụ: ${example}` },
  }));

  flashcards3.push(
    {
      card_type: 'multiple_choice',
      content: {
        question: 'What does "Cảm ơn" mean in English?',
        options: ['Sorry', 'Thank you', 'Please', 'Hello'],
        answer: 'Thank you',
      },
    },
    {
      card_type: 'multiple_choice',
      content: {
        question: 'How do you say "Where is the hotel?" in Vietnamese?',
        options: [
          'Khách sạn ở đâu?',
          'Chợ ở đâu?',
          'Bãi biển ở đâu?',
          'Nhà vệ sinh ở đâu?',
        ],
        answer: 'Khách sạn ở đâu?',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: '____, tôi bị lạc đường.',
        answer: 'Help',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: 'Cho tôi ____ vé đi Hà Nội.',
        answer: 'Một',
      },
    },
    {
      card_type: 'multiple_choice',
      content: {
        question:
          'What is the Vietnamese phrase for "Can you make it cheaper?"?',
        options: [
          'Quá đắt',
          'Giảm giá được không?',
          'Cái này bao nhiêu?',
          'Tôi muốn cái này',
        ],
        answer: 'Giảm giá được không?',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: '____, my name is John.',
        answer: 'Hello',
      },
    }
  );

  // Ensure exactly 50 flashcards
  if (flashcards3.length > 50) flashcards3.length = 50;

  await knex('flashcards').insert(
    flashcards3.map((f) => ({
      deck_id: deck3.deck_id,
      card_type: f.card_type,
      content: f.content,
    }))
  );

  // Đảm bảo sequence cho tất cả các bảng auto-increment đúng sau khi seed
  await knex.raw(`
    SELECT setval('users_user_id_seq', COALESCE((SELECT MAX(user_id) FROM users), 1), true);
    SELECT setval('decks_deck_id_seq', COALESCE((SELECT MAX(deck_id) FROM decks), 1), true);
    SELECT setval('flashcards_flashcard_id_seq', COALESCE((SELECT MAX(flashcard_id) FROM flashcards), 1), true);
    SELECT setval('study_groups_group_id_seq', COALESCE((SELECT MAX(group_id) FROM study_groups), 1), true);
    SELECT setval('deck_shares_share_id_seq', COALESCE((SELECT MAX(share_id) FROM deck_shares), 1), true);
    SELECT setval('user_devices_device_id_seq', COALESCE((SELECT MAX(device_id) FROM user_devices), 1), true);
    SELECT setval('refresh_tokens_id_seq', COALESCE((SELECT MAX(id) FROM refresh_tokens), 1), true);
    SELECT setval('email_verifications_id_seq', COALESCE((SELECT MAX(id) FROM email_verifications), 1), true);
  `);
}

export async function down(knex) {
  // Xóa các deck và flashcard seed public
  const publicUser = await knex('users')
    .where({ email: 'public@memorix.com' })
    .first();
  if (publicUser) {
    const deckNames = [
      '100 English Communication Words',
      'Lịch sử Việt Nam: Các mốc sự kiện quan trọng',
      'Basic Vietnamese Phrases for Travelers',
    ];
    const decks = await knex('decks')
      .where({ user_id: publicUser.user_id })
      .whereIn('name', deckNames);
    for (const deck of decks) {
      await knex('flashcards').where({ deck_id: deck.deck_id }).del();
      await knex('decks').where({ deck_id: deck.deck_id }).del();
    }
    // Không xóa user public để tránh ảnh hưởng các seed khác
  }
}
