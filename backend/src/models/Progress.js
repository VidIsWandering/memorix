import { knex } from '../config/database.js';

const Progress = {
  upsert: async (data) => {
    // Upsert theo user_id + flashcard_id
    const [progress] = await knex('user_flashcard_progress')
      .insert(data)
      .onConflict(['user_id', 'flashcard_id'])
      .merge()
      .returning('*');
    return progress;
  },
  findByUserAndFlashcard: async (user_id, flashcard_id) => {
    return await knex('user_flashcard_progress')
      .where({ user_id, flashcard_id });
  },
  findDueByUserId: async (user_id, now = new Date()) => {
    return await knex('user_flashcard_progress')
      .where({ user_id })
      .andWhere('next_review_at', '<=', now)
      .orderBy('next_review_at', 'asc');
  },
  findByUserId: async (user_id) => {
  return await knex('decks').where({ user_id });
},
findAllByUserId: async (user_id) => {
  return await knex('user_flashcard_progress').where({ user_id });
},
  updateByUserAndFlashcard: async (user_id, flashcard_id, data) => {
    return await knex('user_flashcard_progress')
      .where({ user_id, flashcard_id })
      .update(data)
      .returning('*');
  },
};

export default Progress;