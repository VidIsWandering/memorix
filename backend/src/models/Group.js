import { knex } from '../config/database.js';

const Group = {
  create: async (data) => {
    const [group] = await knex('study_groups').insert(data).returning('*');
    return group;
  },
  findByUserId: async (userId) => {
    return await knex('study_groups').where({ owner_id: userId });
  },
};

export default Group;
