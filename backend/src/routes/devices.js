import { Router } from 'express';
import deviceController from '../controllers/deviceController.js';
import auth from '../middleware/auth.js';
import validation from '../middleware/validation.js';

const router = Router();

router.post('/', auth, validation.validateDevice, deviceController.registerDevice);

export default router;
