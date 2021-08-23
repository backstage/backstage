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
  // locking
  //
  await knex.schema.createTable(
    'backstage_backend_common__task_locks',
    table => {
      table.comment('Locks used for mutual exclusion among multiple workers');
      table
        .text('id')
        .primary()
        .notNullable()
        .comment('The unique id of this particular lock');
      table
        .text('acquired_ticket')
        .nullable()
        .comment('A unique ticket for the current lock acquiral, if any');
      table
        .dateTime('acquired_at')
        .nullable()
        .comment('The time when the lock was acquired, if locked');
      table
        .dateTime('expires_at')
        .nullable()
        .comment('The time when an acquired lock will time out and expire');
      table.index('id', 'task_locks_id_idx');
    },
  );
  //
  // tasks
  //
  await knex.schema.createTable('backstage_backend_common__tasks', table => {
    table.comment('Tasks used for scheduling work on multiple workers');
    table
      .text('id')
      .primary()
      .notNullable()
      .comment('The unique id of this particular task');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('task_locks', table => {
    table.dropIndex([], 'task_locks_id_idx');
  });
  await knex.schema.dropTable('task_locks');
};
