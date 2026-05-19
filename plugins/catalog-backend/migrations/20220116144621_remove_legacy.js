/*
 * Copyright 2021 The Backstage Authors
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
  await knex.schema.dropTable('entities_relations');
  await knex.schema.dropTable('entities_search');
  await knex.schema.dropTable('entities');
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.createTable('entities', table => {
    table.comment('All entities currently stored in the catalog');
    table.uuid('id').primary().comment('Auto-generated ID of the entity');
    table
      .uuid('location_id')
      .references('id')
      .inTable('locations')
      .nullable()
      .comment('The location that originated the entity');
    table
      .string('etag')
      .notNullable()
      .comment(
        'An opaque string that changes for each update operation to any part of the entity, including metadata.',
      );
    table
      .integer('generation')
      .notNullable()
      .unsigned()
      .comment(
        'A positive nonzero number that indicates the current generation of data for this entity; the value is incremented each time the spec changes.',
      );
    table
      .string('full_name')
      .notNullable()
      .comment('The full name of the entity');
    table
      .text('data')
      .notNullable()
      .comment('The entire JSON data blob of the entity');
    table.unique(['full_name'], { indexName: 'entities_unique_full_name' });
    table.index('location_id', 'entity_location_id_idx');
  });

  await knex.schema.createTable('entities_search', table => {
    table.comment(
      'Flattened key-values from the entities, used for quick filtering',
    );
    table
      .uuid('entity_id')
      .references('id')
      .inTable('entities')
      .onDelete('CASCADE')
      .comment('The entity that matches this key/value');
    table
      .string('key')
      .notNullable()
      .comment('A key that occurs in the entity');
    table
      .string('value')
      .nullable()
      .comment('The corresponding value to match on');
    table.index(['key'], 'entities_search_key');
    table.index(['value'], 'entities_search_value');
    table.index(['entity_id'], 'entity_id_idx');
  });

  await knex.schema.createTable('entities_relations', table => {
    table.comment('All relations between entities in the catalog');
    table
      .uuid('originating_entity_id')
      .references('id')
      .inTable('entities')
      .onDelete('CASCADE')
      .notNullable()
      .comment('The entity that provided the relation');
    table
      .string('source_full_name')
      .notNullable()
      .comment('The full name of the source entity of the relation');
    table
      .string('type')
      .notNullable()
      .comment('The type of the relation between the entities');
    table
      .string('target_full_name')
      .notNullable()
      .comment('The full name of the target entity of the relation');
    table.index('source_full_name', 'source_full_name_idx');
    table.index('originating_entity_id', 'originating_entity_id_idx');
  });
};
