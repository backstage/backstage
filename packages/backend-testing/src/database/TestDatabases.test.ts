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

import knexFactory from 'knex';
import { GenericContainer } from 'testcontainers';
import { TestDatabases } from './TestDatabases';

describe('TestDatabases', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });
  afterAll(() => {
    process.env = OLD_ENV;
  });

  it.each([
    ['POSTGRES_13'],
    ['POSTGRES_9'],
    ['MYSQL_8'],
    ['SQLITE_3'],
  ] as const)(
    'creates distinct %p databases',
    async databaseId => {
      const dbs = TestDatabases.create();
      const db1 = await dbs.init(databaseId);
      const db2 = await dbs.init(databaseId);
      await db1.schema.createTable('a', table => table.string('x').primary());
      await db2.schema.createTable('a', table => table.string('y').primary());
      await expect(db1.select({ a: db1.raw('1') })).resolves.toEqual([
        { a: 1 },
      ]);
    },
    60_000,
  );

  it('obeys a provided connection string for postgres 13', async () => {
    const dbs = TestDatabases.create();
    const container = await new GenericContainer('postgres:13')
      .withExposedPorts(5432)
      .withEnv('POSTGRES_USER', 'user')
      .withEnv('POSTGRES_PASSWORD', 'pass')
      .withTmpFs({ '/var/lib/postgresql/data': 'rw' })
      .start();
    const host = container.getHost();
    const port = container.getMappedPort(5432);

    try {
      // Leave a mark
      process.env.BACKSTAGE_TEST_DATABASE_POSTGRES13_CONNECTION_STRING = `postgresql://user:pass@${host}:${port}`;
      const input = await dbs.init('POSTGRES_13');
      await input.schema.createTable('a', table => table.string('x').primary());
      await input.insert({ x: 'y' }).into('a');

      // Look for the mark
      const output = knexFactory({
        client: 'pg',
        connection: {
          host,
          port,
          user: 'user',
          password: 'pass',
          database: 'backstage_plugin_0',
        },
      });
      await expect(output.select('x').from('a')).resolves.toEqual([{ x: 'y' }]);
    } finally {
      await container.stop({ timeout: 10_000 });
    }
  }, 60_000);

  it('obeys a provided connection string for postgres 9', async () => {
    const dbs = TestDatabases.create();
    const container = await new GenericContainer('postgres:9')
      .withExposedPorts(5432)
      .withEnv('POSTGRES_USER', 'user')
      .withEnv('POSTGRES_PASSWORD', 'pass')
      .withTmpFs({ '/var/lib/postgresql/data': 'rw' })
      .start();
    const host = container.getHost();
    const port = container.getMappedPort(5432);

    try {
      // Leave a mark
      process.env.BACKSTAGE_TEST_DATABASE_POSTGRES9_CONNECTION_STRING = `postgresql://user:pass@${host}:${port}`;
      const input = await dbs.init('POSTGRES_9');
      await input.schema.createTable('a', table => table.string('x').primary());
      await input.insert({ x: 'y' }).into('a');

      // Look for the mark
      const output = knexFactory({
        client: 'pg',
        connection: {
          host,
          port,
          user: 'user',
          password: 'pass',
          database: 'backstage_plugin_0',
        },
      });
      await expect(output.select('x').from('a')).resolves.toEqual([{ x: 'y' }]);
    } finally {
      await container.stop({ timeout: 10_000 });
    }
  }, 60_000);

  it('obeys a provided connection string for mysql 8', async () => {
    const dbs = TestDatabases.create();
    const container = await new GenericContainer('mysql:8')
      .withExposedPorts(3306)
      .withEnv('MYSQL_ROOT_PASSWORD', 'pass')
      .withTmpFs({ '/var/lib/mysql': 'rw' })
      .start();
    const host = container.getHost();
    const port = container.getMappedPort(3306);

    try {
      // Leave a mark
      process.env.BACKSTAGE_TEST_DATABASE_MYSQL8_CONNECTION_STRING = `mysql://root:pass@${host}:${port}/ignored`;
      const input = await dbs.init('MYSQL_8');
      await input.schema.createTable('a', table => table.string('x').primary());
      await input.insert({ x: 'y' }).into('a');

      // Look for the mark
      const output = knexFactory({
        client: 'mysql2',
        connection: {
          host,
          port,
          user: 'root',
          password: 'pass',
          database: 'backstage_plugin_0',
        },
      });
      await expect(output.select('x').from('a')).resolves.toEqual([{ x: 'y' }]);
    } finally {
      await container.stop({ timeout: 10_000 });
    }
  }, 60_000);
});
