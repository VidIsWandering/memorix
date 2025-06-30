import { knex } from '../config/database.js';

const Device = {
  create: async (data) => {
    const [device] = await knex('user_devices').insert(data).returning('*');
    return device;
  },
  deleteByFcmToken: async (fcm_token) => {
    await knex('user_devices').where({ fcm_token }).del();
  },
};

export default Device;
