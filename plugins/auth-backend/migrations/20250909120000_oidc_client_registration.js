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
  // These tables make up the OIDC client registration flow.
  // Clients are the top of the tree, that are created by the client registration flow.
  await knex.schema.createTable('oidc_clients', table => {
    table.comment(
      'OIDC clients that are registered via dynamic client registration',
    );

    table
      .string('client_id')
      .primary()
      .notNullable()
      .comment('The unique client ID of the client');

    table
      .string('client_secret')
      .notNullable()
      .comment('The client secret of the client');

    table
      .string('client_name')
      .notNullable()
      .comment('The name of the client, should be human readable');

    table
      .text('response_types', 'longtext')
      .notNullable()
      .comment('JSON array of supported response types');

    table
      .text('grant_types', 'longtext')
      .notNullable()
      .comment('JSON array of supported grant types');

    table
      .text('redirect_uris', 'longtext')
      .notNullable()
      .comment('Allowed redirect URIs as JSON array');

    table.text('scope').nullable().comment('Default scopes for the client');

    table
      .text('metadata', 'longtext')
      .nullable()
      .comment('Additional client metadata as JSON');
  });

  await knex.schema.createTable('oauth_authorization_sessions', table => {
    table.comment('Core OAuth authorization sessions with shared context');

    table
      .string('id')
      .primary()
      .notNullable()
      .comment('Unique session identifier');

    table.string('client_id').notNullable().comment('OIDC client identifier');

    table
      .string('user_entity_ref')
      .nullable()
      .comment('Backstage user entity reference');

    table
      .text('redirect_uri', 'longtext')
      .notNullable()
      .comment('Client redirect URI');

    table.text('scope').nullable().comment('Requested scopes space-separated');

    table.string('state').nullable().comment('Client state parameter');

    table.string('response_type').notNullable().comment('OAuth2 response type');

    table.string('code_challenge').nullable().comment('PKCE code challenge');

    table
      .string('code_challenge_method')
      .nullable()
      .comment('PKCE code challenge method');

    table.string('nonce').nullable().comment('OIDC nonce parameter');

    table
      .enum('status', ['pending', 'approved', 'rejected', 'expired'])
      .defaultTo('pending')
      .comment('Authorization session status');

    table
      .timestamp('expires_at', { useTz: true, precision: 0 })
      .notNullable()
      .comment('Session expiration timestamp');

    table.foreign('client_id').references('client_id').inTable('oidc_clients');
    table.index(['client_id', 'user_entity_ref']);
    table.index(['status', 'expires_at']);
  });

  await knex.schema.createTable('oidc_authorization_codes', table => {
    table.comment('OAuth authorization codes for code exchange flow');

    table
      .string('code')
      .primary()
      .notNullable()
      .comment('Unique authorization code');

    table
      .string('session_id')
      .notNullable()
      .comment('Authorization session identifier');

    table
      .timestamp('expires_at', { useTz: true, precision: 0 })
      .notNullable()
      .comment('Authorization code expiration timestamp');

    table
      .boolean('used')
      .defaultTo(false)
      .comment('Whether the authorization code has been used');

    table
      .foreign('session_id')
      .references('id')
      .inTable('oauth_authorization_sessions')
      .onDelete('CASCADE');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('oidc_authorization_codes');
  await knex.schema.dropTable('oauth_authorization_sessions');
  await knex.schema.dropTable('oidc_clients');
};
