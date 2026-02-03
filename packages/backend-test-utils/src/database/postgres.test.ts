/*
 * Copyright 2021 The Backstage Authors
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

import knexFactory, { Knex } from 'knex';
import { isDockerDisabledForTests } from '../util/isDockerDisabledForTests';
import { startPostgresContainer, PostgresEngine } from './postgres';
import { Engine, TestDatabaseId, allDatabases } from './types';

const itIfDocker = isDockerDisabledForTests() ? it.skip : it;
const ourDatabaseIds = Object.entries(allDatabases)
  .filter(([, properties]) => properties.driver === 'pg')
  .map(([id]) => id as TestDatabaseId);

jest.setTimeout(60_000);

describe('startPostgresContainer', () => {
  itIfDocker(
    'successfully launches the container and can stop it without problems',
    async () => {
      const { connection, stopContainer } = await startPostgresContainer(
        'postgres:13',
      );
      const db = knexFactory({ client: 'pg', connection });
      try {
        const result = await db.select(db.raw('version()'));
        // eslint-disable-next-line jest/no-standalone-expect
        expect(result[0]?.version).toContain('PostgreSQL');
      } finally {
        await db.destroy();
        await stopContainer();
      }
    },
  );
});

describe('PostgresEngine', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  itIfDocker.each(ourDatabaseIds)(
    'uses given connection string, %p',
    async testDatabaseId => {
      const properties = allDatabases[testDatabaseId];
      const { connection } = await startPostgresContainer(
        properties.dockerImageName!,
      );

      const outerKnex = knexFactory({ client: properties.driver, connection });
      const databases = await outerKnex
        .from('pg_database')
        .then(rows => rows.length); // account for postgres, template0 etc

      let knex: Knex | undefined;
      let engine: Engine | undefined;
      try {
        process.env[
          properties.connectionStringEnvironmentVariableName!
        ] = `postgres://${connection.user}:${connection.password}@${connection.host}:${connection.port}`;
        engine = await PostgresEngine.create(properties);
        knex = await engine.createDatabaseInstance();

        // eslint-disable-next-line jest/no-standalone-expect
        await expect(outerKnex.from('pg_database')).resolves.toHaveLength(
          databases + 1,
        );
      } finally {
        await outerKnex.destroy();
        await knex?.destroy();
        await engine?.shutdown();
      }
    },
  );

  itIfDocker.each(ourDatabaseIds)(
    'creates docker containers, %p',
    async testDatabaseId => {
      const properties = allDatabases[testDatabaseId];
      delete process.env[properties.connectionStringEnvironmentVariableName!];
      const engine = await PostgresEngine.create(properties);

      try {
        const knex = await engine.createDatabaseInstance();
        // eslint-disable-next-line jest/no-standalone-expect
        await expect(knex.select(knex.raw('version()'))).resolves.toEqual([
          { version: expect.stringContaining('PostgreSQL') },
        ]);
      } finally {
        await engine.shutdown();
      }
    },
  );
});
