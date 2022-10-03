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
import { ConfigReader } from '@backstage/config';
import { omit } from 'lodash';
import path from 'path';
import {
  createDatabaseClient,
  ensureDatabaseExists,
  ensureSchemaExists,
} from './connection';
import { DatabaseManager } from './DatabaseManager';

jest.mock('./connection', () => ({
  ...jest.requireActual('./connection'),
  createDatabaseClient: jest.fn(),
  ensureDatabaseExists: jest.fn(),
  ensureSchemaExists: jest.fn(),
}));

describe('DatabaseManager', () => {
  // This is similar to the ts-jest `mocked` helper.
  const mocked = (f: Function) => f as jest.Mock;

  afterEach(() => jest.resetAllMocks());

  describe('DatabaseManager.fromConfig', () => {
    const backendConfig = {
      backend: {
        database: {
          client: 'pg',
          connection: {
            host: 'localhost',
            user: 'foo',
            password: 'bar',
            database: 'foodb',
          },
        },
      },
    };

    it('accesses the backend.database key', () => {
      const config = new ConfigReader(backendConfig);
      const getConfigSpy = jest.spyOn(config, 'getConfig');
      DatabaseManager.fromConfig(config);

      expect(getConfigSpy).toHaveBeenCalledWith('backend.database');
    });

    it('handles default options', () => {
      const config = new ConfigReader(backendConfig);
      const database = DatabaseManager.fromConfig(config);
      const client = database.forPlugin('test');

      expect(client.migrations?.skip).toBe(false);
    });

    it('handles migrations options', () => {
      const config = new ConfigReader(backendConfig);
      const database = DatabaseManager.fromConfig(config, {
        migrations: { skip: true },
      });
      const client = database.forPlugin('test');

      expect(client.migrations?.skip).toBe(true);
    });
  });

  describe('DatabaseManager.forPlugin', () => {
    const config = {
      backend: {
        database: {
          client: 'pg',
          prefix: 'test_prefix_',
          connection: {
            host: 'localhost',
            user: 'foo',
            password: 'bar',
            database: 'foodb',
          },
          plugin: {
            testdbname: {
              connection: {
                database: 'database_name_overridden',
              },
            },
            differentclient: {
              client: 'better-sqlite3',
              connection: {
                filename: 'plugin_with_different_client',
              },
            },
            differentclientconnstring: {
              client: 'better-sqlite3',
              connection: ':memory:',
            },
            stringoverride: {
              connection: 'postgresql://testuser:testpass@acme:5432/userdbname',
            },
          },
        },
      },
    };
    let manager: DatabaseManager;

    beforeEach(() => {
      manager = DatabaseManager.fromConfig(new ConfigReader(config));
    });

    it('connects to a plugin database using default config', async () => {
      const pluginId = 'pluginwithoutconfig';

      await manager.forPlugin(pluginId).getClient();
      expect(mocked(createDatabaseClient)).toHaveBeenCalledTimes(1);

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      // default config should be passed through to underlying connector
      expect(baseConfig.get()).toMatchObject({
        client: 'pg',
        connection: omit(config.backend.database.connection, ['database']),
      });

      // override using database name generated from pluginId and prefix
      expect(overrides).toMatchObject({
        connection: {
          database: `${config.backend.database.prefix}${pluginId}`,
        },
      });
    });

    it('provides a plugin db which uses components from top level connection string', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'pg',
              connection: 'postgresql://foo:bar@acme:5432/foodb',
            },
          },
        }),
      );

      await testManager.forPlugin('pluginwithoutconfig').getClient();
      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      // parsed connection string **without** db name should be passed through
      expect(baseConfig.get()).toMatchObject({
        connection: {
          host: 'acme',
          user: 'foo',
          password: 'bar',
          port: '5432',
        },
      });

      // we expect a pg database name override with ${prefix} followed by pluginId
      expect(overrides).toHaveProperty(
        'connection.database',
        expect.stringContaining('pluginwithoutconfig'),
      );
    });

    it('provides an inmemory sqlite database if top level is also inmemory and plugin config is not present', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'better-sqlite3',
              connection: ':memory:',
            },
          },
        }),
      );

      await testManager.forPlugin('pluginwithoutconfig').getClient();
      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [_, overrides] = mockCalls[0];

      expect(overrides).toHaveProperty(
        'connection.filename',
        expect.stringContaining(':memory:'),
      );
    });

    it('throws if top level sqlite filename is provided', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'better-sqlite3',
              connection: 'some-file-path',
            },
          },
        }),
      );

      await expect(
        testManager.forPlugin('pluginwithoutconfig').getClient(),
      ).rejects.toBeInstanceOf(Error);
    });

    it('creates plugin-specific sqlite files when plugin config is not present', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'better-sqlite3',
              connection: {
                directory: 'sqlite-files',
              },
            },
          },
        }),
      );

      await testManager.forPlugin('pluginwithoutconfig').getClient();
      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [_, overrides] = mockCalls[0];

      expect(overrides).toHaveProperty(
        'connection.filename',
        path.join('sqlite-files', 'pluginwithoutconfig.sqlite'),
      );
    });

    it('uses sqlite directory from top level config and filename from plugin config', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'better-sqlite3',
              connection: {
                directory: 'sqlite-files',
              },
              plugin: {
                test: {
                  connection: {
                    filename: 'other.sqlite',
                  },
                },
              },
            },
          },
        }),
      );

      await testManager.forPlugin('test').getClient();
      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [_, overrides] = mockCalls[0];

      expect(overrides).toHaveProperty(
        'connection.filename',
        path.join('sqlite-files', 'other.sqlite'),
      );
    });

    it('uses sqlite directory and filename from plugin config', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'better-sqlite3',
              connection: {
                directory: 'sqlite-files',
              },
              plugin: {
                test: {
                  connection: {
                    directory: 'custom-sqlite-files',
                    filename: 'other.sqlite',
                  },
                },
              },
            },
          },
        }),
      );

      await testManager.forPlugin('test').getClient();
      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [_, overrides] = mockCalls[0];

      expect(overrides).toHaveProperty(
        'connection.filename',
        path.join('custom-sqlite-files', 'other.sqlite'),
      );
    });

    it('connects to a plugin database using a specific database name', async () => {
      // testdbname.connection.database is set in config
      await manager.forPlugin('testdbname').getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [_baseConfig, overrides] = mockCalls[0];

      // simple case where only database name is overridden
      expect(overrides).toMatchObject({
        connection: {
          database: 'database_name_overridden',
        },
      });
    });

    it('ensure plugin specific database is created', async () => {
      const pluginId = 'testdbname';
      // testdbname.connection.database is set in config
      await manager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(ensureDatabaseExists).mock.calls.splice(-1);
      const [_, dbname] = mockCalls[0];

      expect(dbname).toEqual(
        config.backend.database.plugin[pluginId].connection.database,
      );
    });

    it('provides different plugins with their own databases', async () => {
      await manager.forPlugin('plugin1').getClient();
      await manager.forPlugin('plugin2').getClient();

      expect(mocked(createDatabaseClient)).toHaveBeenCalledTimes(2);

      const mockCalls = mocked(createDatabaseClient).mock.calls;
      const [plugin1CallArgs, plugin2CallArgs] = mockCalls;

      // database name overrides should be different
      expect(plugin1CallArgs[1].connection.database).not.toEqual(
        plugin2CallArgs[1].connection.database,
      );
    });

    it('returns the same client for the same pluginId', async () => {
      const [client1, client2] = await Promise.all([
        manager.forPlugin('plugin1').getClient(),
        manager.forPlugin('plugin1').getClient(),
      ]);
      expect(mocked(createDatabaseClient)).toHaveBeenCalledTimes(1);

      expect(client1).toBe(client2);
    });

    it('uses plugin connection as base if default client is different from plugin client', async () => {
      const pluginId = 'differentclient';
      await manager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, _overrides] = mockCalls[0];

      // plugin connection should be used as base config, client is different
      expect(baseConfig.get()).toMatchObject({
        client: 'better-sqlite3',
        connection: config.backend.database.plugin[pluginId].connection,
      });
    });

    it('provides database client specific base and override when client set under plugin', async () => {
      const pluginId = 'differentclient';
      await manager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      // plugin client should be better-sqlite3
      expect(baseConfig.get().client).toEqual('better-sqlite3');

      // SQLite uses 'filename' instead of 'database'
      expect(overrides).toHaveProperty(
        'connection.filename',
        'plugin_with_different_client',
      );
    });

    it('provides database client specific base from plugin connection string when client set under plugin', async () => {
      const pluginId = 'differentclientconnstring';
      await manager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      expect(baseConfig.get().client).toEqual('better-sqlite3');

      expect(overrides).toHaveProperty('connection.filename', ':memory:');
    });

    it('generates a database name override when prefix is not explicitly set', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'pg',
              connection: {
                host: 'localhost',
                user: 'foo',
                password: 'bar',
                database: 'foodb',
              },
            },
          },
        }),
      );

      await testManager.forPlugin('testplugin').getClient();
      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [_baseConfig, overrides] = mockCalls[0];

      expect(overrides).toHaveProperty(
        'connection.database',
        expect.stringContaining('backstage_plugin_'),
      );
    });

    it('uses values from plugin connection string if top level client should be used', async () => {
      const pluginId = 'stringoverride';
      await manager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      // plugin client should be pg
      expect(baseConfig.get().client).toEqual('pg');

      expect(overrides).toHaveProperty(
        'connection.database',
        expect.stringContaining('userdbname'),
      );
    });

    it('plugin sets schema override for pg client', async () => {
      const overrideConfig = {
        backend: {
          database: {
            client: 'pg',
            pluginDivisionMode: 'schema',
            connection: {
              host: 'localhost',
              user: 'foo',
              password: 'bar',
              database: 'foodb',
            },
          },
        },
      };
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader(overrideConfig),
      );
      const pluginId = 'schemaoverride';
      await testManager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      expect(baseConfig.get()).toMatchObject({
        client: 'pg',
        connection: config.backend.database.connection,
      });

      expect(overrides).toMatchObject({
        searchPath: [pluginId],
      });
    });

    it('plugin does not provide schema override for non pg client', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'better-sqlite3',
              pluginDivisionMode: 'schema',
              connection: {
                host: 'localhost',
                user: 'foo',
                password: 'bar',
                database: 'foodb',
              },
            },
          },
        }),
      );
      const pluginId = 'any-plugin';
      await testManager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      expect(baseConfig.get()).toMatchObject({
        client: 'better-sqlite3',
        connection: config.backend.database.connection,
      });

      expect(overrides).not.toHaveProperty('searchPath');
    });

    it('plugin does not provide schema override if pluginDivisionMode is set to database', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'pg',
              pluginDivisionMode: 'database',
              connection: 'some-file-path',
            },
          },
        }),
      );

      const pluginId = 'any-plugin';
      await testManager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [_baseConfig, overrides] = mockCalls[0];

      expect(overrides).not.toHaveProperty('searchPath');
    });

    it('plugin does not provide schema override if pluginDivisionMode is not set', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'pg',
              connection: {
                host: 'localhost',
                user: 'foo',
                password: 'bar',
                database: 'foodb',
              },
            },
          },
        }),
      );

      const pluginId = 'schemaoverride';
      await testManager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [_baseConfig, overrides] = mockCalls[0];

      expect(overrides).not.toHaveProperty('searchPath');
    });

    it('pluginDivisionMode ensures that each plugin schema exists', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'pg',
              pluginDivisionMode: 'schema',
              connection: {
                host: 'localhost',
                user: 'foo',
                password: 'bar',
                database: 'foodb',
              },
            },
          },
        }),
      );
      const pluginId = 'testdbname';
      await testManager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(ensureSchemaExists).mock.calls;
      const [_, schemaName] = mockCalls[0];

      expect(schemaName).toEqual('testdbname');
    });

    it('pluginDivisionMode allows connection overrides for plugins', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'pg',
              pluginDivisionMode: 'schema',
              connection: {
                host: 'localhost',
                user: 'foo',
                password: 'bar',
                database: 'foodb',
              },
              plugin: {
                testdbname: {
                  connection: {
                    database: 'database_name_overridden',
                    host: 'newhost',
                  },
                },
              },
            },
          },
        }),
      );
      const pluginId = 'testdbname';
      await testManager.forPlugin(pluginId).getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig, overrides] = mockCalls[0];

      expect(baseConfig.get()).toMatchObject({
        client: 'pg',
        connection: {
          database: 'database_name_overridden',
          host: 'newhost',
          user: 'foo',
          password: 'bar',
        },
      });
      expect(overrides).toHaveProperty('searchPath', ['testdbname']);
      expect(overrides).toHaveProperty(
        'connection.database',
        'database_name_overridden',
      );
    });

    it('ensureExists does not create database or schema when false', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'pg',
              pluginDivisionMode: 'schema',
              ensureExists: false,
              connection: {
                host: 'localhost',
                user: 'foo',
                password: 'bar',
                database: 'foodb',
              },
            },
          },
        }),
      );
      const pluginId = 'testdbname';
      await testManager.forPlugin(pluginId).getClient();

      expect(mocked(ensureDatabaseExists)).toHaveBeenCalledTimes(0);
      expect(mocked(ensureSchemaExists)).toHaveBeenCalledTimes(0);
    });

    it('fetches and merges additional knex config', async () => {
      const testManager = DatabaseManager.fromConfig(
        new ConfigReader({
          backend: {
            database: {
              client: 'pg',
              connection: {
                host: 'localhost',
                database: 'foodb',
              },
              knexConfig: {
                something: false,
              },
              plugin: {
                testdbname: {
                  knexConfig: {
                    debug: true,
                  },
                },
              },
            },
          },
        }),
      );
      await testManager.forPlugin('testdbname').getClient();

      const mockCalls = mocked(createDatabaseClient).mock.calls.splice(-1);
      const [baseConfig] = mockCalls[0];

      expect(baseConfig.data).toEqual(
        expect.objectContaining({
          debug: true,
          something: false,
        }),
      );
    });
  });
});
