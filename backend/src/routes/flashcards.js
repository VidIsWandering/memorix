import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import flashcardController from '../controllers/flashcardController.js';

const router = Router();

// Tạo flashcard mới
router.post('/', auth, validation.validateFlashcard, flashcardController.createFlashcard);

// Lấy tất cả flashcard theo deckId
router.get('/deck/:deckId', auth, flashcardController.getFlashcards);

// Lấy flashcard đã xóa trong một deck
router.get('/deck/:deckId/deleted', auth, flashcardController.getDeletedFlashcards);

// Lấy 1 flashcard theo flashcardId
router.get('/:flashcardId', auth, flashcardController.getFlashcard);

// Cập nhật flashcard
router.put('/:flashcardId', auth, validation.validateFlashcard, flashcardController.updateFlashcard);

// Xóa mềm flashcard
router.delete('/:flashcardId', auth, flashcardController.deleteFlashcard);

// Khôi phục flashcard
router.post('/:flashcardId/restore', auth, flashcardController.restoreFlashcard);

// Xóa cứng flashcard
router.delete('/:flashcardId/force', auth, flashcardController.forceDeleteFlashcard);

export default router;