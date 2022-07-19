/*
 * Copyright 2020 The Backstage Authors
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

// NOTE: This may look like a plain duplicate of the previous one, but that
// file had a bug added when improving sqlite driver support:
// https://github.com/backstage/backstage/pull/10053/files#diff-30bb343265e71ca2f1cdcccd5ac8fdbb2a597507c5531bf26945059783377b15R24
// Since the old file was released to end users, those who created a new
// Backstage app specifically for PostgreSQL since the release will be missing
// this fix on their table. So we re-apply it.

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  // Sqlite does not support alter column.
  if (!knex.client.config.client.includes('sqlite3')) {
    await knex.schema.alterTable('signing_keys', table => {
      table
        .timestamp('created_at', { useTz: true, precision: 0 })
        .notNullable()
        .defaultTo(knex.fn.now())
        .comment('The creation time of the key')
        .alter({ alterType: true });
    });
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  // Sqlite does not support alter column.
  if (!knex.client.config.client.includes('sqlite3')) {
    await knex.schema.alterTable('signing_keys', table => {
      table
        .timestamp('created_at', { useTz: false, precision: 0 })
        .notNullable()
        .defaultTo(knex.fn.now())
        .comment('The creation time of the key')
        .alter({ alterType: true });
    });
  }
};
