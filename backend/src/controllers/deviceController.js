import Device from '../models/Device.js';

const registerDevice = async (req, res) => {
  try {
    const user_id = req.user.user_id; // Lấy user_id từ middleware auth
    const { fcm_token, device_name } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!fcm_token) {
      return res.status(400).json({ error: 'FCM token is required' });
    }

    // Xoá các thiết bị cũ có cùng fcm_token (nếu có)
    // Đảm bảo mỗi fcm_token chỉ gắn với 1 user
    await Device.deleteByFcmToken?.(fcm_token);

    // Tạo mới thiết bị
    const device = await Device.create({
      user_id,
      fcm_token,
      device_name,
    });

    return res.status(201).json({ device });
  } catch (err) {
    if (err.code === '23505') { // unique_violation
      return res.status(409).json({ error: 'FCM token already registered' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default { registerDevice };