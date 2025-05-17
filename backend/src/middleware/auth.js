import jwt from 'jsonwebtoken';
import process from 'node:process';

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ error: 'Access token expired', action: 'refresh' });
    }
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default auth;
