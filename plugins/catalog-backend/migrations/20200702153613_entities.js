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
  // SQLite does not support FK and PK
  if (!knex.client.config.client.includes('sqlite3')) {
    await knex.schema.alterTable('entities_search', table => {
      table.dropForeign(['entity_id']);
    });
    await knex.schema.alterTable('entities', table => {
      table.dropPrimary('entities_pkey');
    });
  }
  await knex.schema.alterTable('entities', table => {
    table.dropUnique([], 'entities_unique_name');
    table.dropForeign(['location_id']);
  });
  // Setup temporary tables
  await knex.schema.renameTable('entities_search', 'tmp_entities_search');
  await knex.schema.renameTable('entities', 'tmp_entities');

  //
  // entities
  //
  await knex.schema
    .createTable('entities', table => {
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
        .string('api_version')
        .notNullable()
        .comment('The apiVersion field of the entity');
      table
        .string('kind')
        .notNullable()
        .comment('The kind field of the entity');
      table
        .string('name')
        .nullable()
        .comment('The metadata.name field of the entity');
      table
        .string('namespace')
        .nullable()
        .comment('The metadata.namespace field of the entity');
      table
        .text('metadata')
        .notNullable()
        .comment('The entire metadata JSON blob of the entity');
      table
        .text('spec')
        .nullable()
        .comment('The entire spec JSON blob of the entity');
    })
    .alterTable('entities', table => {
      // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#objectmeta-v1-meta
      table.unique(['kind', 'name', 'namespace'], {
        indexName: 'entities_unique_name',
      });
    });

  await knex.schema.raw(`INSERT INTO entities SELECT * FROM tmp_entities`);

  //
  // entities_search
  //
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
  });
  await knex.schema.raw(
    `INSERT INTO entities_search SELECT * FROM tmp_entities_search`,
  );

  // Clean up
  await knex.schema.dropTable('tmp_entities');
  return knex.schema.dropTable('tmp_entities_search');
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  // SQLite does not support FK and PK
  if (!knex.client.config.client.includes('sqlite3')) {
    await knex.schema.alterTable('entities_search', table => {
      table.dropForeign(['entity_id']);
    });
    await knex.schema.alterTable('entities', table => {
      table.dropPrimary('entities_pkey');
    });
  }
  await knex.schema.alterTable('entities', table => {
    table.dropUnique([], 'entities_unique_name');
  });

  // Setup temporary tables
  await knex.schema.renameTable('entities_search', 'tmp_entities_search');
  await knex.schema.renameTable('entities', 'tmp_entities');

  //
  // entities
  //
  await knex.schema
    .createTable('entities', table => {
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
        .string('generation')
        .notNullable()
        .unsigned()
        .comment(
          'A positive nonzero number that indicates the current generation of data for this entity; the value is incremented each time the spec changes.',
        );
      table
        .string('api_version')
        .notNullable()
        .comment('The apiVersion field of the entity');
      table
        .string('kind')
        .notNullable()
        .comment('The kind field of the entity');
      table
        .string('name')
        .nullable()
        .comment('The metadata.name field of the entity');
      table
        .string('namespace')
        .nullable()
        .comment('The metadata.namespace field of the entity');
      table
        .string('metadata')
        .notNullable()
        .comment('The entire metadata JSON blob of the entity');
      table
        .string('spec')
        .nullable()
        .comment('The entire spec JSON blob of the entity');
    })
    .alterTable('entities', table => {
      // https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.18/#objectmeta-v1-meta
      table.unique(['kind', 'name', 'namespace'], {
        indexName: 'entities_unique_name',
      });
    });

  await knex.schema.raw(`INSERT INTO entities SELECT * FROM tmp_entities`);

  //
  // entities_search
  //
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
  });
  await knex.schema.raw(
    `INSERT INTO entities_search SELECT * FROM tmp_entities_search`,
  );

  // Clean up
  await knex.schema.dropTable('tmp_entities');
  return knex.schema.dropTable('tmp_entities_search');
};
