# Memorix Backend

## Giới thiệu

Đây là source code backend cho ứng dụng Memorix, một hệ thống quản lý và ôn tập flashcard hỗ trợ người dùng học tập hiệu quả. Backend được xây dựng với Node.js, Express, PostgreSQL, Knex.js và hỗ trợ xác thực, chia sẻ bộ thẻ, thống kê tiến độ học tập, thông báo nhắc nhở ôn tập.

## Tính năng chính

- Đăng ký, đăng nhập, xác thực email, đổi mật khẩu
- Quản lý người dùng
- Quản lý bộ thẻ (deck) và flashcard
- Theo dõi tiến độ học tập, lịch sử ôn tập, streak
- Chia sẻ bộ thẻ cho người dùng khác
- Thống kê số lượng thẻ đã học, chưa học, đến hạn ôn tập
- Gửi thông báo nhắc nhở ôn tập qua thiết bị

## Công nghệ sử dụng

- Node.js, Express
- PostgreSQL
- Knex.js (migrations, seeds)
- Firebase Admin (gửi thông báo)
- JWT (xác thực)
- express-validator (validate dữ liệu)
- bcrypt (mã hóa mật khẩu)

## Cấu trúc thư mục

```
backend/
  migrations/         # File migration tạo bảng
  seeds/              # File seed dữ liệu mẫu
  src/
    config/           # Cấu hình database
    controllers/      # Xử lý logic cho các route
    middleware/       # Xác thực, validate
    models/           # Truy vấn database
    routes/           # Định nghĩa API endpoint
    utils/            # Hàm tiện ích, gửi email, thông báo
  package.json        # Thông tin package và scripts
  server.js           # Entry point
```

## Cài đặt & chạy dự án

1. **Cài đặt dependencies**
   ```bash
   npm install
   ```
2. **Cấu hình biến môi trường**
   - Tạo file `.env` dựa trên `.env.example` (nếu có)
   - Cấu hình kết nối PostgreSQL, JWT_SECRET, Firebase...
3. **Khởi tạo database**
   ```bash
   npm run migrate
   npm run seed
   ```
4. **Chạy server**
   - Chạy production: `npm start`
   - Chạy dev (hot reload): `npm run dev`

## Scripts npm

- `npm start`: Chạy server ở mode production
- `npm run dev`: Chạy server với nodemon (tự restart khi thay đổi code)
- `npm run migrate`: Chạy migration để tạo bảng
- `npm run seed`: Chạy seed để thêm dữ liệu mẫu
- `npm run rollback`: Hoàn tác migration

## Lưu ý

- Không commit file `.env` hoặc `firebase-credentials.json`
- Sau khi pull code mới, nên chạy lại `npm run migrate` để đồng bộ schema
- Nếu gặp lỗi kết nối database, kiểm tra lại cấu hình `.env` và dịch vụ PostgreSQL

## Liên hệ

Nếu cần hỗ trợ, liên hệ nhóm phát triển hoặc tạo issue trên GitHub.


# Memorix Frontend
Github: https://github.com/ToanHuynh0201/SE114-Memorix
