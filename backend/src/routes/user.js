import express from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import { getUser, updateUser } from '../controllers/userController.js';
import passwordController from '../controllers/passwordController.js';

const router = express.Router();

router.get('/me', auth, getUser);
router.put('/me', auth, validation.validateUpdateUser, updateUser);
router.post(
  '/change-password',
  auth,
  validation.validateChangePassword,
  passwordController.changePassword
);

export default router;
