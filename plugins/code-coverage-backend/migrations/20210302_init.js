/*
 * Copyright 2021 Spotify AB
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
  await knex.schema.createTable('code_coverage', table => {
    table.comment('The table of code coverage');
    table
      .uuid('id')
      .primary()
      .notNullable()
      .comment('The ID of the code coverage');
    table.text('entity_name').notNullable().comment('entity name');
    table.text('entity_kind').notNullable().comment('entity kind');
    table.text('entity_namespace').notNullable().comment('entity namespace');
    table
      .text('coverage')
      .notNullable()
      .comment('The coverage json as a string');
    table
      .dateTime('created_at')
      .defaultTo(knex.fn.now())
      .notNullable()
      .comment('The timestamp when this entry was created');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('code_coverage');
};
