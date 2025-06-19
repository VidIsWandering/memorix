import { knex } from '../config/database.js';

const User = {
  create: async (data) => {
    const [user] = await knex('users')
      .insert(data)
      .returning(['user_id', 'username', 'email', 'phone', 'image_url']);
    return user;
  },
  findByEmail: async (email) => {
    return await knex('users').where({ email }).first();
  },
  findById: async (userId) => {
    return await knex('users').where({ user_id: userId }).first();
  },
  update: async (userId, updates) => {
    const updatedUser = await knex('users')
      .where({ user_id: userId })
      .update(updates)
      .returning(['user_id', 'username', 'email', 'phone', 'image_url']);
    return updatedUser[0] || null;
  },
};

export default User;
