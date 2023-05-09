/*
 * Copyright 2023 The Backstage Authors
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
  // See https://github.com/gx0r/connect-session-knex
  // Modeled loosely after https://github.com/gx0r/connect-session-knex/blob/4e0e36a9afbb13c3000a89f5e341f2d2d4339a02/lib/index.js#L114
  // For simplicity we always make the session a string
  // Do NOT change around this table or column names; the connect-session-knex library makes assumptions about them
  await knex.schema.createTable('sessions', table => {
    table.comment('Session data');
    table.string('sid').primary().notNullable().comment('ID of the session');
    table
      .text('sess', 'longtext')
      .notNullable()
      .comment('Session data, JSON serialized');
    table
      .timestamp('expired')
      .notNullable()
      .comment('The point in time when the session expires');
    table.index('sid', 'sessions_sid_idx');
    table.index('expired', 'sessions_expired_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('sessions', table => {
    table.dropIndex([], 'sessions_sid_idx');
    table.dropIndex([], 'sessions_expired_idx');
  });
  await knex.schema.dropTable('sessions');
};
