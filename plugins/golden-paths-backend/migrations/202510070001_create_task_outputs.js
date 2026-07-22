/*
 * Copyright 2026 The Backstage Authors
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
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('task_outputs', table => {
    table.comment('The table of tasks steps outputs');
    table
      .uuid('task_id')
      .notNullable()
      .comment('The ID of the golden path task');
    table
      .string('template_id')
      .notNullable()
      .comment('The reference ID of step in golden path');
    table.primary(['task_id', 'template_id']);
    table
      .text('outputs')
      .nullable()
      .comment('The outputs of the golden path task step');
    table.foreign('task_id').references('id').inTable('tasks');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('task_outputs');
};
