import Deck from '../models/Deck.js';
import Flashcard from '../models/Flashcard.js';

// Tạo flashcard mới cho 1 deck
const createFlashcard = async (req, res) => {
  try {
    const { deck_id, card_type, content } = req.body;
    if (!deck_id || !card_type || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Kiểm tra deck có thuộc user không
    const deck = await Deck.findById(deck_id);
    if (!deck || deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
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
    // Kiểm tra deck có thuộc user không
    const deck = await Deck.findById(deckId);
    if (!deck || deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
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
    // Kiểm tra deck có thuộc user không
    const deck = await Deck.findById(flashcard.deck_id);
    if (!deck || deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
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
    // Kiểm tra deck có thuộc user không
    const deck = await Deck.findById(flashcard.deck_id);
    if (!deck || deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updated = await Flashcard.update(flashcardId, { card_type, content });
    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update flashcard' });
  }
};

// Xóa mềm flashcard
const deleteFlashcard = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    const flashcard = await Flashcard.findById(flashcardId);
    if (!flashcard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    // Kiểm tra deck có thuộc user không
    const deck = await Deck.findById(flashcard.deck_id);
    if (!deck || deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const deletedFlashcard = await Flashcard.delete(flashcardId);
    return res.json({ 
      success: true,
      message: 'Flashcard has been moved to trash',
      flashcard: deletedFlashcard
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete flashcard' });
  }
};

// Khôi phục flashcard từ thùng rác
const restoreFlashcard = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    // Tìm flashcard đã bị xóa mềm
    const flashcard = await Flashcard.findDeletedById(flashcardId);
    
    if (!flashcard) {
      return res.status(404).json({ error: 'Deleted flashcard not found' });
    }
    
    // Kiểm tra deck có thuộc user không
    const deck = await Deck.findById(flashcard.deck_id);
    if (!deck || deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const restoredFlashcard = await Flashcard.restore(flashcardId);
    return res.json({ 
      success: true, 
      message: 'Flashcard has been restored',
      flashcard: restoredFlashcard 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to restore flashcard' });
  }
};

// Lấy danh sách flashcard đã xóa trong một deck
const getDeletedFlashcards = async (req, res) => {
  try {
    const { deckId } = req.params;
    // Kiểm tra deck có thuộc user không
    const deck = await Deck.findById(deckId);
    if (!deck || deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const deletedFlashcards = await Flashcard.findDeletedByDeckId(deckId);
    return res.json(deletedFlashcards);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch deleted flashcards' });
  }
};

// Xóa cứng vĩnh viễn flashcard
const forceDeleteFlashcard = async (req, res) => {
  try {
    const { flashcardId } = req.params;
    // Tìm flashcard đã bị xóa mềm
    const flashcard = await Flashcard.findDeletedById(flashcardId);
    
    if (!flashcard) {
      return res.status(404).json({ error: 'Deleted flashcard not found' });
    }
    
    // Kiểm tra deck có thuộc user không
    const deck = await Deck.findById(flashcard.deck_id);
    if (!deck || deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await Flashcard.forceDelete(flashcardId);
    return res.json({ 
      success: true, 
      message: 'Flashcard has been permanently deleted' 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to permanently delete flashcard' });
  }
};

export default {
  createFlashcard,
  getFlashcards,
  getFlashcard,
  updateFlashcard,
  deleteFlashcard,
  restoreFlashcard,
  getDeletedFlashcards,
  forceDeleteFlashcard,
};
