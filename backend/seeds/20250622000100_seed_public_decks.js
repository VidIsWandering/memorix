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
      category: 'Ngôn ngữ', // Bổ sung category
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
      category: 'Lịch sử', // Bổ sung category
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
      category: 'Ngôn ngữ', // Bổ sung category
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

  // --------- Deck 4: Các trường phái nghệ thuật nổi tiếng ---------
  const [deck4] = await knex('decks')
    .insert({
      user_id: publicUser.user_id,
      name: 'Các trường phái nghệ thuật nổi tiếng',
      description:
        'Bộ flashcard tổng hợp các trường phái nghệ thuật lớn trên thế giới, giúp nhận biết đặc điểm, tác phẩm tiêu biểu và nghệ sĩ đại diện. Phù hợp cho học sinh, sinh viên, người yêu mỹ thuật.',
      is_public: true,
      image_url: null,
      category: 'Nghệ thuật',
    })
    .returning('*');

  const artMovements = [
    [
      'Ấn tượng (Impressionism)',
      'Nhấn mạnh ánh sáng, màu sắc, nét vẽ tự do. Đại diện: Monet, Renoir. Ví dụ: "Impression, Sunrise".',
    ],
    [
      'Lập thể (Cubism)',
      'Phá vỡ hình khối, phối cảnh đa chiều. Đại diện: Picasso, Braque. Ví dụ: "Les Demoiselles d’Avignon".',
    ],
    [
      'Siêu thực (Surrealism)',
      'Khai thác tiềm thức, hình ảnh phi lý. Đại diện: Dalí, Magritte. Ví dụ: "The Persistence of Memory".',
    ],
    [
      'Trừu tượng (Abstract)',
      'Không mô tả thực tế, tập trung hình khối, màu sắc. Đại diện: Kandinsky, Mondrian.',
    ],
    [
      'Baroque',
      'Phong cách hoành tráng, tương phản mạnh. Đại diện: Caravaggio, Rubens.',
    ],
    [
      'Phục hưng (Renaissance)',
      'Tái hiện hiện thực, tỉ lệ chuẩn xác. Đại diện: Leonardo da Vinci, Michelangelo.',
    ],
    [
      'Nghệ thuật đại chúng (Pop Art)',
      'Hình ảnh đại chúng, màu sắc tươi sáng. Đại diện: Andy Warhol.',
    ],
    [
      'Biểu hiện (Expressionism)',
      'Thể hiện cảm xúc mãnh liệt. Đại diện: Edvard Munch.',
    ],
    [
      'Dã thú (Fauvism)',
      'Màu sắc mạnh, nét vẽ tự do. Đại diện: Henri Matisse.',
    ],
    ['Hiện thực (Realism)', 'Phản ánh cuộc sống thực. Đại diện: Courbet.'],
    [
      'Tân cổ điển (Neoclassicism)',
      'Lấy cảm hứng từ nghệ thuật Hy Lạp, La Mã cổ.',
    ],
    [
      'Hậu ấn tượng (Post-Impressionism)',
      'Phát triển từ ấn tượng, nhấn mạnh cảm xúc cá nhân. Đại diện: Van Gogh, Cézanne.',
    ],
    [
      'Lãng mạn (Romanticism)',
      'Đề cao cảm xúc, thiên nhiên. Đại diện: Delacroix.',
    ],
    ['Dadaism', 'Phản nghệ thuật, phi lý.'],
    ['Op Art', 'Nghệ thuật thị giác, ảo giác quang học.'],
    ['Minimalism', 'Tối giản hình khối, màu sắc.'],
    ['Art Nouveau', 'Đường cong mềm mại, trang trí cầu kỳ.'],
    ['Gothic', 'Kiến trúc vòm nhọn, kính màu.'],
    ['Rococo', 'Trang trí cầu kỳ, nhẹ nhàng.'],
    ['Symbolism', 'Biểu tượng, ý nghĩa sâu xa.'],
  ];
  const flashcards4 = artMovements.map(([front, back]) => ({
    card_type: 'two_sided',
    content: { front, back },
  }));
  flashcards4.push(
    {
      card_type: 'multiple_choice',
      content: {
        question: 'Ai là nghệ sĩ tiêu biểu của trường phái Ấn tượng?',
        options: ['Monet', 'Warhol', 'Picasso', 'Matisse'],
        answer: 'Monet',
      },
    },
    {
      card_type: 'multiple_choice',
      content: {
        question: 'Tác phẩm "Mona Lisa" thuộc trường phái nào?',
        options: ['Phục hưng', 'Lập thể', 'Pop Art', 'Baroque'],
        answer: 'Phục hưng',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: 'Trường phái nhấn mạnh ánh sáng và màu sắc là _________.',
        answer: 'Ấn tượng',
      },
    }
  );
  await knex('flashcards').insert(
    flashcards4.map((f) => ({
      deck_id: deck4.deck_id,
      card_type: f.card_type,
      content: f.content,
    }))
  );

  // --------- Deck 5: Các khái niệm Toán học cơ bản ---------
  const [deck5] = await knex('decks')
    .insert({
      user_id: publicUser.user_id,
      name: 'Các khái niệm Toán học cơ bản',
      description:
        'Bộ flashcard tổng hợp các khái niệm nền tảng của toán học: số học, đại số, hình học, xác suất, tỉ lệ, phần trăm... Có ví dụ thực tế, bài tập ứng dụng, phù hợp cho học sinh tiểu học, THCS.',
      is_public: true,
      image_url: null,
      category: 'Toán học',
    })
    .returning('*');

  const mathConcepts = [
    ['Số tự nhiên', '0, 1, 2, 3, ... là các số tự nhiên.'],
    ['Số nguyên', '..., -2, -1, 0, 1, 2, ... là các số nguyên.'],
    ['Số thập phân', 'Ví dụ: 0.5, 2.75.'],
    ['Số hữu tỉ', 'Số có thể viết dưới dạng phân số.'],
    ['Số vô tỉ', 'Số không thể viết dưới dạng phân số, ví dụ: √2, π.'],
    ['Phép cộng', '2 + 3 = 5.'],
    ['Phép trừ', '5 - 2 = 3.'],
    ['Phép nhân', '4 x 3 = 12.'],
    ['Phép chia', '12 / 4 = 3.'],
    ['Phân số', '1/2, 3/4.'],
    ['Tỉ lệ', 'Ví dụ: 1:2, 3:5.'],
    ['Phần trăm', '50% = 0.5.'],
    ['Căn bậc hai', '√9 = 3.'],
    ['Phương trình', 'x + 2 = 5.'],
    ['Biến', 'x, y, z.'],
    ['Hình vuông', 'Có 4 cạnh bằng nhau, 4 góc vuông.'],
    ['Hình tròn', 'Tập hợp các điểm cách đều tâm.'],
    ['Tam giác', 'Có 3 cạnh, tổng góc = 180°.'],
    ['Xác suất', 'Khả năng xảy ra của một sự kiện.'],
    ['Tập hợp', 'Tập hợp các phần tử.'],
    ['Đường thẳng', 'Không có điểm đầu và điểm cuối.'],
    ['Đoạn thẳng', 'Có điểm đầu và điểm cuối.'],
    ['Góc vuông', 'Góc 90°.'],
    ['Chu vi', 'Tổng độ dài các cạnh.'],
    ['Diện tích', 'Đo phần mặt phẳng.'],
    ['Thể tích', 'Đo không gian 3 chiều.'],
    ['Đồ thị', 'Biểu diễn hàm số.'],
    ['Hàm số', 'Liên hệ giữa biến độc lập và phụ thuộc.'],
    ['Tỉ số', 'So sánh hai đại lượng.'],
    ['Số thập phân vô hạn', 'Ví dụ: 0.333...'],
  ];
  const flashcards5 = mathConcepts.map(([front, back]) => ({
    card_type: 'two_sided',
    content: { front, back },
  }));
  flashcards5.push(
    {
      card_type: 'multiple_choice',
      content: {
        question: 'Kết quả của 7 x 8 là bao nhiêu?',
        options: ['54', '56', '64', '58'],
        answer: '56',
      },
    },
    {
      card_type: 'multiple_choice',
      content: {
        question: 'Số nào là căn bậc hai của 25?',
        options: ['3', '4', '5', '6'],
        answer: '5',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: 'Chu vi hình vuông cạnh 4cm là ____ cm.',
        answer: '16',
      },
    }
  );
  await knex('flashcards').insert(
    flashcards5.map((f) => ({
      deck_id: deck5.deck_id,
      card_type: f.card_type,
      content: f.content,
    }))
  );

  // --------- Deck 6: Nhà khoa học và phát minh nổi tiếng ---------
  const [deck6] = await knex('decks')
    .insert({
      user_id: publicUser.user_id,
      name: 'Nhà khoa học và phát minh nổi tiếng',
      description:
        'Bộ flashcard giới thiệu các nhà khoa học lớn và phát minh tiêu biểu, giúp ghi nhớ đóng góp của họ cho nhân loại. Mỗi thẻ có thông tin ngắn gọn, dễ nhớ, phù hợp cho học sinh, người yêu khoa học.',
      is_public: true,
      image_url: null,
      category: 'Khoa học',
    })
    .returning('*');

  const scientists = [
    ['Isaac Newton', 'Định luật vạn vật hấp dẫn, phát triển giải tích.'],
    ['Albert Einstein', 'Thuyết tương đối, E=mc².'],
    ['Marie Curie', 'Khám phá ra polonium, radium, 2 giải Nobel.'],
    ['Thomas Edison', 'Phát minh bóng đèn điện, máy ghi âm.'],
    ['Alexander Graham Bell', 'Phát minh điện thoại.'],
    ['James Watt', 'Cải tiến động cơ hơi nước.'],
    ['Galileo Galilei', 'Kính thiên văn, vật lý hiện đại.'],
    ['Nikola Tesla', 'Dòng điện xoay chiều, radio.'],
    ['Louis Pasteur', 'Vắc-xin, tiệt trùng Pasteur.'],
    ['Charles Darwin', 'Thuyết tiến hóa.'],
    ['Gregor Mendel', 'Di truyền học.'],
    ['Michael Faraday', 'Điện từ học.'],
    ['Stephen Hawking', 'Vũ trụ học, lỗ đen.'],
    ['Dmitri Mendeleev', 'Bảng tuần hoàn hóa học.'],
    ['Tim Berners-Lee', 'Phát minh World Wide Web.'],
    ['Jonas Salk', 'Vắc-xin bại liệt.'],
    ['Graham Bell', 'Điện thoại.'],
    ['Guglielmo Marconi', 'Phát minh radio.'],
    ['Wright brothers', 'Máy bay đầu tiên.'],
    ['Edward Jenner', 'Vắc-xin đầu tiên (đậu mùa).'],
    ['Ada Lovelace', 'Lập trình viên đầu tiên.'],
    ['Jane Goodall', 'Nghiên cứu tinh tinh.'],
    ['Rosalind Franklin', 'Cấu trúc DNA.'],
    ['Richard Feynman', 'Vật lý lượng tử.'],
    ['Enrico Fermi', 'Lò phản ứng hạt nhân.'],
    ['Niels Bohr', 'Mô hình nguyên tử Bohr.'],
    ['Heisenberg', 'Nguyên lý bất định.'],
    ['Max Planck', 'Lượng tử ánh sáng.'],
    ['Carl Sagan', 'Truyền thông khoa học.'],
    ['Rachel Carson', 'Bảo vệ môi trường.'],
  ];
  const flashcards6 = scientists.map(([front, back]) => ({
    card_type: 'two_sided',
    content: { front, back },
  }));
  flashcards6.push(
    {
      card_type: 'multiple_choice',
      content: {
        question: 'Ai là người phát minh ra bóng đèn điện?',
        options: ['Edison', 'Newton', 'Tesla', 'Curie'],
        answer: 'Edison',
      },
    },
    {
      card_type: 'multiple_choice',
      content: {
        question: 'Ai là cha đẻ của thuyết tiến hóa?',
        options: ['Darwin', 'Einstein', 'Newton', 'Faraday'],
        answer: 'Darwin',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: 'Người đầu tiên phát minh ra vắc-xin là _________.',
        answer: 'Edward Jenner',
      },
    }
  );
  await knex('flashcards').insert(
    flashcards6.map((f) => ({
      deck_id: deck6.deck_id,
      card_type: f.card_type,
      content: f.content,
    }))
  );

  // --------- Deck 7: Các tác phẩm văn học Việt Nam nổi bật ---------
  const [deck7] = await knex('decks')
    .insert({
      user_id: publicUser.user_id,
      name: 'Các tác phẩm văn học Việt Nam nổi bật',
      description:
        'Bộ flashcard tổng hợp các tác phẩm văn học kinh điển, hiện đại của Việt Nam, giúp ghi nhớ tác giả, nội dung chính, ý nghĩa, trích đoạn tiêu biểu.',
      is_public: true,
      image_url: null,
      category: 'Nghệ thuật',
    })
    .returning('*');

  const literatureVN = [
    ['Truyện Kiều', 'Nguyễn Du, thơ lục bát, số phận nàng Kiều.'],
    ['Chí Phèo', 'Nam Cao, bi kịch người nông dân bị tha hóa.'],
    ['Lão Hạc', 'Nam Cao, tình cha con, số phận người nghèo.'],
    ['Tắt đèn', 'Ngô Tất Tố, nỗi khổ người phụ nữ nông thôn.'],
    ['Vợ nhặt', 'Kim Lân, nạn đói 1945, tình người.'],
    ['Số đỏ', 'Vũ Trọng Phụng, châm biếm xã hội.'],
    ['Dế Mèn phiêu lưu ký', 'Tô Hoài, truyện thiếu nhi nổi tiếng.'],
    ['Đất rừng phương Nam', 'Đoàn Giỏi, cuộc sống Nam Bộ.'],
    ['Lặng lẽ Sa Pa', 'Nguyễn Thành Long, vẻ đẹp con người lao động.'],
    ['Chiếc lược ngà', 'Nguyễn Quang Sáng, tình cha con thời chiến.'],
    ['Bình Ngô đại cáo', 'Nguyễn Trãi, áng thiên cổ hùng văn.'],
    [
      'Tuyên ngôn Độc lập',
      'Hồ Chí Minh, khai sinh nước Việt Nam Dân chủ Cộng hòa.',
    ],
    ['Vợ chồng A Phủ', 'Tô Hoài, số phận người dân miền núi.'],
    ['Rừng xà nu', 'Nguyễn Trung Thành, sức sống Tây Nguyên.'],
    ['Lão Hạc', 'Nam Cao, tình cha con, số phận người nghèo.'],
    [
      'Những ngôi sao xa xôi',
      'Lê Minh Khuê, nữ thanh niên xung phong thời chiến.',
    ],
    ['Đồng chí', 'Chính Hữu, tình đồng đội.'],
    ['Tây Tiến', 'Quang Dũng, vẻ đẹp người lính.'],
    ['Việt Bắc', 'Tố Hữu, kháng chiến chống Pháp.'],
    ['Sóng', 'Xuân Quỳnh, tình yêu đôi lứa.'],
  ];
  const flashcards7 = literatureVN.map(([front, back]) => ({
    card_type: 'two_sided',
    content: { front, back },
  }));
  flashcards7.push(
    {
      card_type: 'multiple_choice',
      content: {
        question: 'Ai là tác giả của "Truyện Kiều"?',
        options: ['Nguyễn Du', 'Nam Cao', 'Tô Hoài', 'Kim Lân'],
        answer: 'Nguyễn Du',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: 'Tác phẩm "Chí Phèo" phản ánh bi kịch của người _________.',
        answer: 'nông dân',
      },
    }
  );
  await knex('flashcards').insert(
    flashcards7.map((f) => ({
      deck_id: deck7.deck_id,
      card_type: f.card_type,
      content: f.content,
    }))
  );

  // --------- Deck 8: Danh nhân Việt Nam ---------
  const [deck8] = await knex('decks')
    .insert({
      user_id: publicUser.user_id,
      name: 'Danh nhân Việt Nam',
      description:
        'Bộ flashcard giúp ghi nhớ các danh nhân, anh hùng dân tộc, nhà văn hóa lớn của Việt Nam, đóng góp cho lịch sử, văn hóa, khoa học.',
      is_public: true,
      image_url: null,
      category: 'Lịch sử',
    })
    .returning('*');

  const famousVN = [
    ['Hồ Chí Minh', 'Lãnh tụ cách mạng, Chủ tịch nước đầu tiên.'],
    ['Nguyễn Trãi', 'Danh nhân văn hóa thế giới, tác giả Bình Ngô đại cáo.'],
    [
      'Trần Hưng Đạo',
      'Anh hùng dân tộc, chỉ huy kháng chiến chống Nguyên Mông.',
    ],
    ['Lý Thường Kiệt', 'Tướng tài, tác giả Nam quốc sơn hà.'],
    ['Nguyễn Du', 'Tác giả Truyện Kiều, danh nhân văn hóa thế giới.'],
    ['Phan Bội Châu', 'Nhà yêu nước, lãnh đạo phong trào Đông Du.'],
    ['Phan Châu Trinh', 'Nhà cải cách, vận động Duy Tân.'],
    ['Võ Nguyên Giáp', 'Đại tướng, chỉ huy chiến dịch Điện Biên Phủ.'],
    ['Lê Quý Đôn', 'Nhà bác học, nhà thơ lớn.'],
    ['Ngô Quyền', 'Người đánh bại quân Nam Hán trên sông Bạch Đằng.'],
    ['Bà Triệu', 'Nữ anh hùng chống quân Ngô.'],
    ['Hai Bà Trưng', 'Khởi nghĩa chống Bắc thuộc.'],
    ['Nguyễn Ái Quốc', 'Tên gọi khác của Hồ Chí Minh.'],
    ['Tô Hiến Thành', 'Trung thần thời Lý.'],
    ['Đặng Thùy Trâm', 'Bác sĩ, liệt sĩ thời chống Mỹ.'],
    ['Nguyễn Thị Minh Khai', 'Nữ chiến sĩ cách mạng.'],
    ['Nguyễn Lương Bằng', 'Lãnh đạo cách mạng.'],
    ['Nguyễn Văn Cừ', 'Tổng Bí thư Đảng Cộng sản VN.'],
    ['Nguyễn Khuyến', 'Nhà thơ nổi tiếng với thơ Nôm.'],
    ['Tản Đà', 'Nhà thơ, nhà báo lớn.'],
  ];
  const flashcards8 = famousVN.map(([front, back]) => ({
    card_type: 'two_sided',
    content: { front, back },
  }));
  flashcards8.push(
    {
      card_type: 'multiple_choice',
      content: {
        question: 'Ai là người chỉ huy chiến dịch Điện Biên Phủ?',
        options: [
          'Võ Nguyên Giáp',
          'Trần Hưng Đạo',
          'Ngô Quyền',
          'Lý Thường Kiệt',
        ],
        answer: 'Võ Nguyên Giáp',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: 'Tác giả "Truyện Kiều" là _________.',
        answer: 'Nguyễn Du',
      },
    }
  );
  await knex('flashcards').insert(
    flashcards8.map((f) => ({
      deck_id: deck8.deck_id,
      card_type: f.card_type,
      content: f.content,
    }))
  );

  // --------- Deck 9: Kiến thức Khoa học tự nhiên cơ bản ---------
  const [deck9] = await knex('decks')
    .insert({
      user_id: publicUser.user_id,
      name: 'Kiến thức Khoa học tự nhiên cơ bản',
      description:
        'Bộ flashcard tổng hợp kiến thức cơ bản về vật lý, hóa học, sinh học, giúp học sinh ôn tập và mở rộng hiểu biết.',
      is_public: true,
      image_url: null,
      category: 'Khoa học',
    })
    .returning('*');

  const scienceBasics = [
    ['Nước sôi ở nhiệt độ nào?', '100°C (ở áp suất thường).'],
    ['Công thức hóa học của nước', 'H2O.'],
    ['Trái Đất quay quanh gì?', 'Mặt Trời.'],
    ['Thực vật quang hợp nhờ gì?', 'Ánh sáng Mặt Trời.'],
    ['Đơn vị đo chiều dài chuẩn quốc tế', 'Mét (m).'],
    ['Nguyên tố phổ biến nhất vũ trụ', 'Hydro.'],
    ['Động vật có vú lớn nhất', 'Cá voi xanh.'],
    ['Tế bào là gì?', 'Đơn vị cấu tạo cơ bản của sinh vật.'],
    ['Khí nào cần cho hô hấp?', 'Oxy (O2).'],
    ['Cơ quan bơm máu trong cơ thể', 'Tim.'],
    ['Quá trình chuyển hóa thức ăn thành năng lượng', 'Hô hấp tế bào.'],
    ['Nguyên tố hóa học ký hiệu Fe', 'Sắt.'],
    ['Tốc độ ánh sáng', 'Khoảng 300.000 km/s.'],
    ['Động vật có xương sống đầu tiên lên cạn', 'Lưỡng cư.'],
    ['Cây xanh hấp thụ khí gì?', 'CO2.'],
    ['Đơn vị đo khối lượng', 'Kilogram (kg).'],
    ['Cấu tạo nguyên tử gồm', 'Electron, proton, neutron.'],
    ['Quá trình nước thành hơi', 'Bốc hơi.'],
    ['Động vật nào đẻ trứng?', 'Chim, cá, bò sát...'],
    ['Nguyên tố hóa học ký hiệu Na', 'Natri.'],
  ];
  const flashcards9 = scienceBasics.map(([front, back]) => ({
    card_type: 'two_sided',
    content: { front, back },
  }));
  flashcards9.push(
    {
      card_type: 'multiple_choice',
      content: {
        question: 'Công thức hóa học của nước là gì?',
        options: ['CO2', 'H2O', 'O2', 'NaCl'],
        answer: 'H2O',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: 'Đơn vị đo khối lượng chuẩn quốc tế là _________.',
        answer: 'Kilogram',
      },
    }
  );
  await knex('flashcards').insert(
    flashcards9.map((f) => ({
      deck_id: deck9.deck_id,
      card_type: f.card_type,
      content: f.content,
    }))
  );

  // --------- Deck 10: Thành ngữ, tục ngữ Việt Nam ---------
  const [deck10] = await knex('decks')
    .insert({
      user_id: publicUser.user_id,
      name: 'Thành ngữ, tục ngữ Việt Nam',
      description:
        'Bộ flashcard giúp ghi nhớ, hiểu ý nghĩa các thành ngữ, tục ngữ quen thuộc trong tiếng Việt, ứng dụng trong giao tiếp, học tập.',
      is_public: true,
      image_url: null,
      category: 'Ngôn ngữ',
    })
    .returning('*');

  const idiomsVN = [
    ['Ăn quả nhớ kẻ trồng cây', 'Biết ơn người đi trước.'],
    ['Có công mài sắt, có ngày nên kim', 'Kiên trì sẽ thành công.'],
    ['Nước chảy đá mòn', 'Kiên nhẫn, bền bỉ sẽ vượt qua khó khăn.'],
    ['Một cây làm chẳng nên non', 'Đoàn kết tạo sức mạnh.'],
    ['Gần mực thì đen, gần đèn thì sáng', 'Môi trường ảnh hưởng con người.'],
    ['Tốt gỗ hơn tốt nước sơn', 'Chất lượng quan trọng hơn hình thức.'],
    ['Uống nước nhớ nguồn', 'Biết ơn cội nguồn.'],
    ['Lá lành đùm lá rách', 'Tương thân tương ái.'],
    ['Chớ thấy sóng cả mà ngã tay chèo', 'Không nản chí trước khó khăn.'],
    ['Đói cho sạch, rách cho thơm', 'Giữ phẩm chất dù nghèo khó.'],
    [
      'Khôn ngoan đối đáp người ngoài, gà cùng một mẹ chớ hoài đá nhau',
      'Đoàn kết trong gia đình.',
    ],
    ['Thất bại là mẹ thành công', 'Qua thất bại mới có thành công.'],
    ['Có chí thì nên', 'Có ý chí sẽ thành công.'],
    ['Cá không ăn muối cá ươn', 'Không nghe lời sẽ gặp hậu quả.'],
    ['Lửa thử vàng, gian nan thử sức', 'Khó khăn thử thách bản lĩnh.'],
    ['Một miếng khi đói bằng một gói khi no', 'Giúp đỡ lúc khó khăn quý hơn.'],
    ['Ăn cơm nhà vác tù và hàng tổng', 'Làm việc công ích không lợi cho mình.'],
    ['Chim sa cá lặn', 'Chỉ người con gái đẹp.'],
    ['Mất bò mới lo làm chuồng', 'Chủ quan dẫn đến hậu quả.'],
    ['Được voi đòi tiên', 'Tham lam, không biết đủ.'],
  ];
  const flashcards10 = idiomsVN.map(([front, back]) => ({
    card_type: 'two_sided',
    content: { front, back },
  }));
  flashcards10.push(
    {
      card_type: 'multiple_choice',
      content: {
        question: 'Thành ngữ nào nói về lòng biết ơn?',
        options: [
          'Ăn quả nhớ kẻ trồng cây',
          'Được voi đòi tiên',
          'Chim sa cá lặn',
          'Mất bò mới lo làm chuồng',
        ],
        answer: 'Ăn quả nhớ kẻ trồng cây',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: 'Thành ngữ "Có công mài sắt, có ngày nên ___" dạy về sự kiên trì.',
        answer: 'kim',
      },
    }
  );
  await knex('flashcards').insert(
    flashcards10.map((f) => ({
      deck_id: deck10.deck_id,
      card_type: f.card_type,
      content: f.content,
    }))
  );

  // --------- Deck 11: Địa lý Việt Nam ---------
  const [deck11] = await knex('decks')
    .insert({
      user_id: publicUser.user_id,
      name: 'Địa lý Việt Nam',
      description:
        'Bộ flashcard tổng hợp kiến thức địa lý cơ bản về Việt Nam: vị trí, địa hình, sông ngòi, khí hậu, các vùng miền, di sản nổi bật.',
      is_public: true,
      image_url: null,
      category: 'Khoa học',
    })
    .returning('*');

  const geographyVN = [
    ['Thủ đô Việt Nam', 'Hà Nội.'],
    ['Thành phố lớn nhất Việt Nam', 'TP. Hồ Chí Minh.'],
    ['Dãy núi cao nhất Việt Nam', 'Hoàng Liên Sơn (có đỉnh Fansipan).'],
    ['Sông dài nhất Việt Nam', 'Sông Đồng Nai.'],
    ['Biển lớn nhất Việt Nam', 'Biển Đông.'],
    ['Vịnh nổi tiếng ở miền Bắc', 'Vịnh Hạ Long.'],
    ['Đồng bằng lớn nhất', 'Đồng bằng sông Cửu Long.'],
    ['Đảo lớn nhất', 'Phú Quốc.'],
    ['Vườn quốc gia nổi tiếng', 'Cúc Phương, Phong Nha - Kẻ Bàng.'],
    [
      'Di sản thế giới UNESCO',
      'Vịnh Hạ Long, Phong Nha - Kẻ Bàng, Quần thể Tràng An.',
    ],
    ['Khí hậu Việt Nam', 'Nhiệt đới gió mùa.'],
    ['Biên giới phía Bắc giáp nước nào?', 'Trung Quốc.'],
    ['Biên giới phía Tây giáp nước nào?', 'Lào, Campuchia.'],
    ['Sông Hồng chảy qua tỉnh nào?', 'Hà Nội, Hưng Yên, Nam Định...'],
    ['Vùng kinh tế trọng điểm phía Nam', 'TP.HCM, Bình Dương, Đồng Nai...'],
    ['Cao nguyên lớn nhất', 'Cao nguyên Tây Nguyên.'],
    ['Bán đảo lớn nhất', 'Bán đảo Sơn Trà.'],
    ['Hồ nước ngọt lớn nhất', 'Hồ Ba Bể.'],
    ['Cửa khẩu quốc tế nổi tiếng', 'Hữu Nghị, Mộc Bài.'],
    ['Địa danh nổi tiếng miền Trung', 'Huế, Đà Nẵng, Hội An.'],
  ];
  const flashcards11 = geographyVN.map(([front, back]) => ({
    card_type: 'two_sided',
    content: { front, back },
  }));
  flashcards11.push(
    {
      card_type: 'multiple_choice',
      content: {
        question: 'Đỉnh núi cao nhất Việt Nam là gì?',
        options: ['Fansipan', 'Bạch Mã', 'Ba Vì', 'Langbiang'],
        answer: 'Fansipan',
      },
    },
    {
      card_type: 'fill_in_blank',
      content: {
        text: 'Thủ đô của Việt Nam là _________.',
        answer: 'Hà Nội',
      },
    }
  );
  await knex('flashcards').insert(
    flashcards11.map((f) => ({
      deck_id: deck11.deck_id,
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
      'Famous Art Movements',
      'Basic Math Concepts',
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
