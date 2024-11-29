/*
 * Copyright 2022 The Backstage Authors
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
  await knex.schema.createTable('user_settings', table => {
    table.comment('The table of user related settings');

    table
      .string('user_entity_ref')
      .notNullable()
      .comment('The entityRef of the user');
    table.string('bucket').notNullable().comment('Name of the bucket');
    table.string('key').notNullable().comment('Key of a bucket value');
    table.text('value').notNullable().comment('The value');

    table.primary(['user_entity_ref', 'bucket', 'key']);
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('user_settings');
};
