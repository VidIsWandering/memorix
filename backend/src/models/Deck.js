import { knex } from '../config/database.js';

const Deck = {
  create: async (data) => {
    const [deck] = await knex('decks').insert(data).returning('*');
    return deck;
  },
  findByUserId: async (userId) => {
    return await knex('decks')
      .where({ user_id: userId })
      .whereNull('deleted_at')
      .orderBy('name', 'asc');
  },
  // Tìm kiếm theo tên và category
  searchByNameAndCategory: async (userId, q, category) => {
    let query = knex('decks')
      .where({ user_id: userId })
      .whereNull('deleted_at');
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
      .whereNull('deleted_at')
      .andWhere('name', 'ilike', `%${q}%`)
      .orderBy('name', 'asc');
  },
  findById: async (deckId) => {
    return await knex('decks')
      .where({ deck_id: deckId })
      .whereNull('deleted_at')
      .first();
  },
  countCards: async (deckId) => {
    // Chỉ đếm cards của deck chưa bị xóa mềm
    const deck = await knex('decks')
      .where({ deck_id: deckId })
      .whereNull('deleted_at')
      .first();
    
    if (!deck) return 0;
    
    // Chỉ đếm flashcard chưa bị xóa mềm
    const [{ count }] = await knex('flashcards')
      .where({ deck_id: deckId })
      .whereNull('deleted_at')
      .count();
    return parseInt(count, 10);
  },
  countUnlearnedCards: async (deckId, userId) => {
    // Chỉ đếm cards của deck chưa bị xóa mềm
    const deck = await knex('decks')
      .where({ deck_id: deckId })
      .whereNull('deleted_at')
      .first();
    
    if (!deck) return 0;
    
    // Chưa học: không có bản ghi trong user_flashcard_progress và flashcard chưa bị xóa
    const [{ count }] = await knex('flashcards')
      .where({ deck_id: deckId })
      .whereNull('deleted_at')
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
    // Chỉ đếm cards của deck chưa bị xóa mềm
    const deck = await knex('decks')
      .where({ deck_id: deckId })
      .whereNull('deleted_at')
      .first();
    
    if (!deck) return 0;
    
    // Đã học: có bản ghi trong user_flashcard_progress và flashcard chưa bị xóa
    const [{ count }] = await knex('user_flashcard_progress')
      .join('flashcards', 'user_flashcard_progress.flashcard_id', 'flashcards.flashcard_id')
      .where({ 
        'user_flashcard_progress.deck_id': deckId, 
        'user_flashcard_progress.user_id': userId 
      })
      .whereNull('flashcards.deleted_at')
      .count('user_flashcard_progress.flashcard_id');
    return parseInt(count, 10);
  },
  countDueCards: async (deckId, userId) => {
    // Chỉ đếm cards của deck chưa bị xóa mềm
    const deck = await knex('decks')
      .where({ deck_id: deckId })
      .whereNull('deleted_at')
      .first();
    
    if (!deck) return 0;
    
    // Đến hạn: có bản ghi và next_review_at <= NOW và flashcard chưa bị xóa
    const [{ count }] = await knex('user_flashcard_progress')
      .join('flashcards', 'user_flashcard_progress.flashcard_id', 'flashcards.flashcard_id')
      .where({ 
        'user_flashcard_progress.deck_id': deckId, 
        'user_flashcard_progress.user_id': userId 
      })
      .whereNull('flashcards.deleted_at')
      .andWhere('user_flashcard_progress.next_review_at', '<=', knex.fn.now())
      .count('user_flashcard_progress.flashcard_id');
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
    // Soft delete: chỉ đánh dấu deleted_at
    const [deck] = await knex('decks')
      .where({ deck_id: deckId })
      .update({ deleted_at: knex.fn.now() })
      .returning('*');
    return deck;
  },
  
  // Khôi phục bộ thẻ đã xóa mềm
  restore: async (deckId) => {
    const [deck] = await knex('decks')
      .where({ deck_id: deckId })
      .update({ deleted_at: null })
      .returning('*');
    return deck;
  },
  
  // Xóa cứng (hard delete) - chỉ dùng khi thực sự cần thiết
  forceDelete: async (deckId) => {
    return await knex('decks').where({ deck_id: deckId }).del();
  },
  
  // Tìm các bộ thẻ đã bị xóa mềm
  findDeletedByUserId: async (userId) => {
    return await knex('decks')
      .where({ user_id: userId })
      .whereNotNull('deleted_at')
      .orderBy('deleted_at', 'desc');
  },
};

export default Deck;
