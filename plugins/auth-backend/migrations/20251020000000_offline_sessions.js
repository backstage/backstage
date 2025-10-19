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
  await knex.schema.createTable('offline_sessions', table => {
    table.comment(
      'Offline sessions for refresh tokens in dynamic client registration and device auth flows',
    );

    table
      .string('id')
      .primary()
      .notNullable()
      .comment('Persistent session ID that remains across token rotations');

    table
      .string('user_entity_ref')
      .notNullable()
      .comment('Backstage user entity reference');

    table
      .string('oidc_client_id')
      .nullable()
      .comment('OIDC client identifier (optional, for OIDC flows)');

    table
      .string('token_hash')
      .notNullable()
      .comment('Current refresh token hash (scrypt)');

    table
      .timestamp('created_at', { useTz: true, precision: 0 })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Session creation timestamp');

    table
      .timestamp('last_used_at', { useTz: true, precision: 0 })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Last token refresh timestamp');

    table
      .foreign('oidc_client_id')
      .references('client_id')
      .inTable('oidc_clients')
      .onDelete('CASCADE');
    table.index('user_entity_ref', 'offline_sessions_user_idx');
    table.index('created_at', 'offline_sessions_created_idx');
    table.index('last_used_at', 'offline_sessions_last_used_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('offline_sessions');
};
