/**
 * Migration để thêm soft delete cho bảng flashcards
 */

export async function up(knex) {
  await knex.schema.alterTable('flashcards', (table) => {
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex) {
  await knex.schema.alterTable('flashcards', (table) => {
    table.dropColumn('deleted_at');
  });
}
