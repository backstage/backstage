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

const BATCH_SIZE = 500;

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('tasks', table => {
    table
      .string('template_ref', 255)
      .nullable()
      .comment('The entityRef of the template that the task was created from');
  });

  // Backfill existing tasks from the serialized spec, in batches by id
  let lastId;
  for (;;) {
    const query = knex('tasks')
      .select('id', 'spec')
      .orderBy('id', 'asc')
      .limit(BATCH_SIZE);
    if (lastId !== undefined) {
      query.where('id', '>', lastId);
    }
    const rows = await query;

    if (rows.length === 0) {
      break;
    }
    lastId = rows[rows.length - 1].id;

    for (const row of rows) {
      let templateRef;
      try {
        templateRef = JSON.parse(row.spec)?.templateInfo?.entityRef;
      } catch {
        continue;
      }
      if (typeof templateRef === 'string') {
        await knex('tasks')
          .where('id', row.id)
          .update({ template_ref: templateRef });
      }
    }
  }

  await knex.schema.alterTable('tasks', table => {
    table.index(['template_ref'], 'tasks_template_ref_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('tasks', table => {
    table.dropIndex([], 'tasks_template_ref_idx');
  });
  await knex.schema.alterTable('tasks', table => {
    table.dropColumn('template_ref');
  });
};
