import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import flashcardController from '../controllers/flashcardController.js';


const router = Router();

router.post('/', auth, validation.validateFlashcard, flashcardController.createFlashcard);
router.get('/', auth, flashcardController.getFlashcards);
router.get('/:id', auth, flashcardController.getFlashcard);
router.put('/:id', auth, validation.validateFlashcard, flashcardController.updateFlashcard);
router.delete('/:id', auth, flashcardController.deleteFlashcard);

export default router;
