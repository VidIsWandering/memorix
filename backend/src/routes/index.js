import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './user.js';
import deckRoutes from './decks.js';
import flashcardRoutes from './flashcards.js';
import progressRoutes from './progress.js';
import groupRoutes from './groups.js';
import shareRoutes from './shares.js';
import deviceRoutes from './devices.js';
import testRoutes from './test.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/decks', deckRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/progress', progressRoutes);
router.use('/groups', groupRoutes);
router.use('/shares', shareRoutes);
router.use('/devices', deviceRoutes);
router.use('/test', testRoutes);

export default router;
