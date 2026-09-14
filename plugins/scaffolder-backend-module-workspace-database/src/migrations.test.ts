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

import createKnexClient, { Knex } from 'knex';

const migration = jest.requireActual<{
  up(knex: Knex): Promise<void>;
  down(knex: Knex): Promise<void>;
}>('../migrations/20250122000000_task_workspaces');

function createKnexMock(client: string) {
  const column = {
    primary: jest.fn().mockReturnThis(),
    notNullable: jest.fn().mockReturnThis(),
    comment: jest.fn().mockReturnThis(),
    defaultTo: jest.fn().mockReturnThis(),
  };
  const table = {
    string: jest.fn(() => column),
    binary: jest.fn(() => column),
    specificType: jest.fn(() => column),
    timestamp: jest.fn(() => column),
  };
  const knex = {
    client: { config: { client } },
    fn: { now: jest.fn() },
    schema: {
      hasColumn: jest.fn().mockResolvedValue(false),
      createTable: jest.fn(
        async (
          _name: string,
          callback: (tableBuilder: Knex.CreateTableBuilder) => void,
        ) => {
          callback(table as unknown as Knex.CreateTableBuilder);
        },
      ),
    },
  } as unknown as Knex;

  return { knex, table };
}

describe('task workspaces migration', () => {
  it('migrates legacy task workspace rows', async () => {
    const db = createKnexClient({
      client: 'better-sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });
    const workspace = Buffer.from('legacy workspace');

    try {
      await db.schema.createTable('tasks', table => {
        table.string('id').primary();
        table.binary('workspace').nullable();
      });
      await db('tasks').insert({ id: 'task-1', workspace });

      await migration.up(db);

      const migrated = await db('scaffolder_task_workspaces')
        .where({ task_id: 'task-1' })
        .first();
      expect(migrated.workspace).toEqual(workspace);

      const legacy = await db('tasks').where({ id: 'task-1' }).first();
      expect(legacy.workspace).toEqual(workspace);
    } finally {
      await db.destroy();
    }
  });

  it('restores current workspace rows to legacy storage on rollback', async () => {
    const db = createKnexClient({
      client: 'better-sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });
    const currentWorkspace = Buffer.from('current workspace');
    const lateLegacyWorkspace = Buffer.from('late legacy workspace');

    try {
      await db.schema.createTable('tasks', table => {
        table.string('id').primary();
        table.binary('workspace').nullable();
      });
      await db('tasks').insert([
        { id: 'task-1', workspace: null },
        { id: 'task-2', workspace: lateLegacyWorkspace },
      ]);
      await migration.up(db);
      await db('scaffolder_task_workspaces')
        .insert({
          task_id: 'task-1',
          workspace: currentWorkspace,
        })
        .onConflict('task_id')
        .merge(['workspace']);
      await db('scaffolder_task_workspaces')
        .where({ task_id: 'task-2' })
        .update({ workspace: Buffer.from('older copied workspace') });

      await migration.down(db);

      const legacy = await db('tasks').where({ id: 'task-1' }).first();
      expect(legacy.workspace).toEqual(currentWorkspace);
      const lateLegacy = await db('tasks').where({ id: 'task-2' }).first();
      expect(lateLegacy.workspace).toEqual(lateLegacyWorkspace);
      await expect(
        db.schema.hasTable('scaffolder_task_workspaces'),
      ).resolves.toBe(false);
    } finally {
      await db.destroy();
    }
  });

  it('uses LONGBLOB for MySQL workspace data', async () => {
    const { knex, table } = createKnexMock('mysql2');

    await migration.up(knex);

    expect(table.specificType).toHaveBeenCalledWith('workspace', 'LONGBLOB');
    expect(table.binary).not.toHaveBeenCalled();
  });

  it('uses the portable binary type for other databases', async () => {
    const { knex, table } = createKnexMock('better-sqlite3');

    await migration.up(knex);

    expect(table.binary).toHaveBeenCalledWith('workspace');
    expect(table.specificType).not.toHaveBeenCalled();
  });
});
