import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import deckController from '../controllers/deckController.js';


const router = Router();

router.post('/', auth, validation.validateDeck, deckController.createDeck);
router.get('/', auth, deckController.getDecks);
router.get('/deleted', auth, deckController.getDeletedDecks); // Lấy danh sách đã xóa
router.get('/:id', auth, deckController.getDeck);
router.put('/:id', auth, validation.validateDeck, deckController.updateDeck);
router.delete('/:id', auth, deckController.deleteDeck); // Xóa mềm
router.post('/:id/restore', auth, deckController.restoreDeck); // Khôi phục
router.delete('/:id/force', auth, deckController.forceDeleteDeck); // Xóa cứng

export default router;
