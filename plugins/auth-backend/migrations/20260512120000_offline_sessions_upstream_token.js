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

// @ts-check

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('offline_sessions', table => {
    table
      .text('upstream_token_key')
      .nullable()
      .comment(
        'Per-session AES-256-GCM encryption key (base64url) for the upstream refresh token stored in the client token',
      );

    table
      .string('auth_provider_id')
      .nullable()
      .comment('Upstream auth provider ID used to refresh the upstream token');

    table
      .string('auth_provider_env')
      .nullable()
      .comment(
        'Upstream auth provider environment (e.g. development, production)',
      );
  });

  await knex.schema.alterTable('oauth_authorization_sessions', table => {
    table
      .text('encrypted_upstream_token')
      .nullable()
      .comment(
        'AES-256-GCM encrypted upstream refresh token (ciphertext only, key is in the auth code)',
      );

    table
      .string('auth_provider_id')
      .nullable()
      .comment('Upstream auth provider ID for this session');

    table
      .string('auth_provider_env')
      .nullable()
      .comment('Upstream auth provider environment for this session');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('oauth_authorization_sessions', table => {
    table.dropColumn('encrypted_upstream_token');
    table.dropColumn('auth_provider_id');
    table.dropColumn('auth_provider_env');
  });

  await knex.schema.alterTable('offline_sessions', table => {
    table.dropColumn('upstream_token_key');
    table.dropColumn('auth_provider_id');
    table.dropColumn('auth_provider_env');
  });
};
