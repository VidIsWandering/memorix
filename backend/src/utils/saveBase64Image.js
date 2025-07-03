import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Chuyển __dirname cho ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Hàm lưu ảnh base64 thành file và trả về đường dẫn
export function saveBase64Image(base64, filename) {
  const matches = base64.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) throw new Error('Ảnh base64 không hợp lệ');

  const ext = matches[1].split('/')[1]; // ví dụ: 'jpg'
  const data = matches[2];
  const buffer = Buffer.from(data, 'base64');

  const uploadDir = path.join(__dirname, '../../public/uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const fileName = `${filename}.${ext}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  // ✅ Trả về path public
  return `/uploads/${fileName}`;
}
