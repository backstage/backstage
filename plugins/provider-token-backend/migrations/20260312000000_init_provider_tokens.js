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

exports.up = async function up(knex) {
  await knex.schema.createTable('provider_tokens', table => {
    table.comment(
      'OAuth provider tokens persisted at sign-in time. Sensitive columns are AES-256-GCM encrypted.',
    );
    table
      .string('user_entity_ref')
      .notNullable()
      .comment('e.g. user:default/john.smith');
    table
      .string('provider_id')
      .notNullable()
      .comment('e.g. atlassian, microsoft, github');
    table
      .text('access_token')
      .notNullable()
      .comment(
        'AES-256-GCM encrypted. Format: v1:<iv_hex>:<tag_hex>:<data_hex>',
      );
    table
      .text('refresh_token')
      .nullable()
      .comment('AES-256-GCM encrypted. NULL if provider does not issue one.');
    table
      .text('scope')
      .nullable()
      .comment('AES-256-GCM encrypted. NULL if unknown.');
    table
      .timestamp('expires_at', { useTz: true, precision: 0 })
      .nullable()
      .comment(
        'Access token expiry. Plaintext — used for expiry-buffer queries.',
      );
    table
      .timestamp('updated_at', { useTz: true, precision: 0 })
      .notNullable()
      .defaultTo(knex.fn.now());
    table.primary(['user_entity_ref', 'provider_id']);
  });

  // Index for fast user sign-out (deleteTokens deletes all rows for a user)
  await knex.schema.table('provider_tokens', table => {
    table.index('user_entity_ref', 'provider_tokens_user_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('provider_tokens');
};
