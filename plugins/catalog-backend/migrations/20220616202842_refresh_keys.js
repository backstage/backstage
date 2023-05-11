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
 * @param { import("knex").Knex } knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('refresh_keys', table => {
    table.comment(
      'This table contains relations between entities and keys to trigger refreshes with',
    );
    table
      .string('entity_id')
      .notNullable()
      .references('entity_id')
      .inTable('refresh_state')
      .onDelete('CASCADE')
      .comment('A reference to the entity that the refresh key is tied to');
    table
      .string('key')
      .notNullable()
      .comment(
        'A reference to a key which should be used to trigger a refresh on this entity',
      );
    table.index('entity_id', 'refresh_keys_entity_id_idx');
    table.index('key', 'refresh_keys_key_idx');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('refresh_keys', table => {
    table.dropIndex([], 'refresh_keys_entity_id_idx');
    table.dropIndex([], 'refresh_keys_key_idx');
  });

  await knex.schema.dropTable('refresh_keys');
};
