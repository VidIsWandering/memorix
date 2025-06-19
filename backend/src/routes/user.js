import express from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import userController from '../controllers/userController.js';
import passwordController from '../controllers/passwordController.js';

const router = express.Router();

router.get('/me', auth, userController.getUser);
router.put(
  '/me',
  auth,
  validation.validateUpdateUser,
  userController.updateUser
);
router.post(
  '/change-password',
  auth,
  validation.validateChangePassword,
  passwordController.changePassword
);

export default router;
