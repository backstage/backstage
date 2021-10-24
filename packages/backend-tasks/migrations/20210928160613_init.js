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
  //
  // mutexes
  //
  await knex.schema.createTable('backstage_backend_tasks__mutexes', table => {
    table.comment('Locks used for mutual exclusion among multiple workers');
    table
      .text('id')
      .primary()
      .notNullable()
      .comment('The unique ID of this particular mutex');
    table
      .text('current_lock_ticket')
      .notNullable()
      .comment('A unique ticket for the current mutex lock');
    table
      .dateTime('current_lock_acquired_at')
      .nullable()
      .comment('The time when the mutex was locked');
    table
      .dateTime('current_lock_expires_at')
      .nullable()
      .comment('The time when a locked mutex will time out and auto-release');
    table.index(['id'], 'backstage_backend_tasks__mutexes__id_idx');
  });
  //
  // tasks
  //
  await knex.schema.createTable('backstage_backend_tasks__tasks', table => {
    table.comment('Tasks used for scheduling work on multiple workers');
    table
      .text('id')
      .primary()
      .notNullable()
      .comment('The unique ID of this particular task');
    table
      .text('settings_json')
      .notNullable()
      .comment('JSON serialized object with properties for this task');
    table
      .dateTime('next_run_start_at')
      .nullable()
      .comment('The next time that the task should be started');
    table
      .text('current_run_ticket')
      .nullable()
      .comment('A unique ticket for the current task run');
    table
      .dateTime('current_run_started_at')
      .nullable()
      .comment('The time that the current task run started');
    table
      .dateTime('current_run_expires_at')
      .nullable()
      .comment('The time that the current task run will time out');
    table.index(['id'], 'backstage_backend_tasks__tasks__id_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  //
  // tasks
  //
  await knex.schema.alterTable('backstage_backend_tasks__tasks', table => {
    table.dropIndex([], 'backstage_backend_tasks__tasks__id_idx');
  });
  await knex.schema.dropTable('backstage_backend_tasks__tasks');
  //
  // locks
  //
  await knex.schema.alterTable('backstage_backend_tasks__task_locks', table => {
    table.dropIndex([], 'backstage_backend_tasks__task_locks__id_idx');
  });
  await knex.schema.dropTable('backstage_backend_tasks__task_locks');
};
