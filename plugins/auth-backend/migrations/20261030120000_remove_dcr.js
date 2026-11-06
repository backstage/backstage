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
  const registeredClients = knex('oidc_clients').select('client_id');
  // Authorization codes are deleted with their sessions by the foreign key.
  await knex('oauth_authorization_sessions')
    .whereIn('client_id', registeredClients)
    .delete();
  await knex('offline_sessions')
    .whereIn('oidc_client_id', registeredClients)
    .delete();
  await knex.schema.dropTable('oidc_clients');
};

/**
 * Removed registrations and sessions cannot be restored on rollback.
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
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
};
