/*
 * Copyright 2025 The Backstage Authors
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

// @ts-check

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('refresh_sessions', table => {
    table.comment('Long-lasting refresh sessions for CLI and offline access');

    table
      .string('session_id')
      .primary()
      .notNullable()
      .comment('Unique identifier for the refresh session');

    table
      .string('user_entity_ref')
      .notNullable()
      .comment('User entity reference');

    table
      .string('token_hash')
      .notNullable()
      .unique()
      .comment('Hash of the refresh token for lookup');

    table
      .text('session_data', 'longtext')
      .notNullable()
      .comment('Session data including original claims, JSON serialized');

    table
      .timestamp('created_at')
      .defaultTo(knex.fn.now())
      .notNullable()
      .comment('When the refresh session was created');

    table
      .timestamp('expires_at')
      .notNullable()
      .comment('When the refresh session expires');

    table
      .timestamp('last_used_at')
      .nullable()
      .comment('When the refresh token was last used to generate an access token');

    table
      .boolean('revoked')
      .defaultTo(false)
      .notNullable()
      .comment('Whether the refresh session has been revoked');

    table.index('user_entity_ref', 'refresh_sessions_user_idx');
    table.index('token_hash', 'refresh_sessions_token_idx');
    table.index('expires_at', 'refresh_sessions_expires_idx');
    table.index('revoked', 'refresh_sessions_revoked_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('refresh_sessions', table => {
    table.dropIndex([], 'refresh_sessions_user_idx');
    table.dropIndex([], 'refresh_sessions_token_idx');
    table.dropIndex([], 'refresh_sessions_expires_idx');
    table.dropIndex([], 'refresh_sessions_revoked_idx');
  });
  await knex.schema.dropTable('refresh_sessions');
};