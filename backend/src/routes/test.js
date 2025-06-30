import { Router } from 'express';
import { notifyAllUsersWithDueFlashcards, notifyDueFlashcardsForUser } from '../utils/notificationScheduler.js';
import Progress from '../utils/../models/Progress.js';

const router = Router();

// Test gửi thông báo cho tất cả users
router.post('/notify-all', async (req, res) => {
  try {
    console.log('API Test: Đang gửi thông báo cho tất cả users...');
    await notifyAllUsersWithDueFlashcards();
    res.json({ 
      success: true, 
      message: 'Đã gửi thông báo cho tất cả users có flashcard cần ôn tập' 
    });
  } catch (error) {
    console.error('Lỗi khi test gửi thông báo:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Test gửi thông báo cho một user cụ thể
router.post('/notify-user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`API Test: Đang gửi thông báo cho user ${userId}...`);
    await notifyDueFlashcardsForUser(parseInt(userId));
    res.json({ 
      success: true, 
      message: `Đã gửi thông báo cho user ${userId}` 
    });
  } catch (error) {
    console.error('Lỗi khi test gửi thông báo cho user:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Test xem số thẻ cần ôn và danh sách thẻ cần ôn của user
router.post('/due-flashcards/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();
    const due = await Progress.findDueByUserId(parseInt(userId), now);
    res.json({
      user_id: parseInt(userId),
      due_count: due.length,
      due_flashcards: due
    });
  } catch (error) {
    console.error('Lỗi khi test due flashcards:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
