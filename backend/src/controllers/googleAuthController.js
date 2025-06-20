import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import process from 'node:process';
import crypto from 'crypto';
import { knex } from '../config/database.js';

const client = new OAuth2Client();

const googleSignIn = async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({ error: 'id_token is required' });
    }
    // Verify token
    const ticket = await client.verifyIdToken({ idToken: id_token });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    if (!email) {
      return res.status(400).json({ error: 'Google account has no email' });
    }
    // Check if user exists
    let user = await User.findByEmail(email);
    if (!user) {
      // Create new user (auto verified)
      user = await User.create({
        username: name || email.split('@')[0],
        email,
        password_hash: '',
        phone: null,
        image_url: picture,
        is_verified: true,
      });
    }
    // Generate JWT & refresh token
    const accessToken = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
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
    console.error('Google sign-in error:', error);
    return res.status(401).json({ error: 'Invalid Google token' });
  }
};

export default { googleSignIn };
