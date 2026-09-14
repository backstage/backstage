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

jest.mock('knex', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import knexFactory, { Knex } from 'knex';
import { MysqlEngine } from './mysql';
import { PostgresEngine } from './postgres';
import { allDatabases, Engine } from './types';

const mockKnexFactory = knexFactory as jest.MockedFunction<typeof knexFactory>;

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

describe.each([
  {
    name: 'PostgresEngine',
    adminDatabase: 'postgres',
    create: () =>
      new PostgresEngine(allDatabases.POSTGRES_18, {
        database: undefined,
      }),
  },
  {
    name: 'MysqlEngine',
    adminDatabase: null,
    create: () =>
      new MysqlEngine(allDatabases.MYSQL_8, {
        database: undefined,
      }),
  },
])('$name shutdown', ({ adminDatabase, create }) => {
  beforeEach(() => {
    mockKnexFactory.mockReset();
  });

  it('drops databases with bounded concurrency', async () => {
    const dropResolvers: Array<() => void> = [];
    let dropCount = 0;
    let activeDropCount = 0;
    let maxActiveDropCount = 0;
    let blockDrops = true;

    const adminConnection = {
      raw: jest.fn(async (query: string) => {
        if (query === 'CREATE DATABASE ??') {
          return;
        }

        dropCount += 1;
        activeDropCount += 1;
        maxActiveDropCount = Math.max(maxActiveDropCount, activeDropCount);

        if (blockDrops) {
          await new Promise<void>(resolve => {
            dropResolvers.push(() => {
              activeDropCount -= 1;
              resolve();
            });
          });
        } else {
          activeDropCount -= 1;
        }
      }),
      destroy: jest.fn().mockResolvedValue(undefined),
    } as unknown as Knex;
    const databaseConnection = {
      destroy: jest.fn().mockResolvedValue(undefined),
    } as unknown as Knex;

    mockKnexFactory.mockImplementation(config => {
      const connection = (config as Knex.Config).connection as
        | Knex.PgConnectionConfig
        | Knex.MySqlConnectionConfig;
      return connection.database === adminDatabase
        ? adminConnection
        : databaseConnection;
    });

    const engine = create() as Engine;
    for (let i = 0; i < 6; i++) {
      await engine.createDatabaseInstance();
    }

    const shutdown = engine.shutdown();
    await flushPromises();

    try {
      expect(dropCount).toBe(5);
      expect(maxActiveDropCount).toBe(5);

      blockDrops = false;
      dropResolvers.shift()?.();
      await flushPromises();

      expect(dropCount).toBe(6);
    } finally {
      blockDrops = false;
      for (const resolve of dropResolvers) {
        resolve();
      }
      await shutdown;
    }
  });
});
