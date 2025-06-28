import { knex } from '../config/database.js';

const Flashcard = {
  create: async ({ deck_id, card_type, content }) => {
    const [flashcard] = await knex('flashcards')
      .insert({ deck_id, card_type, content })
      .returning('*');
    return flashcard;
  },
  findByDeckId: async (deck_id) => {
    return await knex('flashcards').where({ deck_id });
  },
  findByDeckIds: async (deckIds) => {
    if (!deckIds.length) return [];
    return await knex('flashcards').whereIn('deck_id', deckIds);
  },
  findById: async (flashcard_id) => {
    return await knex('flashcards').where({ flashcard_id }).first();
  },
  findByIds: async (flashcardIds) => {
  if (!flashcardIds.length) return [];
  return await knex('flashcards').whereIn('flashcard_id', flashcardIds);
},
  update: async (flashcard_id, data) => {
    const [updated] = await knex('flashcards')
      .where({ flashcard_id })
      .update(data)
      .returning('*');
    return updated;
  },
  delete: async (flashcard_id) => {
    return await knex('flashcards').where({ flashcard_id }).del();
  },
};

export default Flashcard;