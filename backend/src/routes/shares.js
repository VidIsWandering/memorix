import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import shareController from '../controllers/shareController.js';

const router = Router();

router.post('/', auth, validation.validateShare, shareController.shareDeck);

export default router;
