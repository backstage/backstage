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

import { TestDatabases } from '../index';
import { isDockerDisabledForTests } from '../util/isDockerDisabledForTests';

jest.mock('better-sqlite3', () => {
  throw new Error("Cannot find module 'better-sqlite3'");
});

jest.setTimeout(120_000);

const postgres = TestDatabases.create({ ids: ['POSTGRES_17'] });
const sqlite = TestDatabases.create({ ids: ['SQLITE_3'] });
const itIfDocker = isDockerDisabledForTests() ? it.skip : it;

describe('TestDatabases without better-sqlite3', () => {
  itIfDocker('imports and uses PostgreSQL without loading SQLite', async () => {
    // eslint-disable-next-line jest/no-standalone-expect
    expect(postgres.eachSupportedId()).toEqual([['POSTGRES_17']]);
    const db = await postgres.init('POSTGRES_17');
    await db.schema.createTable('example', table => table.string('value'));
    await db('example').insert({ value: 'hello' });
    // eslint-disable-next-line jest/no-standalone-expect
    await expect(db('example')).resolves.toEqual([{ value: 'hello' }]);
  });

  it('explains how to install the driver when SQLite is initialized', async () => {
    const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    try {
      expect(sqlite.eachSupportedId()).toEqual([['SQLITE_3']]);
      await expect(sqlite.init('SQLITE_3')).rejects.toThrow(
        'npm install better-sqlite3 --save',
      );
    } finally {
      consoleLog.mockRestore();
    }
  });
});
