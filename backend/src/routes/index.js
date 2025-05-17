import { Router } from 'express';
import authRoutes from './auth.js';
import deckRoutes from './decks.js';
import flashcardRoutes from './flashcards.js';
import progressRoutes from './progress.js';
import groupRoutes from './groups.js';
import shareRoutes from './shares.js';
import deviceRoutes from './devices.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/decks', deckRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/progress', progressRoutes);
router.use('/groups', groupRoutes);
router.use('/shares', shareRoutes);
router.use('/devices', deviceRoutes);

export default router;
