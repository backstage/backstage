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
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.createTable(
    'backstage_backend_key_value_store__entries',
    table => {
      table
        .string('key', 255)
        .primary()
        .notNullable()
        .comment('The namespaced key for this entry');

      table.text('value').notNullable().comment('JSON serialized value');

      table
        .dateTime('updated_at')
        .notNullable()
        .comment('The time this entry was last written');
    },
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  return knex.schema.dropTable('backstage_backend_key_value_store__entries');
};
