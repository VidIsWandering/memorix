import { Router } from 'express';
import progressController from '../controllers/progressController.js';
import auth from '../middleware/auth.js';
import validation from '../middleware/validation.js';

const router = Router();

router.post(
  '/',
  auth,
  validation.validateProgress,
  progressController.updateProgress
);
router.get('/due', auth, progressController.getDueFlashcards);

export default router;
