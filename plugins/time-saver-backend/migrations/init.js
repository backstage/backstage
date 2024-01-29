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
  //  create function only for postgres
  if (knex.client.config.client === 'pg') {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').then(() => {
      console.log('uuid-ossp extension enabled');
    });
    await knex.schema.createTable('ts_template_time_savings', table => {
      table.comment(
        'Table contains template time savings with relation to the templateTaskId',
      );
      table
        .uuid('id')
        .primary()
        .defaultTo(knex.raw('public.uuid_generate_v4()::uuid'))
        .comment('UUID');
      table
        .timestamp('created_at', { useTz: false, precision: 0 })
        .notNullable()
        .defaultTo(knex.fn.now())
        .comment('The creation time of the record');
      table.string('template_task_id').comment('Template task ID');
      table
        .string('template_name')
        .comment('Template name as template entity_reference');
      table.string('team').comment('Team name of saved time');
      table
        .float('time_saved', 2)
        .comment('time saved by the team within template task ID, in hours');
      table.string('template_task_status').comment('template task status');
      table
        .string('created_by')
        .comment('entity refernce to the user that has executed the template');
    });
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  return knex.schema.dropTable('ts_template_time_savings');
};
