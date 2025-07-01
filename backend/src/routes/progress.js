import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import * as progressController from '../controllers/progressController.js';

const router = Router();

router.post('/', auth, validation.validateProgress, progressController.updateProgress);
router.get('/due', auth, progressController.getDueFlashcards);
router.get('/unlearnedAndlearned', auth, progressController.getUnlearnedAndLearnedFlashcards);
router.put('/', auth, validation.validateProgress, progressController.updateProgressManual);
router.get('/stats', auth, progressController.getReviewStats);
router.get('/streak', auth, progressController.getReviewStreak);
router.get('/dueByDeck/:deckId', auth, progressController.getDueFlashcardsByDeck);
export default router;
