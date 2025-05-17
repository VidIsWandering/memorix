import { Router } from 'express';
import shareController from '../controllers/shareController.js';
import auth from '../middleware/auth.js';
import validation from '../middleware/validation.js';

const router = Router();

router.post('/', auth, validation.validateShare, shareController.shareDeck);

export default router;
