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
  await knex.schema.createTable('facts', table => {
    table.comment(
      'The table for tech insight fact collections. Contains facts for individual fact retriever namespace/ref.',
    );
    table
      .text('id')
      .notNullable()
      .comment('Unique identifier of the fact retriever plugin/package');
    table
      .string('version')
      .notNullable()
      .comment(
        'SemVer string defining the version of schema this fact is based on.',
      );
    table
      .dateTime('timestamp')
      .defaultTo(knex.fn.now())
      .notNullable()
      .comment('The timestamp when this entry was created');
    table
      .text('entity')
      .notNullable()
      .comment('Identifier of the entity these facts relate to');
    table
      .text('facts')
      .notNullable()
      .comment(
        'Values of the fact collection stored as key-value pairs in JSON format.',
      );

    table
      .foreign(['id', 'version'])
      .references(['id', 'version'])
      .inTable('fact_schemas');

    table.index(['id', 'entity'], 'fact_id_entity_idx');
    table.index('id', 'fact_id_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('facts', table => {
    table.dropIndex([], 'fact_id_idx');
    table.dropIndex([], 'fact_id_entity_idx');
  });
  await knex.schema.dropTable('facts');
};
