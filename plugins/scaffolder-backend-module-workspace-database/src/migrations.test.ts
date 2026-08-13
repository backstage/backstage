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

import { Knex } from 'knex';

const migration = jest.requireActual<{
  up(knex: Knex): Promise<void>;
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
