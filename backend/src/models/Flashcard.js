import { knex } from '../config/database.js';

const Flashcard = {
  create: async (data) => {
    const [flashcard] = await knex('flashcards').insert(data).returning('*');
    return flashcard;
  },
  findByDeckId: async (deckId) => {
    return await knex('flashcards').where({ deck_id: deckId });
  },
  findById: async (flashcardId) => {
    return await knex('flashcards')
      .where({ flashcard_id: flashcardId })
      .first();
  },
  update: async (flashcardId, data) => {
    const [flashcard] = await knex('flashcards')
      .where({ flashcard_id: flashcardId })
      .update(data)
      .returning('*');
    return flashcard;
  },
  delete: async (flashcardId) => {
    return await knex('flashcards').where({ flashcard_id: flashcardId }).del();
  },
};

export default Flashcard;