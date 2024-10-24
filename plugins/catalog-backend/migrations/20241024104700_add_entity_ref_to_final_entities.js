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
    table
      .text('entity_ref')
      .nullable()
      .comment(
        'The entity reference of the entity that was created from the catalog processing',
      );
  });

  // Set the default entity_ref in final_entities from the refresh_state table
  await knex.raw(
    `UPDATE final_entities SET entity_ref = refresh_state.entity_ref FROM refresh_state WHERE refresh_state.entity_id = final_entities.entity_id`,
  );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('final_entities', table => {
    table.dropColumn('entity_ref');
  });
};
