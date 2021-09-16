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
  await knex.schema.createTable('fact_schemas', table => {
    table.comment(
      'The table for tech insight fact schemas. Containing a versioned data model definition for a collection of facts.',
    );
    table.increments('id').primary();
    table
      .text('ref')
      .notNullable()
      .comment('Identifier of the fact retriever plugin/package');
    table
      .string('version')
      .notNullable()
      .comment('SemVer string defining the version of schema.');
    table
      .text('schema')
      .notNullable()
      .comment(
        'Fact schema defining the values/types what this version of the fact would contain.',
      );

    table.index('ref', 'fact_schema_ref_idx');
    table.index(['ref', 'version'], 'fact_schema_ref_version_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('fact_schemas', table => {
    table.dropIndex([], 'fact_schema_ref_idx');
    table.dropIndex([], 'fact_schema_ref_version_idx');
  });
  await knex.schema.dropTable('fact_schemas');
};
