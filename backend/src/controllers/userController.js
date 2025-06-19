import bcrypt from 'bcrypt';
import User from '../models/User.js';

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
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password_hash = await bcrypt.hash(password, 10);
    if (phone) updates.phone = phone;
    if (image_url) updates.image_url = image_url;
    const existingEmail = email ? await User.findByEmail(email) : null;
    if (existingEmail && existingEmail.user_id !== req.user.userId) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Email already exists' }] });
    }
    const updatedUser = await User.update(req.user.userId, updates);
    if (!updatedUser) {
      return res.status(404).json({ errors: [{ msg: 'User not found' }] });
    }
    return res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error.message);
    return res.status(500).json({ errors: [{ msg: 'Failed to update user' }] });
  }
};

export default { getUser, updateUser };
