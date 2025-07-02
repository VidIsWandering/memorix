import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import process from 'node:process';
import crypto from 'crypto';
import { knex } from '../config/database.js';
import EmailVerification from '../models/EmailVerification.js';
import { sendVerificationEmail } from '../utils/emailService.js';

async function register(req, res) {
  try {
    const { username, email, password, phone } = req.body;
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    // Kiểm tra username đã tồn tại
    const existingUsername = await knex('users').where({ username }).first();
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password_hash: passwordHash,
      phone,
    });
    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
    await EmailVerification.create({
      user_id: user.user_id,
      code,
      expires_at: expiresAt,
    });
    try {
      await sendVerificationEmail(email, code);
    } catch (err) {
      console.error('Send verification email error:', err);
    }
    return res.status(201).json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      image_url: user.image_url,
      is_verified: user.is_verified,
      message: 'Verification code sent to your email.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Registration failed' });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.is_verified) {
            // Xóa mã xác thực cũ nếu đã tồn tại
        await knex('email_verifications').where({ user_id: user.user_id }).del();

        // Tạo mã mới
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

        await knex('email_verifications').insert({
          user_id: user.user_id,
          code,
          expires_at: expiresAt,
        });

        try {
          await sendVerificationEmail(user.email, code);
        } catch (err) {
          console.error('Send verification email error:', err);
        }

        return res.status(403).json({
          error: 'Email not verified',
          user_id: user.user_id,
          email: user.email,
        });
    }
    const accessToken = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    const refreshToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await knex('refresh_tokens').insert({
      user_id: user.user_id,
      token: refreshToken,
      expires_at: expiresAt,
    });
    return res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        image_url: user.image_url,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Login failed' });
  }
};

export default { register, login };
