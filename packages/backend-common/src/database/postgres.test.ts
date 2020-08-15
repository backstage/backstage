/*
 * Copyright 2020 Spotify AB
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

import { ConfigReader } from '@backstage/config';
import {
  parsePgConnectionString,
  buildPgDatabaseConfig,
  createPgDatabase,
} from './postgres';

describe('postgres', () => {
  const createConfig = (connection: any) =>
    ConfigReader.fromConfigs([
      {
        context: '',
        data: {
          client: 'pg',
          connection,
        },
      },
    ]);

  describe(buildPgDatabaseConfig, () => {
    it('builds a postgres config', () => {
      expect(
        buildPgDatabaseConfig(
          createConfig({
            host: 'acme',
            user: 'foo',
            password: 'bar',
            port: '5432',
            database: 'foodb',
          }),
        ),
      ).toEqual({
        client: 'pg',
        connection: {
          host: 'acme',
          user: 'foo',
          password: 'bar',
          port: '5432',
          database: 'foodb',
        },
        useNullAsDefault: true,
      });
    });

    it('builds a connection string config', () => {
      expect(
        buildPgDatabaseConfig(
          createConfig('postgresql://foo:bar@acme:5432/foodb'),
        ),
      ).toEqual({
        client: 'pg',
        connection: 'postgresql://foo:bar@acme:5432/foodb',
        useNullAsDefault: true,
      });
    });

    it('overrides the database name', () => {
      expect(
        buildPgDatabaseConfig(
          createConfig({
            host: 'somehost',
            user: 'postgres',
            password: 'pass',
            database: 'foo',
          }),
          { connection: { database: 'foodb' } },
        ),
      ).toEqual({
        client: 'pg',
        connection: {
          host: 'somehost',
          user: 'postgres',
          password: 'pass',
          database: 'foodb',
        },
        useNullAsDefault: true,
      });
    });

    it('adds additional config settings', () => {
      expect(
        buildPgDatabaseConfig(
          createConfig({
            host: 'somehost',
            user: 'postgres',
            password: 'pass',
            database: 'foo',
          }),
          {
            connection: { database: 'foodb' },
            pool: { min: 0, max: 7 },
            debug: true,
          },
        ),
      ).toEqual({
        client: 'pg',
        connection: {
          host: 'somehost',
          user: 'postgres',
          password: 'pass',
          database: 'foodb',
        },
        useNullAsDefault: true,
        pool: { min: 0, max: 7 },
        debug: true,
      });
    });

    it('overrides the database from connection string', () => {
      expect(
        buildPgDatabaseConfig(
          createConfig('postgresql://postgres:pass@localhost:5432/dbname'),
          { connection: { database: 'foodb' } },
        ),
      ).toEqual({
        client: 'pg',
        connection: {
          host: 'localhost',
          user: 'postgres',
          password: 'pass',
          port: '5432',
          database: 'foodb',
        },
        useNullAsDefault: true,
      });
    });
  });

  describe(createPgDatabase, () => {
    it('creates a postgres knex instance', () => {
      expect(
        createPgDatabase(
          createConfig({
            client: 'pg',
            connection: {
              host: 'acme',
              user: 'foo',
              password: 'bar',
              database: 'foodb',
            },
          }),
        ),
      ).toBeTruthy();
    });

    it('attempts to read an ssl cert', () => {
      expect(() =>
        createPgDatabase(
          createConfig(
            'postgresql://postgres:pass@localhost:5432/dbname?sslrootcert=/path/to/file',
          ),
        ),
      ).toThrowError(/no such file or directory/);
    });
  });

  describe(parsePgConnectionString, () => {
    it('parses a connection string uri ', () => {
      expect(
        parsePgConnectionString(
          'postgresql://postgres:pass@foobar:5432/dbname?ssl=true',
        ),
      ).toEqual({
        host: 'foobar',
        user: 'postgres',
        password: 'pass',
        port: '5432',
        database: 'dbname',
        ssl: true,
      });
    });
  });
});
