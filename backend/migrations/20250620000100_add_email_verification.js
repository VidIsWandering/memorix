export async function up(knex) {
  await knex.schema.table('users', (table) => {
    table.boolean('is_verified').defaultTo(false);
  });
  await knex.schema.createTable('email_verifications', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('code').notNullable();
    table.timestamp('expires_at').notNullable();
    table.unique(['user_id']);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('email_verifications');
  await knex.schema.table('users', (table) => {
    table.dropColumn('is_verified');
  });
}
