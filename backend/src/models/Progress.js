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
  },getReviewStats: async (user_id, days = 30) => {
  // Đếm số lần review mỗi ngày trong N ngày gần nhất
  return await knex('user_flashcard_progress')
    .where({ user_id })
    .where('last_reviewed_at', '>=', knex.raw(`CURRENT_DATE - INTERVAL '${days} days'`))
    .select(
      knex.raw(`DATE(last_reviewed_at) as date`),
      knex.raw('COUNT(*) as count')
    )
    .groupByRaw('DATE(last_reviewed_at)')
    .orderBy('date', 'asc');
},
};

export default Progress;