// notificationService.js
const admin = require('./firebase');
const db = require('./your-database-connection'); // Kết nối DB tùy bạn

async function sendNotificationToUser(userId, title, body) {
  try {
    // 1. Lấy tất cả fcm_token của user từ bảng user_devices
    const [rows] = await db.execute(
      'SELECT fcm_token FROM user_devices WHERE user_id = ? AND fcm_token IS NOT NULL',
      [userId]
    );

    const tokens = rows.map(row => row.fcm_token);

    if (tokens.length === 0) {
      console.log('Không có thiết bị nào để gửi thông báo.');
      return;
    }

    // 2. Gửi notification qua FCM
    const message = {
      notification: {
        title,
        body,
      },
      tokens,
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log('Kết quả gửi:', response.successCount, 'thành công,', response.failureCount, 'thất bại.');

    // 3. Xử lý các token lỗi (nếu có)
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
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

module.exports = { sendNotificationToUser };
