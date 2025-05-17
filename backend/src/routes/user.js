import express from 'express';
import { getUser, updateUser } from '../controllers/userController.js';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/me', auth, getUser);
router.put('/me', auth, validation.validateUpdateUser, updateUser);

export default router;
