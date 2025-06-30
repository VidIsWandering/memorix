import Deck from '../models/Deck.js';

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

// Xóa bộ thẻ
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
    await Deck.delete(id);
    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete deck' });
  }
};

export default { createDeck, getDecks, getDeck, updateDeck, deleteDeck };
