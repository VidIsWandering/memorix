import { knex } from '../config/database.js';

const Share = {
  create: async (data) => {
    const [share] = await knex('deck_shares').insert(data).returning('*');
    return share;
  },
};

export default Share;
