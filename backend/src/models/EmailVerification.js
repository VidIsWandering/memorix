import { knex } from '../config/database.js';

const EmailVerification = {
  create: async (data) => {
    const [record] = await knex('email_verifications')
      .insert(data)
      .returning('*');
    return record;
  },
  findByUserId: async (user_id) => {
    return await knex('email_verifications').where({ user_id }).first();
  },
  findByCode: async (user_id, code) => {
    return await knex('email_verifications').where({ user_id, code }).first();
  },
  deleteByUserId: async (user_id) => {
    return await knex('email_verifications').where({ user_id }).del();
  },
};

export default EmailVerification;
