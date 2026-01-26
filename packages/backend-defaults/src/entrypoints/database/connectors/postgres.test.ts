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
  computePgPluginConfig,
  createPgDatabaseClient,
  getPgConnectionConfig,
  parsePgConnectionString,
} from './postgres';
import { type Knex } from 'knex';

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

describe('computePgPluginConfig', () => {
  const prefix = 'backstage_plugin_';

  describe('client', () => {
    it('uses base client when no plugin client specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.client).toBe('pg');
      expect(result.clientOverridden).toBe(false);
    });

    it('uses plugin client when specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        plugin: {
          catalog: {
            client: 'better-sqlite3',
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.client).toBe('better-sqlite3');
      expect(result.clientOverridden).toBe(true);
    });
  });

  describe('role', () => {
    it('returns undefined when no role specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.role).toBeUndefined();
    });

    it('uses base role when no plugin role specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        role: 'base_role',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.role).toBe('base_role');
    });

    it('uses plugin role when specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        role: 'base_role',
        plugin: {
          catalog: {
            role: 'plugin_role',
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.role).toBe('plugin_role');
    });
  });

  describe('additionalKnexConfig', () => {
    it('returns empty object when no knexConfig specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.additionalKnexConfig).toEqual({});
    });

    it('uses base knexConfig when no plugin config', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        knexConfig: { debug: true },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.additionalKnexConfig).toEqual({ debug: true });
    });

    it('merges base and plugin knexConfig', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        knexConfig: { debug: true, pool: { min: 0 } },
        plugin: {
          catalog: {
            knexConfig: { pool: { max: 10 } },
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.additionalKnexConfig).toEqual({
        debug: true,
        pool: { min: 0, max: 10 },
      });
    });
  });

  describe('ensureExists', () => {
    it('defaults to true when not specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.ensureExists).toBe(true);
    });

    it('uses base ensureExists when no plugin setting', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        ensureExists: false,
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.ensureExists).toBe(false);
    });

    it('uses plugin ensureExists when specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        ensureExists: true,
        plugin: {
          catalog: {
            ensureExists: false,
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.ensureExists).toBe(false);
    });
  });

  describe('ensureSchemaExists', () => {
    it('defaults to false when not specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.ensureSchemaExists).toBe(false);
    });

    it('uses base ensureSchemaExists when no plugin setting', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        ensureSchemaExists: true,
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.ensureSchemaExists).toBe(true);
    });
  });

  describe('pluginDivisionMode', () => {
    it('defaults to database when not specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.pluginDivisionMode).toBe('database');
    });

    it('uses specified pluginDivisionMode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        pluginDivisionMode: 'schema',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.pluginDivisionMode).toBe('schema');
    });
  });

  describe('connection', () => {
    it('sets application_name to plugin id', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection).toMatchObject({
        application_name: 'backstage_plugin_catalog',
      });
    });

    it('preserves existing application_name', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', application_name: 'custom_name' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection).toMatchObject({
        application_name: 'custom_name',
      });
    });

    it('omits database from base connection when pluginDivisionMode is database', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', database: 'shared_db' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection.database).toBeUndefined();
    });

    it('keeps database from base connection when pluginDivisionMode is schema', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', database: 'shared_db' },
        pluginDivisionMode: 'schema',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection.database).toBe('shared_db');
    });

    it('merges plugin connection with base connection', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', user: 'base_user' },
        plugin: {
          catalog: {
            connection: { password: 'plugin_pass' },
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection).toMatchObject({
        host: 'localhost',
        user: 'base_user',
        password: 'plugin_pass',
      });
    });

    it('excludes base connection when client is overridden', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', user: 'base_user' },
        plugin: {
          catalog: {
            client: 'better-sqlite3',
            connection: { filename: ':memory:' },
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection.host).toBeUndefined();
      expect(result.connection.user).toBeUndefined();
      expect(
        (result.connection as Knex.BetterSqlite3ConnectionConfig).filename,
      ).toBe(':memory:');
    });

    it('parses connection string in base config', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: 'postgresql://user:pass@localhost:5432/mydb',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection).toMatchObject({
        host: 'localhost',
        user: 'user',
        password: 'pass',
        port: '5432',
      });
    });

    it('parses connection string in plugin config', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'base-host' },
        plugin: {
          catalog: {
            connection: 'postgresql://plugin:pass@plugin-host:5432/plugindb',
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.connection).toMatchObject({
        host: 'plugin-host',
        user: 'plugin',
        password: 'pass',
        port: '5432',
      });
    });
  });

  describe('databaseName', () => {
    it('auto-generates database name with prefix in database mode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseName).toBe('backstage_plugin_catalog');
    });

    it('uses connection database when specified in database mode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        plugin: {
          catalog: {
            connection: { database: 'custom_db' },
          },
        },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseName).toBe('custom_db');
    });

    it('uses connection database in schema mode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', database: 'shared_db' },
        pluginDivisionMode: 'schema',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseName).toBe('shared_db');
    });

    it('returns undefined when no database in schema mode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        pluginDivisionMode: 'schema',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseName).toBeUndefined();
    });
  });

  describe('databaseClientOverrides', () => {
    it('sets connection.database when databaseName exists', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseClientOverrides).toEqual({
        connection: { database: 'backstage_plugin_catalog' },
      });
    });

    it('adds searchPath when in schema mode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost', database: 'shared_db' },
        pluginDivisionMode: 'schema',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseClientOverrides).toEqual({
        connection: { database: 'shared_db' },
        searchPath: ['catalog'],
      });
    });

    it('returns empty object when no databaseName in schema mode', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        pluginDivisionMode: 'schema',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.databaseClientOverrides).toEqual({
        searchPath: ['catalog'],
      });
    });
  });

  describe('knexConfig', () => {
    it('includes client and connection', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.knexConfig.client).toBe('pg');
      expect(result.knexConfig.connection).toBeDefined();
    });

    it('includes role when specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        role: 'my_role',
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect((result.knexConfig as any).role).toBe('my_role');
    });

    it('does not include role when not specified', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect((result.knexConfig as any).role).toBeUndefined();
    });

    it('includes additionalKnexConfig properties', () => {
      const config = new ConfigReader({
        client: 'pg',
        connection: { host: 'localhost' },
        knexConfig: { debug: true, pool: { min: 2 } },
      });

      const result = computePgPluginConfig(config, 'catalog', prefix);

      expect(result.knexConfig.debug).toBe(true);
      expect(result.knexConfig.pool).toEqual({ min: 2 });
    });
  });
});
