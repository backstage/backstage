/*
 * Copyright 2026 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * G7: Add created_at column (audit trail) and expires_at index (query performance).
 *
 * Before this migration, bulk-expiry queries (SELECT … WHERE expires_at < now())
 * required a full table scan. The new index reduces that to an index seek.
 *
 * created_at defaults to the current timestamp for all new rows.
 * Existing rows receive the migration timestamp as their created_at value —
 * the exact original insertion time is unknown, but any non-null value suffices
 * for audit purposes.
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('provider_tokens', table => {
    table
      .timestamp('created_at', { useTz: true, precision: 0 })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment(
        'Row insertion timestamp (audit trail). Set once; never updated.',
      );
  });

  await knex.schema.alterTable('provider_tokens', table => {
    table.index('expires_at', 'provider_tokens_expires_at_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('provider_tokens', table => {
    table.dropIndex('expires_at', 'provider_tokens_expires_at_idx');
  });

  await knex.schema.alterTable('provider_tokens', table => {
    table.dropColumn('created_at');
  });
};
