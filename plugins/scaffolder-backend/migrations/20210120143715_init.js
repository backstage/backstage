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
 * @param {import('knex')} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('tasks', table => {
    table.comment('The table of scaffolder tasks');
    table.uuid('id').primary().notNullable().comment('The ID of the task');
    table
      .text('context')
      .notNullable()
      .comment('A JSON object with task specific context information');
    table
      .text('spec')
      .notNullable()
      .comment('A JSON encoded task specification');
    table
      .text('status')
      .notNullable()
      .comment('The current status of the task');
    table
      .integer('run_id')
      .nullable()
      .comment('The current run ID of the task');
    table
      .dateTime('created_at')
      .notNullable()
      .comment('The timestamp when this task was created');
    table
      .dateTime('last_heartbeat_at')
      .nullable()
      .comment('The last timestamp when a heartbeat was received');
    table
      .integer('retry_count')
      .notNullable()
      .defaultTo(0)
      .comment('The number of times that this task has been attempted');
  });
  await knex.schema.createTable('task_events', table => {
    table.comment('The event stream a given task');
    table
      .bigIncrements('id')
      .primary()
      .notNullable()
      .comment('The ID of the event');
    table
      .uuid('task_id')
      .references('id')
      .inTable('tasks')
      .notNullable()
      .onDelete('CASCADE')
      .comment('The task that generated the event');
    table
      .integer('run_id')
      .nullable()
      .comment('The run ID of the task that this event applies to');
    table
      .text('stage_name')
      .nullable()
      .comment('The stage of the task that this event applies to');
    table.text('event_type').notNullable().comment('The type of event');
    table
      .dateTime('created_at')
      .defaultTo(knex.fn.now())
      .notNullable()
      .comment('The timestamp when this event was generated');
    table.text('text').notNullable().comment('The text of the event');
    table.index(['task_id'], 'task_events_task_id_idx');
  });
};

/**
 * @param {import('knex')} knex
 */
exports.down = async function down(knex) {
  if (knex.client.config.client !== 'sqlite3') {
    await knex.schema.alterTable('task_events', table => {
      table.dropIndex([], 'task_events_task_id_idx');
    });
  }
  await knex.schema.dropTable('task_events');
  await knex.schema.dropTable('tasks');
};
