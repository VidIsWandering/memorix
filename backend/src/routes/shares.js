import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from '../middleware/auth.js';
import shareController from '../controllers/shareController.js';

const router = Router();

router.post('/', auth, validation.validateShare, shareController.shareDeck);
router.get('/incoming', auth, shareController.getIncomingShares);
router.post('/:shareId/accept', auth, shareController.acceptShare);
router.post('/:shareId/decline', auth, shareController.declineShare);
// Get danh sách public decks - không cần auth
router.get('/public-decks', shareController.listPublicDecks);
// Clone một public deck - yêu cầu auth
router.post('/clone/:deckId', auth, shareController.clonePublicDeck);

export default router;
