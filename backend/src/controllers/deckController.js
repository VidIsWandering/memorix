import Deck from '../models/Deck.js';

// Tạo bộ thẻ mới
const createDeck = async (req, res) => {
  try {
    const { name, description, is_public, image_url } = req.body;
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
    });
    return res.status(201).json(deck);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create deck' });
  }
};

// Lấy tất cả bộ thẻ của user hiện tại, hỗ trợ tìm kiếm theo tên, trả về theo thứ tự tên
const getDecks = async (req, res) => {
  try {
    const user_id = req.user?.userId;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { q } = req.query;
    let decks;
    if (q) {
      decks = await Deck.searchByName(user_id, q);
    } else {
      decks = await Deck.findByUserId(user_id);
    }
    // Thêm total_cards cho từng deck
    const decksWithCount = await Promise.all(
      decks.map(async (deck) => ({
        ...deck,
        total_cards: await Deck.countCards(deck.deck_id),
      }))
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
    const { name, description, is_public, image_url } = req.body;
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
