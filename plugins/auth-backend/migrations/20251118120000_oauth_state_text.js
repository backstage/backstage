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
  await knex.schema.alterTable('oauth_authorization_sessions', table => {
    table.text('state', 'longtext').nullable().alter();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  // Delete sessions with state > 255 chars since they won't fit in varchar(255)
  // These sessions would be unusable with truncated state anyway
  await knex('oauth_authorization_sessions')
    .whereRaw('LENGTH(state) > 255')
    .delete();

  await knex.schema.alterTable('oauth_authorization_sessions', table => {
    table.string('state').nullable().alter();
  });
};
