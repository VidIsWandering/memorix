import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { knex } from '../config/database.js';
import User from '../models/User.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.json({
        message: 'If the email exists, a reset link will be sent.',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store reset token
    await knex('password_resets')
      .insert({
        user_id: user.user_id,
        token: resetTokenHash,
        expires_at: resetTokenExpiry,
      })
      .onConflict('user_id')
      .merge(); // Send reset email
    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (error) {
      console.error('Failed to send reset email:', error);
      // Don't expose error details to client
    }

    return res.json({
      message: 'If the email exists, a reset link will be sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res
      .status(500)
      .json({ error: 'Failed to process forgot password request' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find valid reset token
    const resetRecord = await knex('password_resets')
      .where('token', tokenHash)
      .where('expires_at', '>', new Date())
      .first();

    if (!resetRecord) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password
    const passwordHash = await bcrypt.hash(password, 10);
    await User.update(resetRecord.user_id, { password_hash: passwordHash });

    // Delete used token
    await knex('password_resets').where({ user_id: resetRecord.user_id }).del();

    return res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
};

export default { forgotPassword, resetPassword };
