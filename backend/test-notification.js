import { sendNotificationToUser } from './src/utils/notificationService.js';

// Test gửi notification cho user ID = 1 (thay đổi user_id theo thực tế)
async function testNotification() {
  try {
    // Thay đổi user_id này theo ID của user đã đăng ký device
    const userId = 1; 
    await sendNotificationToUser(userId, '📚 Test Notification', 'Đây là thông báo test từ server!');
    console.log('Notification sent successfully!');
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

testNotification();
