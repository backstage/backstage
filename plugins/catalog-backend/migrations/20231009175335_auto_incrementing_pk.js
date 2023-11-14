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
  const isSqlite = knex.client.config.client.includes('sqlite3');
  await knex.schema.hasColumn('refresh_keys', 'id').then(async hasCol => {
    if (hasCol) return;
    if (isSqlite) {
      await knex.schema.renameTable('refresh_keys', 'tmp_refresh_keys');

      await knex.schema.table('tmp_refresh_keys', table => {
        table.dropIndex('entity_id', 'refresh_keys_entity_id_idx');
        table.dropIndex('key', 'refresh_keys_key_idx');
        table.dropForeign('entity_id');
      });

      await knex.schema.createTable('refresh_keys', table => {
        table.comment(
          'This table contains relations between entities and keys to trigger refreshes with',
        );
        table
          .increments('id', { primaryKey: true })
          .comment('Primary key to distinguish unique lines from each other');
        table
          .string('entity_id')
          .notNullable()
          .references('entity_id')
          .inTable('refresh_state')
          .onDelete('CASCADE')
          .comment('A reference to the entity that the refresh key is tied to');
        table
          .string('key')
          .notNullable()
          .comment(
            'A reference to a key which should be used to trigger a refresh on this entity',
          );
        table.index('entity_id', 'refresh_keys_entity_id_idx');
        table.index('key', 'refresh_keys_key_idx');
      });
      await knex.schema.raw(
        `INSERT INTO refresh_keys (entity_id, key) SELECT entity_id, key FROM tmp_refresh_keys`,
      );
      knex.schema.dropTable('tmp_refresh_keys');
    } else {
      await knex.schema.alterTable('refresh_keys', table => {
        table
          .increments('id', { primaryKey: true })
          .comment('Auto-generated ID of the location');
      });
    }
  });

  await knex.schema.hasColumn('relations', 'id').then(async hasCol => {
    if (isSqlite || hasCol) return;
    await knex.schema.alterTable('relations', table => {
      table
        .bigIncrements('id', { primaryKey: true })
        .comment('Primary key to distinguish unique lines from each other');
    });
  });

  await knex.schema.hasColumn('search', 'id').then(async hasCol => {
    if (isSqlite || hasCol) return;
    await knex.schema.alterTable('search', table => {
      table
        .bigIncrements('id', { primaryKey: true })
        .comment('Primary key to distinguish unique lines from each other');
    });
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('refresh_keys', table => {
    table.dropColumn('id');
  });
  await knex.schema.alterTable('relations', table => {
    table.dropColumn('id');
  });
  await knex.schema.alterTable('search', table => {
    table.dropColumn('id');
  });
};
