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

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  // Note for the reader: the knex increments types automatically make it a
  // primary column, whether you like it or not. That's why the id column is
  // not marked as primary as one might have expected; it's only used for
  // lookups by ID. Because, SQLite and MySQL don't return RETURNING on
  // inserts ... so we want a manually generated key for lookups (an uuid),
  // and also an index for ordering guarantees :)
  await knex.schema.createTable('entity_result', table => {
    table.comment('Table containing results from running Linguist');
    table
      .bigIncrements('index')
      .notNullable()
      .comment('An insert counter to ensure ordering');
    table.uuid('id').notNullable().comment('The ID of the Linguist result');
    table
      .text('entity_ref')
      .unique()
      .notNullable()
      .comment('The entity ref that this Linguist result applies to');
    table.text('languages').comment('The results json as a string');
    table
      .dateTime('created_at')
      .defaultTo(knex.fn.now())
      .notNullable()
      .comment('The timestamp when this entry was created');
    table
      .dateTime('processed_date')
      .defaultTo(knex.fn.now())
      .comment('The timestamp when this entity was processed');
    table.index('index', 'entity_result_index_idx');
    table.index('entity_ref', 'entity_result_entity_ref_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('entity_result', table => {
    table.dropIndex([], 'entity_result_index_idx');
    table.dropIndex([], 'entity_result_entity_ref_idx');
  });
  await knex.schema.dropTable('entity_result');
};
