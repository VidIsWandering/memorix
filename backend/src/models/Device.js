import { knex } from '../config/database.js';

const Device = {
  create: async (data) => {
    const [device] = await knex('user_devices').insert(data).returning('*');
    return device;
  },
};

export default Device;
