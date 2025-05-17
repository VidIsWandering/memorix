import { Router } from 'express';
import authController from '../controllers/authController.js';
import validation from '../middleware/validation.js';
import { refreshToken } from '../controllers/refreshTokenController.js';
import auth from '../middleware/auth.js';
import { logout } from '../controllers/logoutController.js';

const router = Router();

router.post('/register', validation.validateRegister, authController.register);
router.post('/login', validation.validateLogin, authController.login);
router.post('/refresh-token', refreshToken);
router.post('/logout', auth, logout);

export default router;
