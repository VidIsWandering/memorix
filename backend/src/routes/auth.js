import { Router } from 'express';
import authController from '../controllers/authController.js';
import validation from '../middleware/validation.js';
import {refreshToken} from '../controllers/refreshTokenController.js';

const router = Router();

router.post('/register', validation.validateRegister, authController.register);
router.post('/login', validation.validateLogin, authController.login);
router.post('/refresh-token', refreshToken);

export default router;
