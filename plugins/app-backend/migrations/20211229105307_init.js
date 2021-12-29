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
  return knex.schema.createTable('static_asset_cache', table => {
    table.comment(
      'A cache of static assets that where previously deployed and may still be lazy-loaded by clients',
    );
    table
      .string('path')
      .primary()
      .notNullable()
      .comment('The path of the file');
    table
      .dateTime('last_modified_at')
      .notNullable()
      .comment(
        'Timestamp of when the asset was most recently seen in a deployment',
      );
    table.binary('content').notNullable().comment('The asset content');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  return knex.schema.dropTable('static_asset_cache');
};
