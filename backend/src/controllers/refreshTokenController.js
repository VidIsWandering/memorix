import jwt from 'jsonwebtoken';
import { knex } from '../config/database.js';
import process from 'node:process';

const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    const tokenRecord = await knex('refresh_tokens')
      .where({ token: refresh_token })
      .where('expires_at', '>', new Date())
      .first();
    if (!tokenRecord) {
      return res
        .status(401)
        .json({ error: 'Invalid or expired refresh token' });
    }
    const user = await knex('users')
      .where({ user_id: tokenRecord.user_id })
      .first();
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const accessToken = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    return res.json({
      access_token: accessToken,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        image_url: user.image_url,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error.message);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
};

export { refreshToken };
