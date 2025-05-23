export async function up(knex) {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('user_id').primary();
      table.string('username').unique().notNullable();
      table.string('email').unique().notNullable();
      table.string('password_hash').notNullable();
    }),
    knex.schema.createTable('decks', (table) => {
      table.increments('deck_id').primary();
      table
        .integer('user_id')
        .notNullable()
        .references('user_id')
        .inTable('users');
      table.string('name').notNullable();
      table.text('description');
      table.boolean('is_public').defaultTo(false);
    }),
    knex.schema.createTable('flashcards', (table) => {
      table.increments('flashcard_id').primary();
      table
        .integer('deck_id')
        .notNullable()
        .references('deck_id')
        .inTable('decks')
        .onDelete('CASCADE');
      table.string('card_type').notNullable();
      table.jsonb('content').notNullable();
    }),
    knex.schema.createTable('user_flashcard_progress', (table) => {
      table
        .integer('user_id')
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .integer('flashcard_id')
        .notNullable()
        .references('flashcard_id')
        .inTable('flashcards')
        .onDelete('CASCADE');
      table
        .integer('deck_id')
        .notNullable()
        .references('deck_id')
        .inTable('decks')
        .onDelete('CASCADE');
      table.timestamp('last_reviewed_at').nullable();
      table.timestamp('next_review_at').notNullable();
      table.integer('interval_days').defaultTo(1);
      table.float('ease_factor').defaultTo(2.5);
      table.integer('repetitions').defaultTo(0);
      table.string('user_rating');
      table.primary(['user_id', 'flashcard_id']);
    }),
    knex.schema.createTable('study_groups', (table) => {
      table.increments('group_id').primary();
      table.string('name').notNullable();
      table.text('description');
      table
        .integer('creator_user_id')
        .notNullable()
        .references('user_id')
        .inTable('users');
    }),
    knex.schema.createTable('group_members', (table) => {
      table
        .integer('group_id')
        .notNullable()
        .references('group_id')
        .inTable('study_groups')
        .onDelete('CASCADE');
      table
        .integer('user_id')
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('role').notNullable().defaultTo('member');
      table.timestamp('joined_at').defaultTo(knex.fn.now());
      table.primary(['group_id', 'user_id']);
    }),
    knex.schema.createTable('deck_shares', (table) => {
      table.increments('share_id').primary();
      table
        .integer('deck_id')
        .notNullable()
        .references('deck_id')
        .inTable('decks')
        .onDelete('CASCADE');
      table
        .integer('shared_by_user_id')
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .integer('shared_with_user_id')
        .nullable()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .integer('shared_with_group_id')
        .nullable()
        .references('group_id')
        .inTable('study_groups')
        .onDelete('CASCADE');
      table.string('permission_level').notNullable();
      table.timestamp('shared_at').defaultTo(knex.fn.now());
      table.check('?? IS NOT NULL OR ?? IS NOT NULL', [
        'shared_with_user_id',
        'shared_with_group_id',
      ]);
      table.unique(['deck_id', 'shared_with_user_id']);
      table.unique(['deck_id', 'shared_with_group_id']);
    }),
    knex.schema.createTable('user_devices', (table) => {
      table.increments('device_id').primary();
      table
        .integer('user_id')
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('fcm_token').notNullable().unique();
      table.string('device_name').nullable();
      table.timestamp('last_used_at').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('refresh_tokens', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .references('user_id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE');
      table.text('token').notNullable();
      table.timestamp('expires_at').notNullable();
    }),
  ]);
}

export async function down(knex) {
  return Promise.all([
    knex.schema.dropTableIfExists('refresh_tokens'),
    knex.schema.dropTableIfExists('user_devices'),
    knex.schema.dropTableIfExists('deck_shares'),
    knex.schema.dropTableIfExists('group_members'),
    knex.schema.dropTableIfExists('study_groups'),
    knex.schema.dropTableIfExists('user_flashcard_progress'),
    knex.schema.dropTableIfExists('flashcards'),
    knex.schema.dropTableIfExists('decks'),
    knex.schema.dropTableIfExists('users'),
  ]);
}
