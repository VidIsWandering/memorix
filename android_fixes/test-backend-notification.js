// Test script để gửi notification từ backend
// Tạo file test-manual-notification.js trong backend

import { sendNotificationToUser } from './src/utils/notificationService.js';

async function testNotification() {
  const user_id = 1; // Thay bằng user_id thực tế
  const title = '🧪 Test từ Backend';
  const body = 'Đây là notification test từ Node.js backend';
  
  try {
    await sendNotificationToUser(user_id, title, body);
    console.log('✅ Test notification sent!');
  } catch (error) {
    console.error('❌ Error sending test notification:', error);
  }
}

testNotification();
