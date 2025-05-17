import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import deviceController from '../controllers/deviceController.js';


const router = Router();

router.post('/', auth, validation.validateDevice, deviceController.registerDevice);

export default router;
