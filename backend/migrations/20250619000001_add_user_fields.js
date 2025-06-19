export async function up(knex) {
  return knex.schema.table('users', (table) => {
    table.string('phone').nullable();
    table.string('image_url').nullable();
  });
}

export async function down(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('phone');
    table.dropColumn('image_url');
  });
}
