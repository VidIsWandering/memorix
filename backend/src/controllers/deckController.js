import Deck from '../models/Deck.js';
import { knex } from '../config/database.js';

// Tạo bộ thẻ mới
const createDeck = async (req, res) => {
  try {
    const { name, description, is_public, image_url, category } = req.body;
    const user_id = req.user?.userId;
    if (!user_id || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const deck = await Deck.create({
      user_id,
      name,
      description,
      is_public,
      image_url,
      category,
    });
    return res.status(201).json(deck);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create deck' });
  }
};

// Lấy tất cả bộ thẻ của user hiện tại, hỗ trợ tìm kiếm theo tên và category, trả về theo thứ tự tên
const getDecks = async (req, res) => {
  try {
    const user_id = req.user?.userId;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { q, category } = req.query;
    let decks;
    if (q || category) {
      decks = await Deck.searchByNameAndCategory(user_id, q, category);
    } else {
      decks = await Deck.findByUserId(user_id);
    }
    // Thêm total_cards, unlearned_cards, learned_cards, due_cards cho từng deck
    const decksWithCount = await Promise.all(
      decks.map(async (deck) => {
        const [total_cards, unlearned_cards, learned_cards, due_cards] = await Promise.all([
          Deck.countCards(deck.deck_id),
          Deck.countUnlearnedCards(deck.deck_id, user_id),
          Deck.countLearnedCards(deck.deck_id, user_id),
          Deck.countDueCards(deck.deck_id, user_id),
        ]);
        return {
          ...deck,
          total_cards,
          unlearned_cards,
          learned_cards,
          due_cards,
        };
      })
    );
    return res.json(decksWithCount);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch decks' });
  }
};
// Lấy thông tin 1 bộ thẻ
const getDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const deck = await Deck.findById(id);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    if (!deck.is_public && deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // Thêm total_cards
    const total_cards = await Deck.countCards(deck.deck_id);
    return res.json({ ...deck, total_cards });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch deck' });
  }
};

// Cập nhật bộ thẻ
const updateDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_public, image_url, category } = req.body;
    const deck = await Deck.findById(id);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    if (deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updated = await Deck.update(id, {
      name,
      description,
      is_public,
      image_url,
      category,
    });
    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update deck' });
  }
};

// Xóa mềm bộ thẻ
const deleteDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const deck = await Deck.findById(id);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    if (deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const deletedDeck = await Deck.delete(id);
    return res.json({ 
      success: true, 
      message: 'Deck has been moved to trash',
      deck: deletedDeck 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete deck' });
  }
};

// Khôi phục bộ thẻ từ thùng rác
const restoreDeck = async (req, res) => {
  try {
    const { id } = req.params;
    // Tìm deck đã bị xóa mềm
    const deck = await knex('decks')
      .where({ deck_id: id })
      .whereNotNull('deleted_at')
      .first();
    
    if (!deck) {
      return res.status(404).json({ error: 'Deleted deck not found' });
    }
    if (deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const restoredDeck = await Deck.restore(id);
    return res.json({ 
      success: true, 
      message: 'Deck has been restored',
      deck: restoredDeck 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to restore deck' });
  }
};

// Lấy danh sách bộ thẻ đã xóa (thùng rác)
const getDeletedDecks = async (req, res) => {
  try {
    const user_id = req.user?.userId;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const deletedDecks = await Deck.findDeletedByUserId(user_id);
    return res.json(deletedDecks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch deleted decks' });
  }
};

// Xóa cứng vĩnh viễn (chỉ dùng khi thực sự cần thiết)
const forceDeleteDeck = async (req, res) => {
  try {
    const { id } = req.params;
    // Tìm deck đã bị xóa mềm
    const deck = await knex('decks')
      .where({ deck_id: id })
      .whereNotNull('deleted_at')
      .first();
    
    if (!deck) {
      return res.status(404).json({ error: 'Deleted deck not found' });
    }
    if (deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    await Deck.forceDelete(id);
    return res.json({ 
      success: true, 
      message: 'Deck has been permanently deleted' 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to permanently delete deck' });
  }
};

export default { 
  createDeck, 
  getDecks, 
  getDeck, 
  updateDeck, 
  deleteDeck, 
  restoreDeck, 
  getDeletedDecks, 
  forceDeleteDeck 
};
