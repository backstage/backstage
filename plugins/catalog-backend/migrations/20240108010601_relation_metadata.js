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

exports.up = async function up(knex) {
  await knex.schema.createTable('relations_search', table => {
    table.comment(
      'Flattened key-values from the relations, used for quick filtering',
    );
    table.comment('All relations between entities');
    table
      .string('originating_entity_id')
      .references('entity_id')
      .inTable('refresh_state')
      .onDelete('CASCADE')
      .notNullable()
      .comment('The entity that provided the relation');
    table
      .string('source_entity_ref')
      .notNullable()
      .comment('Entity reference of the source entity of the relation');
    table
      .string('type')
      .notNullable()
      .comment('The type of the relation between the entities');
    table
      .string('target_entity_ref')
      .notNullable()
      .comment('Entity reference of the target entity of the relation');
    table
      .string('key')
      .notNullable()
      .comment('A key that occurs in the entity');
    table
      .string('value')
      .nullable()
      .comment('The corresponding value to match on');
    table.index('source_entity_ref', 'relations_search_source_entity_ref_idx');
    table.index('target_entity_ref', 'relations_search_target_entity_ref_idx');

    // table.index(['entity_id'], 'search_entity_id_idx');
    table.index(['key'], 'relations_search_key_idx');
    table.index(['value'], 'relations_search_value_idx');
  });

  await knex.schema.alterTable('relations', table => {
    table.text('metadata').nullable().comment('Relation metadata blob.');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('relations_search', table => {
    table.dropIndex([], 'relations_search_source_entity_ref_idx');
    table.dropIndex([], 'relations_search_target_entity_ref_idx');
    table.dropIndex([], 'relations_search_key_idx');
    table.dropIndex([], 'relations_search_value_idx');
  });
  await knex.schema.dropTable('relations_search');

  await knex.schema.alterTable('relations', table => {
    table.dropColumn('metadata');
  });
};
