import { knex } from '../config/database.js';

const logout = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    const deleted = await knex('refresh_tokens')
      .where({ token: refresh_token, user_id: req.user.userId })
      .del();
    if (!deleted) {
      return res.status(404).json({ error: 'Refresh token not found' });
    }
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Logout error:', error.message);
    return res.status(500).json({ error: 'Logout failed' });
  }
};

export { logout };
