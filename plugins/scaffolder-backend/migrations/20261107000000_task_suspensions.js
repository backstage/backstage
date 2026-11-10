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

exports.up = async function up(knex) {
  await knex.schema.createTable('task_suspensions', table => {
    table.uuid('id').primary();
    table
      .uuid('task_id')
      .notNullable()
      .references('id')
      .inTable('tasks')
      .onDelete('CASCADE');
    table.string('key').notNullable();
    table.string('step_id').notNullable();
    table.text('reason');
    table.bigInteger('expires_at');
    table.timestamp('consumed_at');
    table.text('result', 'longtext');
    table.unique(['task_id', 'key']);
    table.index(['consumed_at', 'expires_at']);
  });
  await knex.schema.createTable('task_suspension_triggers', table => {
    table
      .uuid('suspension_id')
      .notNullable()
      .references('id')
      .inTable('task_suspensions')
      .onDelete('CASCADE');
    table.string('trigger_id').notNullable();
    table.string('type').notNullable();
    table.string('topic');
    table.text('config', 'longtext').notNullable();
    table.primary(['suspension_id', 'trigger_id']);
    table.index(['type', 'topic']);
  });
};

exports.down = async function down(knex) {
  const waiting = await knex('tasks').where('status', 'waiting').first();
  if (waiting) {
    throw new Error(
      'Resume or cancel waiting tasks before removing suspension storage',
    );
  }
  await knex.schema.dropTable('task_suspension_triggers');
  await knex.schema.dropTable('task_suspensions');
};
