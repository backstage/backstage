/*
 * Copyright 2023 The Backstage Authors
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

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.hasColumn('facts', 'uid').then(async hasCol => {
    if (!hasCol) {
      if (knex.client.config.client.includes('sqlite3')) {
        await knex.schema.renameTable('facts', 'tmp_facts');

        await knex.schema.alterTable('tmp_facts', table => {
          table.dropIndex(['id', 'entity'], 'fact_id_entity_idx');
          table.dropIndex('id', 'fact_id_idx');
          table.dropIndex(
            ['id', 'entity', 'timestamp'],
            'fact_id_entity_timestamp_idx',
          );
        });
        await knex.schema.createTable('facts', table => {
          table.comment(
            'The table for tech insight fact collections. Contains facts for individual fact retriever namespace/ref.',
          );
          table
            .uuid('uid')
            .primary()
            .defaultTo(knex.fn.uuid())
            .comment('Primary key to distinguish unique lines from each other');
          table
            .string('id')
            .notNullable()
            .comment('Unique identifier of the fact retriever plugin/package');
          table
            .string('version')
            .notNullable()
            .comment(
              'SemVer string defining the version of schema this fact is based on.',
            );
          table
            .dateTime('timestamp', { precision: 0 })
            .defaultTo(knex.fn.now())
            .notNullable()
            .comment('The timestamp when this entry was created');
          table
            .string('entity')
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
          table.index(
            ['id', 'entity', 'timestamp'],
            'fact_id_entity_timestamp_idx',
          );
        });

        await knex.schema.raw(
          `INSERT INTO facts (id, version, timestamp, entity, facts) SELECT id, version, timestamp, entity, facts FROM tmp_facts`,
        );
        knex.schema.dropTable('tmp_facts');
      } else {
        await knex.schema.alterTable('facts', table => {
          table
            .uuid('uid')
            .defaultTo(knex.fn.uuid())
            .primary()
            .comment('Primary key to distinguish unique lines from each other');
        });
      }
    }
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  knex.schema.alterTable('facts', table => table.dropPrimary());
};
