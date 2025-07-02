/*
 * Copyright 2024 The Backstage Authors
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
      .timestamp('created_at', { useTz: false, precision: 0 })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Client registration timestamp');

    table
      .timestamp('expires_at', { useTz: false, precision: 0 })
      .nullable()
      .comment('Client registration expiration timestamp');

    table
      .text('response_types', 'longtext')
      .notNullable()
      .comment('JSON array of supported response types');

    table
      .text('grant_types', 'longtext')
      .notNullable()
      .comment('JSON array of supported grant types');

    table
      .text('scope')
      .nullable()
      .comment('Space-separated list of allowed scopes');

    table
      .text('metadata', 'longtext')
      .nullable()
      .comment('Additional client metadata as JSON');
  });

  await knex.schema.createTable('oidc_authorization_codes', table => {
    table.comment('Authorization codes for OIDC authorization code flow');

    table.string('code').primary().notNullable().comment('Authorization code');

    table
      .string('client_id')
      .notNullable()
      .comment('Client ID that requested the code');

    table
      .string('user_entity_ref')
      .notNullable()
      .comment('User entity reference who authorized');

    table
      .text('redirect_uri')
      .notNullable()
      .comment('Redirect URI used in authorization request');

    table.text('scope').nullable().comment('Requested scopes');

    table.string('code_challenge').nullable().comment('PKCE code challenge');

    table
      .string('code_challenge_method')
      .nullable()
      .comment('PKCE code challenge method');

    table.string('nonce').nullable().comment('Nonce value for ID token');

    table
      .timestamp('created_at', { useTz: false, precision: 0 })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Code creation timestamp');

    table
      .timestamp('expires_at', { useTz: false, precision: 0 })
      .notNullable()
      .comment('Code expiration timestamp');

    table
      .boolean('used')
      .defaultTo(false)
      .comment('Whether the code has been used');

    table.foreign('client_id').references('client_id').inTable('oidc_clients');
  });

  await knex.schema.createTable('oidc_access_tokens', table => {
    table.comment('Access tokens issued by OIDC server');

    table
      .string('token_id')
      .primary()
      .notNullable()
      .comment('Unique token identifier');

    table
      .string('client_id')
      .notNullable()
      .comment('Client ID that owns the token');

    table
      .string('user_entity_ref')
      .notNullable()
      .comment('User entity reference');

    table.text('scope').nullable().comment('Token scopes');

    table
      .timestamp('created_at', { useTz: false, precision: 0 })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('Token creation timestamp');

    table
      .timestamp('expires_at', { useTz: false, precision: 0 })
      .notNullable()
      .comment('Token expiration timestamp');

    table
      .boolean('revoked')
      .defaultTo(false)
      .comment('Whether the token has been revoked');

    table.foreign('client_id').references('client_id').inTable('oidc_clients');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('oidc_access_tokens');
  await knex.schema.dropTable('oidc_authorization_codes');
  await knex.schema.dropTable('oidc_clients');
};
