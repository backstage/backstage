/*
 * Copyright 2020 The Backstage Authors
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
  const isMySQL = knex.client.config.client.includes('mysql');
  await knex.schema.createTable('refresh_state', table => {
    table.comment('Location refresh states');
    table
      .string('entity_id')
      .primary()
      .notNullable()
      .comment('Primary ID, also used as the uid of the entity');
    table
      .string('entity_ref')
      .notNullable()
      .comment('A reference to the entity for this refresh state');
    table
      .text('unprocessed_entity')
      .notNullable()
      .comment('The unprocessed entity (in original form) as JSON');
    table
      .text('processed_entity', 'longtext')
      .nullable()
      .comment('The processed entity (not yet stitched) as JSON');
    table
      .text('cache')
      .nullable()
      .comment('Cache information tied to refreshes of this entity');
    table
      .text('errors')
      .notNullable()
      .comment('JSON array containing all errors related to entity');
    table
      .dateTime('next_update_at') // TODO: timezone or change to epoch-millis or similar
      .notNullable()
      .comment('Timestamp of when entity should be updated');
    table
      .dateTime('last_discovery_at') // TODO: timezone or change to epoch-millis or similar
      .notNullable()
      .comment('The last timestamp that this entity was discovered');
    table.unique(['entity_ref'], {
      indexName: 'refresh_state_entity_ref_uniq',
    });
    table.index('entity_id', 'refresh_state_entity_id_idx');
    table.index('entity_ref', 'refresh_state_entity_ref_idx');
    table.index('next_update_at', 'refresh_state_next_update_at_idx');
  });

  await knex.schema.createTable('final_entities', table => {
    table.comment('Final entities after processing and stitching');
    table
      .string('entity_id')
      .primary()
      .notNullable()
      .references('entity_id')
      .inTable('refresh_state')
      .onDelete('CASCADE')
      .comment('Entity ID -> refresh_state table');
    table
      .string('hash')
      .notNullable()
      .comment('Stable hash of the entity data');
    table
      .text('stitch_ticket')
      .notNullable()
      .comment('Random value representing a unique stitch attempt ticket');
    table
      .text('final_entity', 'longtext')
      .nullable()
      .comment('The JSON encoded final entity');
    table.index('entity_id', 'final_entities_entity_id_idx');
  });

  await knex.schema.createTable('refresh_state_references', table => {
    const textColumn = isMySQL
      ? table.string.bind(table)
      : table.text.bind(table);

    table.comment('Edges between refresh state rows');
    table
      .increments('id')
      .comment('Primary key to distinguish unique lines from each other');
    textColumn('source_key')
      .nullable()
      .comment('Opaque identifier for non-entity sources');
    textColumn('source_entity_ref')
      .nullable()
      .references('entity_ref')
      .inTable('refresh_state')
      .onDelete('CASCADE')
      .comment('EntityRef of entity sources');
    textColumn('target_entity_ref')
      .notNullable()
      .references('entity_ref')
      .inTable('refresh_state')
      .onDelete('CASCADE')
      .comment('The EntityRef of the target entity.');
    table.index('source_key', 'refresh_state_references_source_key_idx');
    table.index(
      'source_entity_ref',
      'refresh_state_references_source_entity_ref_idx',
    );
    table.index(
      'target_entity_ref',
      'refresh_state_references_target_entity_ref_idx',
    );
  });

  await knex.schema.createTable('relations', table => {
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
    table.index('source_entity_ref', 'relations_source_entity_ref_idx');
    table.index('originating_entity_id', 'relations_source_entity_id_idx');
  });

  await knex.schema.createTable('search', table => {
    table.comment('Flattened key-values from the entities, for filtering');
    table
      .string('entity_id')
      .references('entity_id')
      .inTable('refresh_state')
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
    table.index(['entity_id'], 'search_entity_id_idx');
    table.index(['key'], 'search_key_idx');
    table.index(['value'], 'search_value_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('refresh_state_references', table => {
    table.dropIndex([], 'refresh_state_references_source_key_idx');
    table.dropIndex([], 'refresh_state_references_source_entity_ref_idx');
    table.dropIndex([], 'refresh_state_references_target_entity_ref_idx');
  });
  await knex.schema.alterTable('refresh_state', table => {
    table.dropUnique([], 'refresh_state_entity_ref_uniq');
    table.dropIndex([], 'refresh_state_entity_id_idx');
    table.dropIndex([], 'refresh_state_entity_ref_idx');
    table.dropIndex([], 'refresh_state_next_update_at_idx');
  });
  await knex.schema.alterTable('final_entities', table => {
    table.dropIndex([], 'final_entities_entity_id_idx');
  });
  await knex.schema.alterTable('relations', table => {
    table.index('source_entity_ref', 'relations_source_entity_ref_idx');
    table.index('originating_entity_id', 'relations_source_entity_id_idx');
  });
  await knex.schema.alterTable('search', table => {
    table.dropIndex([], 'search_entity_id_idx');
    table.dropIndex([], 'search_key_idx');
    table.dropIndex([], 'search_value_idx');
  });

  await knex.schema.dropTable('search');
  await knex.schema.dropTable('final_entities');
  await knex.schema.dropTable('relations');
  await knex.schema.dropTable('references');
  await knex.schema.dropTable('refresh_state');
};
