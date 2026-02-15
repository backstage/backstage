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
 * Changes the search table's foreign key from refresh_state(entity_id)
 * to final_entities(entity_id). This allows search entries to reference
 * final entities directly, with CASCADE delete when entities are removed.
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  // Step 1: Drop the old foreign key constraint (to refresh_state)
  await knex.schema.alterTable('search', table => {
    table.dropForeign(['entity_id']);
  });

  // Step 2: Delete orphaned rows where entity_id doesn't exist in final_entities
  await knex('search')
    .whereNotIn('entity_id', knex('final_entities').select('entity_id'))
    .delete();

  // Step 3: Add new FK to final_entities(entity_id) with CASCADE
  await knex.schema.alterTable('search', table => {
    table
      .foreign('entity_id')
      .references('entity_id')
      .inTable('final_entities')
      .onDelete('CASCADE');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  // Step 1: Drop FK to final_entities
  await knex.schema.alterTable('search', table => {
    table.dropForeign(['entity_id']);
  });

  // Step 2: Delete orphaned rows where entity_id doesn't exist in refresh_state
  await knex('search')
    .whereNotIn('entity_id', knex('refresh_state').select('entity_id'))
    .delete();

  // Step 3: Add back FK to refresh_state(entity_id) with CASCADE
  await knex.schema.alterTable('search', table => {
    table
      .foreign('entity_id')
      .references('entity_id')
      .inTable('refresh_state')
      .onDelete('CASCADE');
  });
};
