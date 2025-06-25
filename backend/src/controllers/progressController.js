import Progress from '../models/Progress.js';
import Flashcard from '../models/Flashcard.js';
import Deck from '../models/Deck.js'; 
function calculateSM2({ ease_factor, interval_days, repetitions, rating }) {
  let q = 0;
  switch (rating) {
    case 'again': q = 0; break;
    case 'hard': q = 3; break;
    case 'good': q = 4; break;
    case 'easy': q = 5; break;
    default: q = 0;
  }
  let newEase = ease_factor ?? 2.5;
  let newReps = repetitions ?? 0;
  let newInterval = 1;
  if (q < 3) {
    newReps = 0;
    newInterval = 1;
  } else {
    newReps += 1;
    if (newReps === 1) newInterval = 1;
    else if (newReps === 2) newInterval = 6;
    else newInterval = Math.round((interval_days ?? 1) * newEase);
  }
  newEase = newEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEase < 1.3) newEase = 1.3;
  return {
    ease_factor: newEase,
    interval_days: newInterval,
    repetitions: newReps,
  };
}

const updateProgress = async (req, res) => {
  try {
    const user_id = req.user.user_id || req.user.userId;
    const { flashcard_id, rating } = req.body;
    if (!flashcard_id || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Lấy flashcard và kiểm tra tồn tại
    const flashcard = await Flashcard.findById(flashcard_id);
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    const deck_id = flashcard.deck_id;

    // Kiểm tra deck có thuộc user không
    const deck = await Deck.findById(deck_id);
    if (!deck || deck.user_id !== user_id) {
      return res.status(403).json({ error: 'Not allowed to update progress for this flashcard' });
    }

    // ...phần còn lại giữ nguyên...
    const [current] = await Progress.findByUserAndFlashcard(user_id, flashcard_id);
    let ease_factor = 2.5, interval_days = 1, repetitions = 0;
    if (current) {
      ease_factor = current.ease_factor;
      interval_days = current.interval_days;
      repetitions = current.repetitions;
    }
    const sm2 = calculateSM2({ ease_factor, interval_days, repetitions, rating });
    const now = new Date();
    const next_review_at = new Date(now.getTime() + sm2.interval_days * 24 * 60 * 60 * 1000);
    const data = {
      user_id,
      flashcard_id,
      deck_id,
      last_reviewed_at: now,
      next_review_at,
      interval_days: sm2.interval_days,
      ease_factor: sm2.ease_factor,
      repetitions: sm2.repetitions,
      user_rating: rating,
    };
    const updated = await Progress.upsert(data);
    return res.json({ progress: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};

const getDueFlashcards = async (req, res) => {
  try {
    const user_id = req.user.user_id || req.user.userId;
    const now = new Date();
    const due = await Progress.findDueByUserId(user_id, now);
    return res.json({ due });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};
const getUnlearnedFlashcards = async (req, res) => {
  try {
    const user_id = req.user.user_id || req.user.userId;
    // Lấy tất cả deck của user
    const decks = await Deck.findByUserId(user_id);
    const deckIds = decks.map(d => d.deck_id);
    if (deckIds.length === 0) return res.json({ unlearned: [] });

    // Lấy tất cả flashcard thuộc các deck đó
    const allFlashcards = await Flashcard.findByDeckIds(deckIds);
    const allFlashcardIds = allFlashcards.map(f => f.flashcard_id);

    // Lấy tất cả progress của user
    const learned = await Progress.findAllByUserId(user_id);
    const learnedIds = learned.map(p => p.flashcard_id);

    // Lọc ra flashcard chưa học
    const unlearned = allFlashcards.filter(f => !learnedIds.includes(f.flashcard_id));

    return res.json({ unlearned });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};
const updateProgressManual = async (req, res) => {
  try {
    const user_id = req.user.user_id || req.user.userId;
    const { flashcard_id, ...fields } = req.body;
    if (!flashcard_id) {
      return res.status(400).json({ error: 'Missing flashcard_id' });
    }
    // Chỉ cho phép update progress của user hiện tại
    const [progress] = await Progress.findByUserAndFlashcard(user_id, flashcard_id);
    if (!progress) {
      return res.status(404).json({ error: 'Progress not found' });
    }
    // Chỉ update các trường hợp lệ
    const allowed = [
      'next_review_at', 'last_reviewed_at', 'interval_days',
      'ease_factor', 'repetitions', 'user_rating'
    ];
    const updateData = {};
    for (const key of allowed) {
      if (fields[key] !== undefined) updateData[key] = fields[key];
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }
    const [updated] = await Progress.updateByUserAndFlashcard(user_id, flashcard_id, updateData);
    return res.json({ progress: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};
export default { updateProgress, getDueFlashcards,  updateProgressManual ,  getUnlearnedFlashcards};