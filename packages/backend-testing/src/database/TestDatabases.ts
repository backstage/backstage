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

import { SingleConnectionDatabaseManager } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { Knex } from 'knex';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { v4 as uuid } from 'uuid';

type TestDatabaseProperties = {
  name: string;
  driver: string;
  dockerImageName?: string;
  connectionStringEnvironmentVariableName?: string;
};

type Instance = {
  container?: StartedTestContainer;
  databaseManager: SingleConnectionDatabaseManager;
  connections: Array<Knex>;
};

const supportedDatabases = Object.freeze({
  POSTGRES_13: {
    name: 'Postgres 13.x',
    driver: 'pg',
    dockerImageName: 'postgres:13',
    connectionStringEnvironmentVariableName:
      'BACKSTAGE_TEST_DATABASE_POSTGRES13_CONNECTION_STRING',
  },
  POSTGRES_9: {
    name: 'Postgres 9.x',
    driver: 'pg',
    dockerImageName: 'postgres:9',
    connectionStringEnvironmentVariableName:
      'BACKSTAGE_TEST_DATABASE_POSTGRES9_CONNECTION_STRING',
  },
  MYSQL_8: {
    name: 'MySQL 8.x',
    driver: 'mysql2',
    dockerImageName: 'mysql:8',
    connectionStringEnvironmentVariableName:
      'BACKSTAGE_TEST_DATABASE_MYSQL8_CONNECTION_STRING',
  },
  SQLITE_3: {
    name: 'SQLite 3.x',
    driver: 'sqlite3',
  },
} as const);

/**
 * The possible databases to test against.
 */
export type TestDatabaseId =
  | 'POSTGRES_13'
  | 'POSTGRES_9'
  | 'MYSQL_8'
  | 'SQLITE_3';

/**
 * Encapsulates the creation of ephemeral test database instances for use
 * inside unit or integration tests.
 */
export class TestDatabases {
  private instanceById: Map<string, Instance> = new Map();
  private lastDatabaseId = 0;

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
  static create() {
    const databases = new TestDatabases();

    afterAll(async () => {
      await databases.shutdown();
    });

    return databases;
  }

  private constructor() {}

  /**
   * Returns a fresh, unique, empty logical database on an instance of the
   * given database ID platform.
   *
   * @param id The ID of the database platform to use, e.g. 'POSTGRES_13'
   * @returns A `Knex` connection object
   */
  async init(id: TestDatabaseId): Promise<Knex> {
    const properties = supportedDatabases[id];
    if (!properties) {
      const candidates = Object.keys(supportedDatabases).join(', ');
      throw new Error(
        `Unsupported test database ${id}, possible values are ${candidates}`,
      );
    }

    let instance: Instance | undefined = this.instanceById.get(id);

    // Ensure that a testcontainers instance is up for this ID
    if (!instance) {
      instance = await this.initAny(properties);
      this.instanceById.set(id, instance);
    }

    // Ensure that a unique logical database is created in the instance
    const connection = await instance.databaseManager
      .forPlugin(String(this.lastDatabaseId++))
      .getClient();

    instance.connections.push(connection);

    return connection;
  }

  private async initAny(properties: TestDatabaseProperties): Promise<Instance> {
    // Use the connection string if provided
    if (properties.driver === 'pg' || properties.driver === 'mysql2') {
      const envVarName = properties.connectionStringEnvironmentVariableName;
      if (envVarName) {
        const connectionString = process.env[envVarName];
        if (connectionString) {
          const databaseManager = SingleConnectionDatabaseManager.fromConfig(
            new ConfigReader({
              backend: {
                database: {
                  client: properties.driver,
                  connection: connectionString,
                },
              },
            }),
          );
          return {
            databaseManager,
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
      case 'sqlite3':
        return this.initSqlite(properties);
      default:
        throw new Error(`Unknown database driver ${properties.driver}`);
    }
  }

  private async initPostgres(
    properties: TestDatabaseProperties,
  ): Promise<Instance> {
    const password = uuid();

    const container = await new GenericContainer(properties.dockerImageName!)
      .withExposedPorts(5432)
      .withEnv('POSTGRES_PASSWORD', password)
      .withTmpFs({ '/var/lib/postgresql/data': 'rw' })
      .start();

    const databaseManager = SingleConnectionDatabaseManager.fromConfig(
      new ConfigReader({
        backend: {
          database: {
            client: 'pg',
            connection: {
              host: container.getHost(),
              port: container.getMappedPort(5432),
              user: 'postgres',
              password,
            },
          },
        },
      }),
    );

    return {
      container,
      databaseManager,
      connections: [],
    };
  }

  private async initMysql(
    properties: TestDatabaseProperties,
  ): Promise<Instance> {
    const password = uuid();

    const container = await new GenericContainer(properties.dockerImageName!)
      .withExposedPorts(3306)
      .withEnv('MYSQL_ROOT_PASSWORD', password)
      .withTmpFs({ '/var/lib/mysql': 'rw' })
      .start();

    const databaseManager = SingleConnectionDatabaseManager.fromConfig(
      new ConfigReader({
        backend: {
          database: {
            client: 'mysql2',
            connection: {
              host: container.getHost(),
              port: container.getMappedPort(3306),
              user: 'root',
              password,
            },
          },
        },
      }),
    );

    return {
      container,
      databaseManager,
      connections: [],
    };
  }

  private async initSqlite(
    _properties: TestDatabaseProperties,
  ): Promise<Instance> {
    const databaseManager = SingleConnectionDatabaseManager.fromConfig(
      new ConfigReader({
        backend: {
          database: {
            client: 'sqlite3',
            connection: ':memory:',
          },
        },
      }),
    );

    return {
      databaseManager,
      connections: [],
    };
  }

  private async shutdown() {
    for (const { container, connections } of this.instanceById.values()) {
      try {
        await Promise.all(connections.map(c => c.destroy()));
      } catch {
        // ignore
      }
      try {
        await container?.stop({ timeout: 10_000 });
      } catch {
        // ignore
      }
    }
  }
}
