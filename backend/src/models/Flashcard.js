import { knex } from '../config/database.js';

const Flashcard = {
  create: async ({ deck_id, card_type, content }) => {
    const [flashcard] = await knex('flashcards')
      .insert({ deck_id, card_type, content })
      .returning('*');
    return flashcard;
  },
  findByDeckId: async (deck_id) => {
    return await knex('flashcards')
      .where({ deck_id })
      .whereNull('deleted_at');
  },
  findByDeckIds: async (deckIds) => {
    if (!deckIds.length) return [];
    return await knex('flashcards')
      .whereIn('deck_id', deckIds)
      .whereNull('deleted_at');
  },
  findById: async (flashcard_id) => {
    return await knex('flashcards')
      .where({ flashcard_id })
      .whereNull('deleted_at')
      .first();
  },
  findByIds: async (flashcardIds) => {
    if (!flashcardIds.length) return [];
    return await knex('flashcards')
      .whereIn('flashcard_id', flashcardIds)
      .whereNull('deleted_at');
  },
  update: async (flashcard_id, data) => {
    const [updated] = await knex('flashcards')
      .where({ flashcard_id })
      .update(data)
      .returning('*');
    return updated;
  },
  delete: async (flashcard_id) => {
    // Soft delete: chỉ đánh dấu deleted_at
    const [flashcard] = await knex('flashcards')
      .where({ flashcard_id })
      .update({ deleted_at: knex.fn.now() })
      .returning('*');
    return flashcard;
  },
  
  // Khôi phục flashcard đã xóa mềm
  restore: async (flashcard_id) => {
    const [flashcard] = await knex('flashcards')
      .where({ flashcard_id })
      .update({ deleted_at: null })
      .returning('*');
    return flashcard;
  },
  
  // Xóa cứng (hard delete) - chỉ dùng khi thực sự cần thiết
  forceDelete: async (flashcard_id) => {
    return await knex('flashcards').where({ flashcard_id }).del();
  },
  
  // Tìm các flashcard đã bị xóa mềm trong một deck
  findDeletedByDeckId: async (deck_id) => {
    return await knex('flashcards')
      .where({ deck_id })
      .whereNotNull('deleted_at')
      .orderBy('deleted_at', 'desc');
  },
  
  // Tìm flashcard đã xóa theo ID (để restore/force delete)
  findDeletedById: async (flashcard_id) => {
    return await knex('flashcards')
      .where({ flashcard_id })
      .whereNotNull('deleted_at')
      .first();
  },
};

export default Flashcard;