import Progress from '../models/Progress.js';
import Flashcard from '../models/Flashcard.js';
import Deck from '../models/Deck.js';


export function calculateSM2({ ease_factor = 2.5, interval_days = 1, repetitions = 0, rating }) {
  const ratingMap = { again: 0, hard: 3, good: 4, easy: 5 };
  const q = ratingMap[rating] ?? 0;

  let newEase = ease_factor;
  let newReps = repetitions;
  let newInterval = 1;

  if (q < 3) {
    newReps = 0;
  } else {
    newReps++;
    newInterval = newReps === 1 ? 1 : newReps === 2 ? 6 : Math.round(interval_days * newEase);
  }

  newEase += 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  if (newEase < 1.3) newEase = 1.3;

  return { ease_factor: newEase, interval_days: newInterval, repetitions: newReps };
}

export async function updateUserProgress(user_id, flashcard_id, rating) {
  const flashcard = await Flashcard.findById(flashcard_id);
  if (!flashcard) throw new Error('flashcard_not_found');

  const deck = await Deck.findById(flashcard.deck_id);
  if (!deck || deck.user_id !== user_id) throw new Error('forbidden');

  const [current] = await Progress.findByUserAndFlashcard(user_id, flashcard_id);
  const sm2 = calculateSM2({
    ease_factor: current?.ease_factor,
    interval_days: current?.interval_days,
    repetitions: current?.repetitions,
    rating
  });

  const now = new Date();
  const next_review_at = new Date(now.getTime() + sm2.interval_days * 24 * 60 * 60 * 1000);
  const data = {
    user_id,
    flashcard_id,
    deck_id: flashcard.deck_id,
    last_reviewed_at: now,
    next_review_at,
    ...sm2,
    user_rating: rating,
  };

  return await Progress.upsert(data);
}
