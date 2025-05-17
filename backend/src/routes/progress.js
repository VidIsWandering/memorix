import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import progressController from '../controllers/progressController.js';

const router = Router();

router.post(
  '/',
  auth,
  validation.validateProgress,
  progressController.updateProgress
);
router.get('/due', auth, progressController.getDueFlashcards);

export default router;
