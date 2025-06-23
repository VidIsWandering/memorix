import { knex } from '../config/database.js';

const Share = {
  create: async (data) => {
    const [share] = await knex('deck_shares').insert(data).returning('*');
    return share;
  },

  getPublicDecks: async (searchQuery = null) => {
    let query = knex('decks')
      .where('is_public', true)
      .select('decks.*')
      .join('users', 'decks.user_id', 'users.user_id')
      .select('users.username as owner_username');

    if (searchQuery) {
      query = query.where('decks.name', 'ilike', `%${searchQuery}%`);
    }

    return query.orderBy('decks.name');
  },

  cloneDeck: async (deckId, userId) => {
    return knex.transaction(async (trx) => {
      // Kiểm tra và lấy deck gốc
      const [originalDeck] = await trx('decks')
        .where('deck_id', deckId)
        .where('is_public', true);

      if (!originalDeck) {
        throw new Error('Deck not found or not public');
      }

      // Clone deck
      const [newDeck] = await trx('decks')
        .insert({
          user_id: userId,
          name: originalDeck.name,
          description: originalDeck.description,
          image_url: originalDeck.image_url,
          is_public: false, // Mặc định set private cho deck được clone
        })
        .returning('*');

      // Clone all flashcards
      const originalFlashcards = await trx('flashcards').where(
        'deck_id',
        deckId
      );

      if (originalFlashcards.length > 0) {
        const newFlashcards = originalFlashcards.map((card) => ({
          deck_id: newDeck.deck_id,
          card_type: card.card_type,
          content: card.content,
        }));

        await trx('flashcards').insert(newFlashcards);
      }

      return newDeck;
    });
  },

  createShare: async ({
    deck_id,
    shared_by_user_id,
    shared_with_user_id,
    permission_level,
  }) => {
    const [share] = await knex('deck_shares')
      .insert({
        deck_id,
        shared_by_user_id,
        shared_with_user_id,
        permission_level,
        status: 'pending',
      })
      .returning('*');
    return share;
  },

  getIncomingShares: async (userId) => {
    return await knex('deck_shares')
      .where({ shared_with_user_id: userId, status: 'pending' })
      .join('decks', 'deck_shares.deck_id', 'decks.deck_id')
      .select(
        'deck_shares.*',
        'decks.name as deck_name',
        'decks.description as deck_description'
      );
  },

  updateShareStatus: async (shareId, status) => {
    const [share] = await knex('deck_shares')
      .where({ share_id: shareId })
      .update({ status })
      .returning('*');
    return share;
  },

  cloneDeckToUser: async (deckId, userId) => {
    return knex.transaction(async (trx) => {
      const originalDeck = await trx('decks').where('deck_id', deckId).first();
      if (!originalDeck) throw new Error('Deck not found');
      const [newDeck] = await trx('decks')
        .insert({
          user_id: userId,
          name: originalDeck.name,
          description: originalDeck.description,
          image_url: originalDeck.image_url,
          is_public: false,
        })
        .returning('*');
      const originalFlashcards = await trx('flashcards').where(
        'deck_id',
        deckId
      );
      if (originalFlashcards.length > 0) {
        const newFlashcards = originalFlashcards.map((card) => ({
          deck_id: newDeck.deck_id,
          card_type: card.card_type,
          content: card.content,
        }));
        await trx('flashcards').insert(newFlashcards);
      }
      return newDeck;
    });
  },
};

export default Share;
