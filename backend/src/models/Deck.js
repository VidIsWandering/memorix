import { knex } from '../config/database.js';

const Deck = {
  create: async (data) => {
    const [deck] = await knex('decks').insert(data).returning('*');
    return deck;
  },
  findByUserId: async (userId) => {
    return await knex('decks')
      .where({ user_id: userId })
      .orderBy('name', 'asc');
  },
  searchByName: async (userId, q) => {
    return await knex('decks')
      .where({ user_id: userId })
      .andWhere('name', 'ilike', `%${q}%`)
      .orderBy('name', 'asc');
  },
  findById: async (deckId) => {
    return await knex('decks').where({ deck_id: deckId }).first();
  },
  update: async (deckId, data) => {
    const [deck] = await knex('decks')
      .where({ deck_id: deckId })
      .update(data)
      .returning('*');
    return deck;
  },
  delete: async (deckId) => {
    return await knex('decks').where({ deck_id: deckId }).del();
  },
};

export default Deck;
