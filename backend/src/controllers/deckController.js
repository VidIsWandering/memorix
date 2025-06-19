import Deck from '../models/Deck.js';

// Tạo bộ thẻ mới
const createDeck = async (req, res) => {
  console.log('req.body:', req.body);
  console.log('req.user:', req.user);
  try {
    const { name, description, is_public } = req.body;
    const user_id = req.user?.userId;
    if (!user_id || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const deck = await Deck.create({ user_id, name, description, is_public });
    return res.status(201).json(deck);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create deck' });
  }
};

// Lấy tất cả bộ thẻ của user hiện tại
const getDecks = async (req, res) => {
  try {
    const user_id = req.user?.userId;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const decks = await Deck.findByUserId(user_id);
    return res.json(decks);
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
    // Nếu deck không public và không phải của user thì không cho xem
    if (!deck.is_public && deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return res.json(deck);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch deck' });
  }
};

// Cập nhật bộ thẻ
const updateDeck = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, is_public } = req.body;
    const deck = await Deck.findById(id);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    if (deck.user_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updated = await Deck.update(id, { name, description, is_public });
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