>Memorix Backend

Backend cho ứng dụng Memorix, một hệ thống hỗ trợ học tập và ôn tập thông minh sử dụng thuật toán Spaced Repetition. 

Backend được xây dựng theo system architecture Client-Server, với architecture pattern MVC, cung cấp REST API cho ứng dụng Android.

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

>Mô tả dự án

Memorix cho phép người dùng:

Quản lý nội dung ghi nhớ (flashcards) theo các bộ (decks).

Luyện tập cá nhân hóa với thuật toán Spaced Repetition.

Theo dõi tiến độ học tập và nhận thông báo nhắc nhở ôn tập.

Chia sẻ nội dung và tham gia nhóm học tập.

=> Backend xử lý các chức năng như xác thực người dùng, quản lý decks/flashcards, lưu tiến độ học tập, và gửi thông báo đẩy qua Firebase.

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

>Công nghệ sử dụng

Core:

- Node.js v22.14.0 (khuyến nghị 20.x hoặc 22.x)

- Express (framework REST API)

- PostgreSQL v17.4 (khuyến nghị 14 hoặc mới hơn)

Thư viện:

- Knex.js (query builder và migration)

- pg (kết nối PostgreSQL)

- express-validator (validation dữ liệu)

- jsonwebtoken (JWT cho xác thực)

- bcrypt (mã hóa mật khẩu)

- node-cron (lập lịch)

- firebase-admin (thông báo đẩy)

- helmet (bảo mật HTTP)

- cors (cho phép gọi API từ Android)

- morgan (logging HTTP)

- dotenv (quản lý biến môi trường)

Công cụ phát triển:

- nodemon (tự động restart server)

- ESLint + Prettier (chất lượng mã)

Công cụ kiểm thử:

- Postman

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Yêu cầu

- Node.js: Phiên bản 22.14.0 hoặc 20.x (LTS). Tải tại nodejs.org.

- PostgreSQL: Phiên bản 17.4 hoặc 14+. Tải tại postgresql.org.

- Git: Để clone repository. Tải tại git-scm.com.

- pgAdmin (khuyến nghị): Công cụ quản lý PostgreSQL.

- Firebase Credentials: File JSON từ Firebase Console cho thông báo đẩy.

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Cài đặt

1. Clone repository
 
2. git clone <your-repo-url>
   
   cd backend

3. Cài đặt dependencies
   
   npm install

4. Cấu hình PostgreSQL

Tạo database:

Mở pgAdmin hoặc dùng psql:psql -U postgres

Chạy:

CREATE DATABASE memorix_db;

Tạo user:

CREATE USER memorix_user WITH PASSWORD 'memorix_password';

Gán quyền:

GRANT CONNECT ON DATABASE memorix_db TO memorix_user;

\c memorix_db

GRANT USAGE, CREATE ON SCHEMA public TO memorix_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO memorix_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO memorix_user;

5. Cấu hình biến môi trường

Copy file .env.example thành .env:

copy .env.example .env

Chỉnh sửa .env với thông tin thực tế:

PORT=3000

DB_HOST=localhost

DB_PORT=5432

DB_NAME=memorix_db

DB_USER=memorix_user

DB_PASSWORD=memorix_password

JWT_SECRET=supersecretkey123

FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json

Firebase:

Tạo dự án trên Firebase Console.

Tải file credentials JSON, đặt vào thư mục gốc (ví dụ: firebase-credentials.json).

Đảm bảo file này được liệt kê trong .gitignore.

6. Chạy migration
   
   Tạo các bảng trong database:
   
   npm run migrate

8. Khởi động server
   
   npm run dev

Server chạy tại http://localhost:3000.

Truy cập http://localhost:3000 để kiểm tra (trả về {"message": "Memorix Backend API"}).

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Cấu trúc thư mục

/src

/config # Cấu hình Knex.js và database

/controllers # Xử lý request/response

/middleware # Middleware (auth, validation)

/models # Truy vấn database với Knex.js

/routes # Định nghĩa endpoint

/utils # Hàm tiện ích

/migrations # File migration Knex.js

.env # Biến môi trường (không commit)

.env.example # Mẫu biến môi trường

.gitignore # File bỏ qua khi commit

server.js # Entry point

package.json # Dependencies và scripts

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Scripts npm

npm start: Chạy server ở mode production.

npm run dev: Chạy server với nodemon (tự restart khi thay đổi code).

npm run migrate: Chạy migration để tạo bảng.

npm run rollback: Hoàn tác migration.

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Ghi chú cho nhóm

Đồng bộ schema: Mỗi thành viên phải chạy npm run migrate sau khi clone để tạo bảng.

Debug:

Nếu lỗi kết nối database, kiểm tra .env và dịch vụ PostgreSQL (postgresql-x64-17 trong Windows Services).

Nếu lỗi migration (ví dụ: permission denied for schema public), đảm bảo user memorix_user có quyền USAGE và CREATE trên schema public.

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Phát triển endpoint: Thêm route trong /src/routes, controller trong /src/controllers, và model trong /src/models theo mô hình MVC.

Commit code: Không commit file .env hoặc firebase-credentials.json.

Liên hệ

Nếu cần hỗ trợ, liên hệ nhóm qua email hoặc tạo issue trên GitHub.
