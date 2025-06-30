// notificationService.js
import admin from './firebase.js';
import { knex as db } from '../config/database.js'; // Kết nối DB

export async function sendNotificationToUser(userId, title, body) {
  try {
    // 1. Lấy tất cả fcm_token của user từ bảng user_devices
    const rows = await db('user_devices')
      .select('fcm_token')
      .where('user_id', userId)
      .whereNotNull('fcm_token');

    const tokens = rows.map(row => row.fcm_token);

    if (tokens.length === 0) {
      console.log('Không có thiết bị nào để gửi thông báo.');
      return;
    }

    // 2. Gửi notification qua FCM (dùng sendToDevice cho version cũ)
    const payload = {
      notification: {
        title,
        body,
      },
    };

    const response = await admin.messaging().sendEachForMulticast({
  tokens,
  notification: { title, body }
});
    console.log('Kết quả gửi:', response.successCount, 'thành công,', response.failureCount, 'thất bại.');

    // 3. Xử lý các token lỗi (nếu có)
    if (response.failureCount > 0 && response.results) {
      const failedTokens = [];
      response.results.forEach((resp, idx) => {
        if (resp.error) {
          failedTokens.push(tokens[idx]);
        }
      });
      console.log('Token lỗi:', failedTokens);
      // 👉 Có thể xóa các token lỗi này khỏi DB
    }
  } catch (err) {
    console.error('Lỗi khi gửi thông báo:', err);
  }
}
