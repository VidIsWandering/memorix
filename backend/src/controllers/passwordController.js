import bcrypt from 'bcrypt';
import User from '../models/User.js';

const changePassword = async (req, res) => {
  try {
    
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Missing current or new password' });
    }

  

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log("Received currentPassword:", currentPassword);
    console.log("User.password_hash:", user.password_hash);
    console.log("Full user object:", user);

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password_hash
    );
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
   
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    

    await User.update(userId, { password_hash: newPasswordHash });

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Password change failed' });
  }
};

export default { changePassword };
