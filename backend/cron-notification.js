import cron from 'node-cron';
import { notifyAllUsersWithDueFlashcards } from './src/utils/notificationScheduler.js';

// Chạy mỗi ngày lúc 9:00 AM
cron.schedule('* * * * *', async () => {
  console.log('Running daily notification job...');
  try {
    await notifyAllUsersWithDueFlashcards();
    console.log('Daily notifications sent successfully!');
  } catch (error) {
    console.error('Error sending daily notifications:', error);
  }
});

console.log('Notification scheduler started!');
