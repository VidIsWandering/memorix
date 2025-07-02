import { sendNotificationToUser } from './notificationService.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

export async function notifyDueFlashcardsForUser(user_id) {
  const now = new Date();

  const due = await Progress.findDueByUserId(user_id, now);
  const count = due.length;

  console.log(`🔔 Sending notification to user_id: ${user_id}, due cards: ${count}`);

  const title = '📚 Đến giờ ôn tập!';
  const body = `Bạn có ${count} thẻ cần ôn hôm nay. Bấm để bắt đầu ngay!`;

  await sendNotificationToUser(user_id, title, body);
}
export async function notifyAllUsersWithDueFlashcards() {
  const users = await User.getAll(); 
  console.log(`📋 Total users found: ${users.length}`);
  
  for (const user of users) {
    console.log(`👤 Processing user: ${user.user_id} (${user.email || 'No email'})`);
    await notifyDueFlashcardsForUser(user.user_id);
  }
  
  console.log('✅ Finished processing all users');
}