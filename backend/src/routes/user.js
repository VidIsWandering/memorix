import express from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import userController from '../controllers/userController.js';


const router = express.Router();

router.get('/me', auth, userController.getUser);
router.put('/me', auth, validation.validateUpdateUser, userController.updateUser);

export default router;
