export async function up(knex) {
  return knex.schema.createTable('refresh_tokens', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .references('user_id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE');
    table.text('token').notNullable();
    table.timestamp('expires_at').notNullable();
  });
}

export async function down(knex) {
  return knex.schema.dropTable('refresh_tokens');
}
