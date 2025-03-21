/*
 * Copyright 2022 The Backstage Authors
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
  // Sqlite does not support alter column.
  if (!knex.client.config.client.includes('sqlite3')) {
    await knex.schema.alterTable('signing_keys', table => {
      table
        .text('key')
        .notNullable()
        .comment('The serialized signing key')
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
        .string('key')
        .notNullable()
        .comment('The serialized signing key')
        .alter({ alterType: true });
    });
  }
};
