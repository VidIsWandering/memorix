/**
 * Migration để thêm soft delete cho bảng decks
 */

export async function up(knex) {
  await knex.schema.alterTable('decks', (table) => {
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex) {
  await knex.schema.alterTable('decks', (table) => {
    table.dropColumn('deleted_at');
  });
}
