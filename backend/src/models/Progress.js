import { knex } from '../config/database.js';

const Progress = {
  update: async (data) => {
    const [progress] = await knex('user_flashcard_progress')
      .insert(data)
      .returning('*');
    return progress;
  },
  findDueByUserId: async (userId) => {
    return await knex('user_flashcard_progress').where({ user_id: userId });
  },
};

export default Progress;
