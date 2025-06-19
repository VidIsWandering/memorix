export async function up(knex) {
  return knex.schema.createTable('password_resets', (table) => {
    table
      .integer('user_id')
      .primary()
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('token').notNullable();
    table.timestamp('expires_at').notNullable();
    table.index('token');
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('password_resets');
}
