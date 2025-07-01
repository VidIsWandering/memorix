import * as progressService from '../utils/progressService.js';
import Progress from '../models/Progress.js';
import Flashcard from '../models/Flashcard.js';
import Deck from '../models/Deck.js';
import User from '../models/User.js';

const getUserId = (req) => req.user.user_id || req.user.userId;

export async function updateProgress(req, res) {
  try {
    const user_id = getUserId(req);
    const { flashcard_id, rating } = req.body;
    const updated = await progressService.updateUserProgress(user_id, flashcard_id, rating);
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
    // Lấy các flashcard đến hạn (progress)
    const dueProgress = await Progress.findDueByUserId(user_id, now);
    const flashcardIds = dueProgress.map(d => d.flashcard_id);
    if (flashcardIds.length === 0) return res.json({ due: {} });
    // Lấy thông tin flashcard tương ứng
    const flashcards = await Flashcard.findByIds(flashcardIds);
    // Gom nhóm theo card_type
    const grouped = {};
    flashcards.forEach(item => {
      const type = item.card_type || 'unknown';
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(item);
    });
    res.json({ due: grouped });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export async function getUnlearnedAndLearnedFlashcards(req, res) {
  try {
    const user_id = getUserId(req);
    const decks = await Deck.findByUserId(user_id);
    const deckIds = decks.map(d => d.deck_id);
    if (deckIds.length === 0) return res.json({ unlearned: {}, learned: {} });

    const allFlashcards = await Flashcard.findByDeckIds(deckIds);
    const learned = await Progress.findAllByUserId(user_id);
    const learnedIds = learned.map(p => p.flashcard_id);

    const unlearned = allFlashcards.filter(f => !learnedIds.includes(f.flashcard_id));
    const learnedFlashcards = allFlashcards.filter(f => learnedIds.includes(f.flashcard_id));

    // Nhóm theo card_type
    const groupByType = (arr) => {
      const grouped = {};
      arr.forEach(item => {
        const type = item.card_type || 'unknown';
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(item);
      });
      return grouped;
    };

    res.json({
      unlearned: groupByType(unlearned),
      learned: groupByType(learnedFlashcards)
    });
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
export async function getReviewStats(req, res) {
  try {
    const user_id = getUserId(req);

    // Lấy thống kê số lần review mỗi ngày trong 30 ngày gần nhất
    const stats = await Progress.getReviewStats(user_id, 30);

    // Tính tổng số review trong 7 ngày và 30 ngày
    const now = new Date();
    const daysAgo = (n) => {
      const d = new Date(now);
      d.setDate(d.getDate() - n);
      return d;
    };

    const last7Days = stats.filter(s => new Date(s.date) >= daysAgo(7));
    const last30Days = stats;

    const total7 = last7Days.reduce((sum, s) => sum + Number(s.count), 0);
    const total30 = last30Days.reduce((sum, s) => sum + Number(s.count), 0);

    res.json({
      last7Days: {
        total: total7,
        average: +(total7 / 7).toFixed(2),
        daily: last7Days,
      },
      last30Days: {
        total: total30,
        average: +(total30 / 30).toFixed(2),
        daily: last30Days,
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
export async function getReviewStreak(req, res) {
  try {
    const user_id = getUserId(req);
    const stats = await Progress.getReviewStats(user_id, 60);
    const days = Array.from(new Set(stats.map(s => s.date))).sort();

    let currentStreak = 0;
    let maxStreak = 0;
    let streak = 0;
    let prevDate = null;
    const today = new Date().toISOString().slice(0, 10);

    for (let i = 0; i < days.length; i++) {
      const date = days[i];
      if (!prevDate) {
        streak = 1;
      } else {
        const prev = new Date(prevDate);
        const curr = new Date(date);
        const diff = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
        streak = diff === 1 ? streak + 1 : 1;
      }
      if (streak > maxStreak) maxStreak = streak;
      prevDate = date;
    }

    if (days.length > 0) {
      const lastDate = days[days.length - 1];
      const last = new Date(lastDate);
      const now = new Date(today);
      const diff = Math.round((now - last) / (1000 * 60 * 60 * 24));
      currentStreak = (diff === 0 || diff === 1) ? streak : 0;
    }

    // Lưu vào DB
    await User.update(user_id, {
      current_review_streak: currentStreak,
      max_review_streak: maxStreak,
    });

    res.json({ currentStreak, maxStreak });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
export async function getDueFlashcardsByDeck(req, res) {
  try {
    const user_id = getUserId(req);
    const deck_id = req.params.deckId;
    if (!deck_id) return res.status(400).json({ error: 'Missing deck_id' });
    const now = new Date();
    const dueProgress = await Progress.findDueByUserIdAndDeckId(user_id, deck_id, now);
    const flashcardIds = dueProgress.map(d => d.flashcard_id);
    if (flashcardIds.length === 0) return res.json({ due: {} });
    const flashcards = await Flashcard.findByIds(flashcardIds);
    // Gom nhóm theo card_type
    const grouped = {};
    flashcards.forEach(item => {
      const type = item.card_type || 'unknown';
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(item);
    });
    res.json({ due: grouped });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}