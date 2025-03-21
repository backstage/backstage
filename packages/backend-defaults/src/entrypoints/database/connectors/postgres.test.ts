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

import { Config, ConfigReader } from '@backstage/config';
import {
  buildPgDatabaseConfig,
  createPgDatabaseClient,
  getPgConnectionConfig,
  parsePgConnectionString,
} from './postgres';

jest.mock('@google-cloud/cloud-sql-connector');

describe('postgres', () => {
  const createMockConnection = () => ({
    host: 'acme',
    user: 'foo',
    password: 'bar',
    database: 'foodb',
  });

  const createMockConnectionString = () =>
    'postgresql://foo:bar@acme:5432/foodb';

  const createConfig = (connection: any): Config =>
    new ConfigReader({ client: 'pg', connection });

  describe('buildPgDatabaseConfig', () => {
    it('builds a postgres config', async () => {
      const mockConnection = createMockConnection();

      expect(await buildPgDatabaseConfig(createConfig(mockConnection))).toEqual(
        {
          client: 'pg',
          connection: mockConnection,
          useNullAsDefault: true,
        },
      );
    });

    it('builds a connection string config', async () => {
      const mockConnectionString = createMockConnectionString();

      expect(
        await buildPgDatabaseConfig(createConfig(mockConnectionString)),
      ).toEqual({
        client: 'pg',
        connection: mockConnectionString,
        useNullAsDefault: true,
      });
    });

    it('overrides the database name', async () => {
      const mockConnection = createMockConnection();

      expect(
        await buildPgDatabaseConfig(createConfig(mockConnection), {
          connection: { database: 'other_db' },
        }),
      ).toEqual({
        client: 'pg',
        connection: {
          ...mockConnection,
          database: 'other_db',
        },
        useNullAsDefault: true,
      });
    });

    it('overrides the schema name', async () => {
      const mockConnection = {
        ...createMockConnection(),
        schema: 'schemaName',
      };

      expect(
        await buildPgDatabaseConfig(createConfig(mockConnection), {
          searchPath: ['schemaName'],
        }),
      ).toEqual({
        client: 'pg',
        connection: mockConnection,
        searchPath: ['schemaName'],
        useNullAsDefault: true,
      });
    });

    it('adds additional config settings', async () => {
      const mockConnection = createMockConnection();

      expect(
        await buildPgDatabaseConfig(createConfig(mockConnection), {
          connection: { database: 'other_db' },
          pool: { min: 0, max: 7 },
          debug: true,
        }),
      ).toEqual({
        client: 'pg',
        connection: {
          ...mockConnection,
          database: 'other_db',
        },
        useNullAsDefault: true,
        pool: { min: 0, max: 7 },
        debug: true,
      });
    });

    it('overrides the database from connection string', async () => {
      const mockConnectionString = createMockConnectionString();
      const mockConnection = createMockConnection();

      expect(
        await buildPgDatabaseConfig(createConfig(mockConnectionString), {
          connection: { database: 'other_db' },
        }),
      ).toEqual({
        client: 'pg',
        connection: {
          ...mockConnection,
          port: '5432',
          database: 'other_db',
        },
        useNullAsDefault: true,
      });
    });

    it('uses the correct config when using cloudsql', async () => {
      expect(
        await buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'cloudsql',
              user: 'ben@gke.com',
              instance: 'project:region:instance',
              port: 5423,
            },
          }),
          { connection: { database: 'other_db' } },
        ),
      ).toEqual({
        client: 'pg',
        connection: {
          user: 'ben@gke.com',
          port: 5423,
          database: 'other_db',
        },
        useNullAsDefault: true,
      });
    });

    it('should throw with incorrect config', async () => {
      await expect(
        buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'cloudsql',
            },
          }),
        ),
      ).rejects.toThrow(/Missing instance connection name for Cloud SQL/);

      await expect(
        buildPgDatabaseConfig(
          new ConfigReader({
            client: 'not-pg',
            connection: {
              type: 'cloudsql',
              instance: 'asd:asd:asd',
            },
          }),
        ),
      ).rejects.toThrow(/Cloud SQL only supports the pg client/);
    });

    it('adds the settings from cloud-sql-connector', async () => {
      const { Connector } = jest.requireMock(
        '@google-cloud/cloud-sql-connector',
      ) as jest.Mocked<typeof import('@google-cloud/cloud-sql-connector')>;

      const mockStream = (): any => {};
      Connector.prototype.getOptions.mockResolvedValue({ stream: mockStream });

      expect(
        await buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'cloudsql',
              user: 'ben@gke.com',
              instance: 'project:region:instance',
              port: 5423,
            },
          }),
          { connection: { database: 'other_db' } },
        ),
      ).toEqual({
        client: 'pg',
        connection: {
          user: 'ben@gke.com',
          port: 5423,
          stream: mockStream,
          database: 'other_db',
        },
        useNullAsDefault: true,
      });
    });

    it('passes default settings to cloud-sql-connector', async () => {
      const { Connector } = jest.requireMock(
        '@google-cloud/cloud-sql-connector',
      ) as jest.Mocked<typeof import('@google-cloud/cloud-sql-connector')>;

      const mockStream = (): any => {};
      Connector.prototype.getOptions.mockResolvedValue({ stream: mockStream });

      await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'cloudsql',
            user: 'ben@gke.com',
            instance: 'project:region:instance',
            port: 5423,
          },
        }),
        { connection: { database: 'other_db' } },
      );

      expect(Connector.prototype.getOptions).toHaveBeenCalledWith({
        authType: 'IAM',
        instanceConnectionName: 'project:region:instance',
        ipType: 'PUBLIC',
      });
    });

    it('passes ip settings to cloud-sql-connector', async () => {
      const { Connector } = jest.requireMock(
        '@google-cloud/cloud-sql-connector',
      ) as jest.Mocked<typeof import('@google-cloud/cloud-sql-connector')>;

      const mockStream = (): any => {};
      Connector.prototype.getOptions.mockResolvedValue({ stream: mockStream });

      await buildPgDatabaseConfig(
        new ConfigReader({
          client: 'pg',
          connection: {
            type: 'cloudsql',
            user: 'ben@gke.com',
            instance: 'project:region:instance',
            ipAddressType: 'PRIVATE',
            port: 5423,
          },
        }),
        { connection: { database: 'other_db' } },
      );

      expect(Connector.prototype.getOptions).toHaveBeenCalledWith({
        authType: 'IAM',
        instanceConnectionName: 'project:region:instance',
        ipType: 'PRIVATE',
      });
    });

    it('throws an error when the connection type is not supported', async () => {
      await expect(
        buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'not-supported',
            },
          }),
        ),
      ).rejects.toThrow('Unknown connection type: not-supported');
    });

    it('supports default as the default connection type', async () => {
      await expect(
        buildPgDatabaseConfig(
          new ConfigReader({
            client: 'pg',
            connection: {
              type: 'default',
              port: '5432',
              database: 'other_db',
            },
          }),
        ),
      ).resolves.toEqual({
        client: 'pg',
        connection: {
          port: '5432',
          database: 'other_db',
        },
        useNullAsDefault: true,
      });
    });
  });

  describe('getPgConnectionConfig', () => {
    it('returns the connection object back', () => {
      const mockConnection = createMockConnection();
      const config = createConfig(mockConnection);

      expect(getPgConnectionConfig(config)).toEqual(mockConnection);
    });

    it('does not parse the connection string', () => {
      const mockConnection = createMockConnection();
      const config = createConfig(mockConnection);

      expect(getPgConnectionConfig(config, true)).toEqual(mockConnection);
    });

    it('automatically parses the connection string', () => {
      const mockConnection = createMockConnection();
      const mockConnectionString = createMockConnectionString();
      const config = createConfig(mockConnectionString);

      expect(getPgConnectionConfig(config)).toEqual({
        ...mockConnection,
        port: '5432',
      });
    });

    it('parses the connection string', () => {
      const mockConnection = createMockConnection();
      const mockConnectionString = createMockConnectionString();
      const config = createConfig(mockConnectionString);

      expect(getPgConnectionConfig(config, true)).toEqual({
        ...mockConnection,
        port: '5432',
      });
    });
  });

  describe('createPgDatabaseClient', () => {
    it('creates a postgres knex instance', async () => {
      expect(
        await createPgDatabaseClient(
          createConfig({
            host: 'acme',
            user: 'foo',
            password: 'bar',
            database: 'foodb',
          }),
        ),
      ).toBeTruthy();
    });

    it('attempts to read an ssl cert', async () => {
      await expect(() =>
        createPgDatabaseClient(
          createConfig(
            'postgresql://postgres:pass@localhost:5432/dbname?sslrootcert=/path/to/file',
          ),
        ),
      ).rejects.toThrow(/no such file or directory/);
    });
  });

  describe('parsePgConnectionString', () => {
    it('parses a connection string uri', () => {
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
