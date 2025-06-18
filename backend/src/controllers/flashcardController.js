import Flashcard from '../models/Flashcard.js';

// Tạo flashcard mới cho 1 deck
const createFlashcard = async (req, res) => {
  try {
    const { deck_id, card_type, content } = req.body;
    if (!deck_id || !card_type || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const flashcard = await Flashcard.create({ deck_id, card_type, content });
    return res.status(201).json(flashcard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create flashcard' });
  }
};
// Lấy tất cả flashcard của 1 deck
const getFlashcards = async (req, res) => {
  try {
    const { deckId } = req.params;
    const flashcards = await Flashcard.findByDeckId(deckId);
    return res.json(flashcards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch flashcards' });
  }
};

// Lấy thông tin 1 flashcard
const getFlashcard = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const flashcard = await Flashcard.findById(flashcardId);
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    return res.json(flashcard);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch flashcard' });
  }
};

// Cập nhật flashcard
const updateFlashcard = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const { card_type, content } = req.body;
    const flashcard = await Flashcard.findById(flashcardId);
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    const updated = await Flashcard.update(flashcardId, { card_type, content });
    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update flashcard' });
  }
};

// Xóa flashcard
const deleteFlashcard = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const flashcard = await Flashcard.findById(flashcardId);
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    await Flashcard.delete(flashcardId);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete flashcard' });
  }
};

export default {
  createFlashcard,
  getFlashcards,
  getFlashcard,
  updateFlashcard,
  deleteFlashcard,
};