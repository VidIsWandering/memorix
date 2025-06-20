import bcrypt from 'bcrypt';
import User from '../models/User.js';
import EmailVerification from '../models/EmailVerification.js';
import { sendVerificationEmail } from '../utils/emailService.js';

const getUser = async (req, res) => {
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
    });
  } catch (error) {
    console.error('Get user error:', error.message);
    return res.status(500).json({ errors: [{ msg: 'Failed to get user' }] });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email, password, phone, image_url } = req.body;
    const updates = {};
    let emailChanged = false;
    if (username) updates.username = username;
    if (email) {
      updates.email = email;
      emailChanged = true;
    }
    if (password) updates.password_hash = await bcrypt.hash(password, 10);
    if (phone) updates.phone = phone;
    if (image_url) updates.image_url = image_url;
    const existingEmail = email ? await User.findByEmail(email) : null;
    if (existingEmail && existingEmail.user_id !== req.user.userId) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Email already exists' }] });
    }
    if (emailChanged) {
      updates.is_verified = false;
    }
    const updatedUser = await User.update(req.user.userId, updates);
    if (!updatedUser) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }
    // Nếu đổi email, sinh mã xác thực mới và gửi email
    if (emailChanged) {
      // Xóa mã cũ nếu có
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
        console.error('Send verification email error:', err);
      }
      updatedUser.is_verified = false;
      return res.json({
        ...updatedUser,
        message: 'Verification code sent to your new email.',
      });
    }
    return res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error.message);
    return res.status(500).json({ errors: [{ msg: 'Failed to update user' }] });
  }
};

export default { getUser, updateUser };
