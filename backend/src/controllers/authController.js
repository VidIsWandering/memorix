import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import process from 'node:process';
import crypto from 'crypto';
import { knex } from '../config/database.js';

async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password_hash: passwordHash,
    });
    return res.status(201).json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
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
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Login failed' });
  }
};

export default { register, login };
