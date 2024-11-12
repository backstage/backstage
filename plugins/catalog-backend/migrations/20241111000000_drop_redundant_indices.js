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
  await knex.schema.alterTable('final_entities', table => {
    table.dropIndex([], 'final_entities_entity_id_idx'); // overlaps with final_entities_pkey
  });

  await knex.schema.alterTable('refresh_state', table => {
    table.dropIndex([], 'refresh_state_entity_id_idx'); // overlaps with refresh_state_pkey
    table.dropIndex([], 'refresh_state_entity_ref_idx'); // overlaps with refresh_state_entity_ref_uniq
  });

  await knex.schema.alterTable('search', table => {
    table.dropIndex([], 'search_key_idx'); // was replaced by search_key_value_idx in 20240130092632_search_index
    table.dropIndex([], 'search_value_idx'); // was replaced by search_key_value_idx in 20240130092632_search_index
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('final_entities', table => {
    table.index('entity_id', 'final_entities_entity_id_idx');
  });

  await knex.schema.alterTable('refresh_state', table => {
    table.index('entity_id', 'refresh_state_entity_id_idx');
    table.index('entity_ref', 'refresh_state_entity_ref_idx');
  });

  await knex.schema.alterTable('search', table => {
    table.index(['key'], 'search_key_idx');
    table.index(['value'], 'search_value_idx');
  });
};
