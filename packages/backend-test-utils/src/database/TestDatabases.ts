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

import { DatabaseManager, dropDatabase } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { randomBytes } from 'crypto';
import { Knex } from 'knex';
import { isDockerDisabledForTests } from '../util/isDockerDisabledForTests';
import { startMysqlContainer } from './startMysqlContainer';
import { startPostgresContainer } from './startPostgresContainer';
import {
  allDatabases,
  Instance,
  TestDatabaseId,
  TestDatabaseProperties,
} from './types';

const LARGER_POOL_CONFIG = {
  pool: {
    min: 0,
    max: 50,
  },
};

/**
 * Encapsulates the creation of ephemeral test database instances for use
 * inside unit or integration tests.
 *
 * @public
 */
export class TestDatabases {
  private readonly instanceById: Map<string, Instance>;
  private readonly supportedIds: TestDatabaseId[];
  private static defaultIds?: TestDatabaseId[];

  /**
   * Creates an empty `TestDatabases` instance, and sets up Jest to clean up
   * all of its acquired resources after all tests finish.
   *
   * You typically want to create just a single instance like this at the top
   * of your test file or `describe` block, and then call `init` many times on
   * that instance inside the individual tests. Spinning up a "physical"
   * database instance takes a considerable amount of time, slowing down tests.
   * But initializing a new logical database inside that instance using `init`
   * is very fast.
   */
  static create(options?: {
    ids?: TestDatabaseId[];
    disableDocker?: boolean;
  }): TestDatabases {
    const ids = options?.ids;
    const disableDocker = options?.disableDocker ?? isDockerDisabledForTests();

    let testDatabaseIds: TestDatabaseId[];
    if (ids) {
      testDatabaseIds = ids;
    } else if (TestDatabases.defaultIds) {
      testDatabaseIds = TestDatabases.defaultIds;
    } else {
      testDatabaseIds = Object.keys(allDatabases) as TestDatabaseId[];
    }

    const supportedIds = testDatabaseIds.filter(id => {
      const properties = allDatabases[id];
      if (!properties) {
        return false;
      }
      // If the caller has set up the env with an explicit connection string,
      // we'll assume that this database will work
      if (
        properties.connectionStringEnvironmentVariableName &&
        process.env[properties.connectionStringEnvironmentVariableName]
      ) {
        return true;
      }
      // If the database doesn't require docker at all, there's nothing to worry
      // about
      if (!properties.dockerImageName) {
        return true;
      }
      // If the database requires docker, but docker is disabled, we will fail.
      if (disableDocker) {
        return false;
      }
      return true;
    });

    const databases = new TestDatabases(supportedIds);

    if (supportedIds.length > 0) {
      afterAll(async () => {
        await databases.shutdown();
      });
    }

    return databases;
  }

  static setDefaults(options: { ids?: TestDatabaseId[] }) {
    TestDatabases.defaultIds = options.ids;
  }

  private constructor(supportedIds: TestDatabaseId[]) {
    this.instanceById = new Map();
    this.supportedIds = supportedIds;
  }

  supports(id: TestDatabaseId): boolean {
    return this.supportedIds.includes(id);
  }

  eachSupportedId(): [TestDatabaseId][] {
    return this.supportedIds.map(id => [id]);
  }

  /**
   * Returns a fresh, unique, empty logical database on an instance of the
   * given database ID platform.
   *
   * @param id - The ID of the database platform to use, e.g. 'POSTGRES_13'
   * @returns A `Knex` connection object
   */
  async init(id: TestDatabaseId): Promise<Knex> {
    const properties = allDatabases[id];
    if (!properties) {
      const candidates = Object.keys(allDatabases).join(', ');
      throw new Error(
        `Unknown test database ${id}, possible values are ${candidates}`,
      );
    }
    if (!this.supportedIds.includes(id)) {
      const candidates = this.supportedIds.join(', ');
      throw new Error(
        `Unsupported test database ${id} for this environment, possible values are ${candidates}`,
      );
    }

    let instance: Instance | undefined = this.instanceById.get(id);

    // Ensure that a testcontainers instance is up for this ID
    if (!instance) {
      instance = await this.initAny(properties);
      this.instanceById.set(id, instance);
    }

    // Ensure that a unique logical database is created in the instance
    const databaseName = `db${randomBytes(16).toString('hex')}`;
    const connection = await instance.databaseManager
      .forPlugin(databaseName)
      .getClient();

    instance.connections.push(connection);
    instance.databaseNames.push(databaseName);

    return connection;
  }

