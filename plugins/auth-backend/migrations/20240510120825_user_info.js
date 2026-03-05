/*
 * Copyright 2024 The Backstage Authors
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
  await knex.schema.createTable('user_info', table => {
    table.comment('User information');

    table
      .string('user_entity_ref')
      .primary()
      .notNullable()
      .comment('User entity reference');

    table
      .text('user_info', 'longtext')
      .notNullable()
      .comment('User info blob, JSON serialized');

    table
      .timestamp('exp')
      .notNullable()
      .comment('Expiration timestamp of the user info');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('user_info');
};
