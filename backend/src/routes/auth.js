import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import authController from '../controllers/authController.js';
import { refreshToken } from '../controllers/refreshTokenController.js';
import { logout } from '../controllers/logoutController.js';
import resetPasswordController from '../controllers/resetPasswordController.js';
import verifyEmailController from '../controllers/verifyEmailController.js';
import googleAuthController from '../controllers/googleAuthController.js';

const router = Router();

router.post('/register', validation.validateRegister, authController.register);
router.post('/login', validation.validateLogin, authController.login);
router.post('/refresh-token', refreshToken);
router.post('/logout', auth, logout);
router.post(
  '/forgot-password',
  validation.validateForgotPassword,
  resetPasswordController.forgotPassword
);
router.post(
  '/reset-password',
  validation.validateResetPassword,
  resetPasswordController.resetPassword
);
router.post('/verify-email', verifyEmailController.verifyEmail);
router.post('/google', googleAuthController.googleSignIn);

export default router;
