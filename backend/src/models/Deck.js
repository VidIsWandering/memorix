import { knex } from '../config/database.js';

const Deck = {
  create: async (data) => {
    const [deck] = await knex('decks').insert(data).returning('*');
    return deck;
  },
  findByUserId: async (userId) => {
    return await knex('decks')
      .where({ user_id: userId })
      .orderBy('name', 'asc');
  },
  // Tìm kiếm theo tên và category
  searchByNameAndCategory: async (userId, q, category) => {
    let query = knex('decks').where({ user_id: userId });
    if (q) {
      query = query.andWhere('name', 'ilike', `%${q}%`);
    }
    if (category) {
      query = query.andWhere('category', category);
    }
    return await query.orderBy('name', 'asc');
  },
  searchByName: async (userId, q) => {
    return await knex('decks')
      .where({ user_id: userId })
      .andWhere('name', 'ilike', `%${q}%`)
      .orderBy('name', 'asc');
  },
  findById: async (deckId) => {
    return await knex('decks').where({ deck_id: deckId }).first();
  },
  countCards: async (deckId) => {
    const [{ count }] = await knex('flashcards')
      .where({ deck_id: deckId })
      .count();
    return parseInt(count, 10);
  },
  countUnlearnedCards: async (deckId, userId) => {
    // Chưa học: không có bản ghi trong user_flashcard_progress
    const [{ count }] = await knex('flashcards')
      .where({ deck_id: deckId })
      .whereNotExists(
        knex.select('*')
          .from('user_flashcard_progress')
          .whereRaw('user_flashcard_progress.flashcard_id = flashcards.flashcard_id')
          .andWhere('user_flashcard_progress.user_id', userId)
      )
      .count();
    return parseInt(count, 10);
  },
  countLearnedCards: async (deckId, userId) => {
    // Đã học: có bản ghi trong user_flashcard_progress
    const [{ count }] = await knex('user_flashcard_progress')
      .where({ deck_id: deckId, user_id: userId })
      .count();
    return parseInt(count, 10);
  },
  countDueCards: async (deckId, userId) => {
    // Đến hạn: có bản ghi và next_review_at <= NOW
    const [{ count }] = await knex('user_flashcard_progress')
      .where({ deck_id: deckId, user_id: userId })
      .andWhere('next_review_at', '<=', knex.fn.now())
      .count();
    return parseInt(count, 10);
  },
  update: async (deckId, data) => {
    const [deck] = await knex('decks')
      .where({ deck_id: deckId })
      .update(data)
      .returning('*');
    return deck;
  },
  delete: async (deckId) => {
    return await knex('decks').where({ deck_id: deckId }).del();
  },
};

export default Deck;
