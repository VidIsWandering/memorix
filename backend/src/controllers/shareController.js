import Share from '../models/Share.js';
import Deck from '../models/Deck.js';

const shareController = {
  // GET /api/shares/public-decks
  // Lấy danh sách tất cả public decks, hỗ trợ tìm kiếm theo tên và category
  listPublicDecks: async (req, res) => {
    try {
      const { q, category } = req.query;
      const [publicDecks, total] = await Promise.all([
        Share.getPublicDecks(q, category),
        Share.getPublicDecksCount(q, category),
      ]);
      // Thêm total_cards cho mỗi deck
      const decksWithTotalCards = await Promise.all(
        publicDecks.map(async (deck) => {
          const total_cards = await Deck.countCards(deck.deck_id);
          return { ...deck, total_cards };
        })
      );
      res.json({
        success: true,
        data: decksWithTotalCards,
        total,
      });
    } catch (error) {
      console.error('Error listing public decks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch public decks',
      });
    }
  },

  // POST /api/shares/clone/:deckId
  // Clone một public deck vào tài khoản của user
  clonePublicDeck: async (req, res) => {
    const { deckId } = req.params;
    const userId = req.user.userId; // Sửa lại cho đồng bộ

    try {
      const clonedDeck = await Share.cloneDeck(deckId, userId);
      res.json({
        success: true,
        message: 'Deck cloned successfully',
        data: clonedDeck,
      });
    } catch (error) {
      console.error('Error cloning deck:', error);
      if (error.message === 'Public deck not found') {
        return res.status(404).json({
          success: false,
          message: 'Public deck not found',
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to clone deck',
      });
    }
  },

  // POST /api/shares/share-deck
  // Chia sẻ một deck với user khác
  shareDeck: async (req, res) => {
    try {
      const { deck_id, receiver_email, permission_level } = req.body;
      const shared_by_user_id = req.user.userId;
      if (!deck_id || !receiver_email || !permission_level) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      // Tìm user nhận qua email
      const User = (await import('../models/User.js')).default;
      const receiver = await User.findByEmail(receiver_email);
      if (!receiver) {
        return res.status(404).json({ error: 'Receiver user not found' });
      }
      if (receiver.user_id === shared_by_user_id) {
        return res.status(400).json({ error: 'Cannot share deck to yourself' });
      }
      const share = await Share.createShare({
        deck_id,
        shared_by_user_id,
        shared_with_user_id: receiver.user_id,
        permission_level,
      });
      return res.status(201).json({ success: true, data: share });
    } catch (error) {
      console.error('Error sharing deck:', error);
      return res.status(500).json({ error: 'Failed to share deck' });
    }
  },

  // GET /api/shares/incoming
  // Lấy danh sách các share đến tài khoản của user
  getIncomingShares: async (req, res) => {
    try {
      const userId = req.user.userId;
      const shares = await Share.getIncomingShares(userId);
      return res.json({ success: true, data: shares });
    } catch (error) {
      console.error('Error getting incoming shares:', error);
      return res.status(500).json({ error: 'Failed to get incoming shares' });
    }
  },

  // POST /api/shares/accept/:shareId
  // Chấp nhận một share deck
  acceptShare: async (req, res) => {
    try {
      const { shareId } = req.params;
      const userId = req.user.userId;
      // Lấy thông tin share
      const share = await Share.updateShareStatus(shareId, 'accepted');
      if (!share || share.shared_with_user_id !== userId) {
        return res
          .status(404)
          .json({ error: 'Share not found or not for you' });
      }
      // Clone deck
      const newDeck = await Share.cloneDeckToUser(share.deck_id, userId);
      return res.json({ success: true, message: 'Deck cloned', data: newDeck });
    } catch (error) {
      console.error('Error accepting share:', error);
      return res.status(500).json({ error: 'Failed to accept share' });
    }
  },

  // POST /api/shares/decline/:shareId
  // Từ chối một share deck
  declineShare: async (req, res) => {
    try {
      const { shareId } = req.params;
      const userId = req.user.userId;
      const share = await Share.updateShareStatus(shareId, 'declined');
      if (!share || share.shared_with_user_id !== userId) {
        return res
          .status(404)
          .json({ error: 'Share not found or not for you' });
      }
      return res.json({ success: true, message: 'Share declined' });
    } catch (error) {
      console.error('Error declining share:', error);
      return res.status(500).json({ error: 'Failed to decline share' });
    }
  },
};

export default shareController;
