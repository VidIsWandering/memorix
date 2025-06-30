import { sendNotificationToUser } from './notificationService.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';

export async function notifyDueFlashcardsForUser(user_id) {
  const now = new Date();

  const due = await Progress.findDueByUserId(user_id, now);
  const count = due.length;

  if (count === 0) return;

  const title = '📚 Đến giờ ôn tập!';
  const body = `Bạn có ${count} thẻ cần ôn hôm nay. Bấm để bắt đầu ngay!`;

  await sendNotificationToUser(user_id, title, body);
}
export async function notifyAllUsersWithDueFlashcards() {
  const users = await User.getAll(); // Cần hàm này trong User model
  for (const user of users) {
    await notifyDueFlashcardsForUser(user.user_id);
  }
}