  private async initAny(properties: TestDatabaseProperties): Promise<Instance> {
    // Use the connection string if provided
    if (properties.driver === 'pg' || properties.driver === 'mysql2') {
      const envVarName = properties.connectionStringEnvironmentVariableName;
      if (envVarName) {
        const connectionString = process.env[envVarName];
        if (connectionString) {
          const config = new ConfigReader({
            backend: {
              database: {
                knexConfig: properties.driver.includes('sqlite')
                  ? {}
                  : LARGER_POOL_CONFIG,
                client: properties.driver,
                connection: connectionString,
              },
            },
          });
          const databaseManager = DatabaseManager.fromConfig(config);
          const databaseNames: Array<string> = [];
          return {
            dropDatabases: async () => {
              await dropDatabase(
                config.getConfig('backend.database'),
                ...databaseNames.map(
                  databaseName => `backstage_plugin_${databaseName}`,
                ),
              );
            },
            databaseManager,
            databaseNames,
            connections: [],
          };
        }
      }
    }

    // Otherwise start a container for the purpose
    switch (properties.driver) {
      case 'pg':
        return this.initPostgres(properties);
      case 'mysql2':
        return this.initMysql(properties);
      case 'better-sqlite3':
      case 'sqlite3':
        return this.initSqlite(properties);
      default:
        throw new Error(`Unknown database driver ${properties.driver}`);
    }
  }

  private async initPostgres(
    properties: TestDatabaseProperties,
  ): Promise<Instance> {
    const { host, port, user, password, stop } = await startPostgresContainer(
      properties.dockerImageName!,
    );

    const databaseManager = DatabaseManager.fromConfig(
      new ConfigReader({
        backend: {
          database: {
            knexConfig: LARGER_POOL_CONFIG,
            client: 'pg',
            connection: { host, port, user, password },
          },
        },
      }),
    );
    return {
      stopContainer: stop,
      databaseManager,
      databaseNames: [],
      connections: [],
    };
  }

  private async initMysql(
    properties: TestDatabaseProperties,
  ): Promise<Instance> {
    const { host, port, user, password, stop } = await startMysqlContainer(
      properties.dockerImageName!,
    );

    const databaseManager = DatabaseManager.fromConfig(
      new ConfigReader({
        backend: {
          database: {
            knexConfig: LARGER_POOL_CONFIG,
            client: 'mysql2',
            connection: { host, port, user, password },
          },
        },
      }),
    );

    return {
      stopContainer: stop,
      databaseManager,
      databaseNames: [],
      connections: [],
    };
  }

  private async initSqlite(
    properties: TestDatabaseProperties,
  ): Promise<Instance> {
    const databaseManager = DatabaseManager.fromConfig(
      new ConfigReader({
        backend: {
          database: {
            client: properties.driver,
            connection: ':memory:',
          },
        },
      }),
    );
    return {
      databaseManager,
      databaseNames: [],
      connections: [],
    };
  }

  private async shutdown() {
    const instances = [...this.instanceById.values()];
    this.instanceById.clear();

    for (const {
      stopContainer,
      dropDatabases,
      connections,
      databaseManager,
    } of instances) {
      for (const connection of connections) {
        try {
          await connection.destroy();
        } catch (error) {
          console.warn(`TestDatabases: Failed to destroy connection`, {
            connection,
            error,
          });
        }
      }

      // If the database is not running in docker then drop the databases
      try {
        await dropDatabases?.();
      } catch (error) {
        console.warn(`TestDatabases: Failed to drop databases`, {
          error,
        });
      }

      try {
        await stopContainer?.();
      } catch (error) {
        console.warn(`TestDatabases: Failed to stop container`, {
          databaseManager,
          error,
        });
      }
    }
  }
}
