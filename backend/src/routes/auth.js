import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import authController from '../controllers/authController.js';
import { refreshToken } from '../controllers/refreshTokenController.js';
import { logout } from '../controllers/logoutController.js';

const router = Router();

router.post('/register', validation.validateRegister, authController.register);
router.post('/login', validation.validateLogin, authController.login);
router.post('/refresh-token', refreshToken);
router.post('/logout', auth, logout);

export default router;
