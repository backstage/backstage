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
      .string('entity_ref')
      .nullable()
      .comment('The entity reference of the entity');
  });

  await knex
    .update({
      entity_ref: knex
        .select('r.entity_ref')
        .from('refresh_state as r')
        .where('r.entity_id', knex.raw('f.entity_id')),
    })
    .table('final_entities as f');

  await knex.schema.alterTable('final_entities', table => {
    table.string('entity_ref').notNullable().alter({ alterNullable: true });
    table.unique(['entity_ref'], {
      indexName: 'final_entities_entity_ref_uniq',
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('final_entities', table => {
    table.dropUnique([], 'final_entities_entity_ref_uniq');
    table.dropColumn('entity_ref');
  });
};
