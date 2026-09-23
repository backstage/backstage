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

// @ts-check

/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('scaffolder_task_workspaces', table => {
    table
      .string('task_id')
      .primary()
      .notNullable()
      .comment('The task this workspace belongs to');
    const workspace = knex.client.config.client.includes('mysql')
      ? table.specificType('workspace', 'LONGBLOB')
      : table.binary('workspace');
    workspace
      .notNullable()
      .comment('Serialized workspace contents (tar archive)');
    table
      .timestamp('created_at', { useTz: true })
      .notNullable()
      .defaultTo(knex.fn.now())
      .comment('When the workspace was serialized');
  });

  if (await knex.schema.hasColumn('tasks', 'workspace')) {
    let lastTaskId;
    for (;;) {
      const query = knex('tasks')
        .select('id', 'workspace')
        .whereNotNull('workspace')
        .orderBy('id')
        .limit(100);
      if (lastTaskId) {
        query.andWhere('id', '>', lastTaskId);
      }
      const legacyWorkspaces = await query;
      if (legacyWorkspaces.length === 0) {
        break;
      }
      await knex('scaffolder_task_workspaces').insert(
        legacyWorkspaces.map(({ id, workspace }) => ({
          task_id: id,
          workspace,
        })),
      );
      lastTaskId = legacyWorkspaces[legacyWorkspaces.length - 1].id;
    }
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  if (await knex.schema.hasColumn('tasks', 'workspace')) {
    let lastTaskId;
    for (;;) {
      const query = knex('scaffolder_task_workspaces')
        .select('task_id', 'workspace')
        .orderBy('task_id')
        .limit(100);
      if (lastTaskId) {
        query.andWhere('task_id', '>', lastTaskId);
      }
      const workspaces = await query;
      if (workspaces.length === 0) {
        break;
      }
      for (const { task_id: taskId, workspace } of workspaces) {
        await knex('tasks')
          .where({ id: taskId })
          .whereNull('workspace')
          .update({ workspace });
      }
      lastTaskId = workspaces[workspaces.length - 1].task_id;
    }
  }
  await knex.schema.dropTable('scaffolder_task_workspaces');
};
