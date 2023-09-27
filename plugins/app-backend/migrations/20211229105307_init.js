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
  const isMySQL = knex.client.config.client.includes('mysql');
  await knex.schema.createTable('static_assets_cache', table => {
    table.comment(
      'A cache of static assets that where previously deployed and may still be lazy-loaded by clients',
    );
    if (!isMySQL) {
      table
        .text('path')
        .primary()
        .notNullable()
        .comment('The path of the file');
    } else {
      table
        .increments('id', { primaryKey: true })
        .comment('Primary key to distinguish unique lines from each other');
      table.text('path').notNullable().comment('The path of the file');
    }
    table
      .dateTime('last_modified_at')
      .defaultTo(knex.fn.now())
      .notNullable()
      .comment(
        'Timestamp of when the asset was most recently seen in a deployment',
      );
    table.binary('content').notNullable().comment('The asset content');
    table.index('last_modified_at', 'static_asset_cache_last_modified_at_idx');
  });
  // specifically for mysql specify a unique index up to 254 characters(mysql limit)
  if (isMySQL) {
    await knex.schema.raw(
      'create unique index static_assets_cache_path_idx on static_assets_cache(path(254));',
    );
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('static_assets_cache', table => {
    table.dropIndex([], 'static_asset_cache_last_modified_at_idx');
  });
  await knex.schema.dropTable('static_assets_cache');
};
