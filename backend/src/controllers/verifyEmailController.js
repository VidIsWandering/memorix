import EmailVerification from '../models/EmailVerification.js';
import User from '../models/User.js';

const verifyEmail = async (req, res) => {
  try {
    const { user_id, code } = req.body;
    if (!user_id || !code) {
      return res.status(400).json({ error: 'user_id and code are required' });
    }
    const record = await EmailVerification.findByUserId(user_id);
    if (!record || record.code !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }
    if (new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Verification code expired' });
    }
    await User.update(user_id, { is_verified: true });
    await EmailVerification.deleteByUserId(user_id);
    return res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verify email error:', error);
    return res.status(500).json({ error: 'Failed to verify email' });
  }
};

export default { verifyEmail };
