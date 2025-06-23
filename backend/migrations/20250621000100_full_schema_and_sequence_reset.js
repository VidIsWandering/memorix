// Migration tổng hợp: tạo bảng và reset sequence cho các bảng có auto-increment

export async function up(knex) {
  // Tạo bảng
  await knex.schema.createTable('users', (table) => {
    table.increments('user_id').primary();
    table.string('username').unique().notNullable();
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.string('phone').nullable();
    table.string('image_url').nullable();
    table.boolean('is_verified').defaultTo(false);
  });

  await knex.schema.createTable('decks', (table) => {
    table.increments('deck_id').primary();
    table
      .integer('user_id')
      .notNullable()
      .references('user_id')
      .inTable('users');
    table.string('name').notNullable();
    table.text('description');
    table.string('image_url');
    table.boolean('is_public').defaultTo(false);
  });

  await knex.schema.createTable('flashcards', (table) => {
    table.increments('flashcard_id').primary();
    table
      .integer('deck_id')
      .notNullable()
      .references('deck_id')
      .inTable('decks')
      .onDelete('CASCADE');
    table.string('card_type').notNullable();
    table.jsonb('content').notNullable();
  });

  await knex.schema.createTable('user_flashcard_progress', (table) => {
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
  });

  await knex.schema.createTable('study_groups', (table) => {
    table.increments('group_id').primary();
    table.string('name').notNullable();
    table.text('description');
    table
      .integer('creator_user_id')
      .notNullable()
      .references('user_id')
      .inTable('users');
  });

  await knex.schema.createTable('group_members', (table) => {
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
  });

  await knex.schema.createTable('deck_shares', (table) => {
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
    table.string('status').notNullable().defaultTo('pending'); // pending, accepted, declined
    table.check('?? IS NOT NULL OR ?? IS NOT NULL', [
      'shared_with_user_id',
      'shared_with_group_id',
    ]);
    table.unique(['deck_id', 'shared_with_user_id']);
    table.unique(['deck_id', 'shared_with_group_id']);
  });

  await knex.schema.createTable('user_devices', (table) => {
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
  });

  await knex.schema.createTable('refresh_tokens', (table) => {
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

  await knex.schema.createTable('password_resets', (table) => {
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

  // Reset sequence cho các bảng có auto-increment (chỉ khi đã có dữ liệu mẫu)
  // Nếu bảng rỗng, set về 1 (id đầu tiên sẽ là 1)
  await knex.raw(`
    SELECT setval('users_user_id_seq', COALESCE((SELECT MAX(user_id) FROM users), 1), false);
    SELECT setval('decks_deck_id_seq', COALESCE((SELECT MAX(deck_id) FROM decks), 1), false);
    SELECT setval('flashcards_flashcard_id_seq', COALESCE((SELECT MAX(flashcard_id) FROM flashcards), 1), false);
    SELECT setval('study_groups_group_id_seq', COALESCE((SELECT MAX(group_id) FROM study_groups), 1), false);
    SELECT setval('deck_shares_share_id_seq', COALESCE((SELECT MAX(share_id) FROM deck_shares), 1), false);
    SELECT setval('user_devices_device_id_seq', COALESCE((SELECT MAX(device_id) FROM user_devices), 1), false);
    SELECT setval('refresh_tokens_id_seq', COALESCE((SELECT MAX(id) FROM refresh_tokens), 1), false);
    SELECT setval('email_verifications_id_seq', COALESCE((SELECT MAX(id) FROM email_verifications), 1), false);
  `);
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('email_verifications');
  await knex.schema.dropTableIfExists('password_resets');
  await knex.schema.dropTableIfExists('refresh_tokens');
  await knex.schema.dropTableIfExists('user_devices');
  await knex.schema.dropTableIfExists('deck_shares');
  await knex.schema.dropTableIfExists('group_members');
  await knex.schema.dropTableIfExists('study_groups');
  await knex.schema.dropTableIfExists('user_flashcard_progress');
  await knex.schema.dropTableIfExists('flashcards');
  await knex.schema.dropTableIfExists('decks');
  await knex.schema.dropTableIfExists('users');
}
