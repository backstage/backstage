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
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  // We are dropping the FK constraint because modern OIDC clients use
  // Client ID Metadata Documents (CIMD) which are not stored in 'oidc_clients'.
  await knex.schema.alterTable('offline_sessions', table => {
    table.dropForeign(['oidc_client_id']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  // To roll back, we must first delete "orphaned" sessions that don't have
  // a matching client ID, or the database will refuse to re-add the FK.
  await knex('offline_sessions')
    .whereNotNull('oidc_client_id')
    .whereNotIn('oidc_client_id', knex('oidc_clients').select('client_id'))
    .delete();

  await knex.schema.alterTable('offline_sessions', table => {
    table
      .foreign('oidc_client_id')
      .references('client_id')
      .inTable('oidc_clients')
      .onDelete('CASCADE');
  });
};
