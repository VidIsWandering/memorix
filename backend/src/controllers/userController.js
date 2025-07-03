// ES Module imports
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import EmailVerification from '../models/EmailVerification.js';
import { saveBase64Image } from '../utils/saveBase64Image.js';
import { sendVerificationEmail } from '../utils/emailService.js'; // đổi đúng file bạn dùng

// Lấy thông tin user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    return res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      image_url: user.image_url,
      max_review_streak: user.max_review_streak,
      current_review_streak: user.current_review_streak,
    });
  } catch (error) {
    console.error('Get user error:', error.message);
    return res.status(500).json({ errors: [{ msg: 'Failed to get user' }] });
  }
};

// Cập nhật thông tin user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { username, email, password, phone, image_base64 } = req.body;

    const updates = {};
    let emailChanged = false;

    if (username) updates.username = username;
    if (phone) updates.phone = phone;

    if (email && email !== user.email) {
      const existingEmail = await User.findByEmail(email);
      if (existingEmail && existingEmail.user_id !== req.user.userId) {
        return res.status(400).json({ errors: [{ msg: 'Email already exists' }] });
      }
      updates.email = email;
      updates.is_verified = false;
      emailChanged = true;
    }

    if (password) {
      updates.password_hash = await bcrypt.hash(password, 10);
    }

    if (image_base64) {
      const imagePath = saveBase64Image(image_base64, `user_${user.user_id}_${Date.now()}`);
      updates.image_url = imagePath;
    }

    const updatedUser = await User.update(req.user.userId, updates);
    if (!updatedUser) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }

    if (emailChanged) {
      await EmailVerification.deleteByUserId(req.user.userId);
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

      await EmailVerification.create({
        user_id: req.user.userId,
        code,
        expires_at: expiresAt,
      });

      try {
        await sendVerificationEmail(email, code);
      } catch (err) {
        console.error('Lỗi gửi email xác thực:', err);
      }

      updatedUser.is_verified = false;
      return res.json({
        ...updatedUser,
        message: 'Mã xác thực đã được gửi đến email mới của bạn.',
      });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error('🔥 Lỗi updateUser:', error.message);
  console.error('🧾 Stack Trace:', error.stack);
    return res.status(500).json({ errors: [{ msg: 'Cập nhật thất bại' }] });
  }
};
