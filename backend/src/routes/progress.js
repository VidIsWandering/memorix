import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import * as progressController from '../controllers/progressController.js';

const router = Router();

router.post('/', auth, validation.validateProgress, progressController.updateProgress);
router.get('/due', auth, progressController.getDueFlashcards);
router.get('/unlearned', auth, progressController.getUnlearnedAndLearnedFlashcards);
router.put('/', auth, validation.validateProgress, progressController.updateProgressManual);

export default router;
