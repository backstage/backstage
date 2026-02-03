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
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.createTable(
    'backstage_backend_public_keys__keys',
    table => {
      table
        .string('id')
        .primary()
        .notNullable()
        .comment('The unique ID of a public key');

      table.text('key').notNullable().comment('JSON serialized public key');

      // Expiration is stored as a string for simplicity, all checks are done client-side
      table
        .string('expires_at')
        .notNullable()
        .comment('The time that the key expires');
    },
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  return knex.schema.dropTable('backstage_backend_public_keys__keys');
};
