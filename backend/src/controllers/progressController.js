import * as ProgressService from '../../services/progressService.js';
import Progress from '../models/Progress.js';
import Flashcard from '../models/Flashcard.js';
import Deck from '../models/Deck.js';

const getUserId = (req) => req.user.user_id || req.user.userId;

export async function updateProgress(req, res) {
  try {
    const user_id = getUserId(req);
    const { flashcard_id, rating } = req.body;
    const updated = await ProgressService.updateUserProgress(user_id, flashcard_id, rating);
    res.json({ progress: updated });
  } catch (err) {
    if (err.message === 'flashcard_not_found')
      return res.status(404).json({ error: 'Flashcard not found' });
    if (err.message === 'forbidden')
      return res.status(403).json({ error: 'Not allowed to update progress' });
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function getDueFlashcards(req, res) {
  try {
    const user_id = getUserId(req);
    const now = new Date();
    const due = await Progress.findDueByUserId(user_id, now);
    res.json({ due });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function getUnlearnedAndLearnedFlashcards(req, res) {
  try {
    const user_id = getUserId(req);
    const decks = await Deck.findByUserId(user_id);
    const deckIds = decks.map(d => d.deck_id);
    if (deckIds.length === 0) return res.json({ unlearned: [], learned: [] });

    const allFlashcards = await Flashcard.findByDeckIds(deckIds);
    const learned = await Progress.findAllByUserId(user_id);
    const learnedIds = learned.map(p => p.flashcard_id);

    const unlearned = allFlashcards.filter(f => !learnedIds.includes(f.flashcard_id));
    const learnedFlashcards = allFlashcards.filter(f => learnedIds.includes(f.flashcard_id));

    res.json({ unlearned, learned: learnedFlashcards });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function updateProgressManual(req, res) {
  try {
    const user_id = getUserId(req);
    const { flashcard_id, ...fields } = req.body;
    if (!flashcard_id) return res.status(400).json({ error: 'Missing flashcard_id' });

    const [progress] = await Progress.findByUserAndFlashcard(user_id, flashcard_id);
    if (!progress) return res.status(404).json({ error: 'Progress not found' });

    const allowed = [
      'next_review_at', 'last_reviewed_at', 'interval_days',
      'ease_factor', 'repetitions', 'user_rating'
    ];
    const updateData = Object.fromEntries(
      Object.entries(fields).filter(([key]) => allowed.includes(key))
    );
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const [updated] = await Progress.updateByUserAndFlashcard(user_id, flashcard_id, updateData);
    res.json({ progress: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
