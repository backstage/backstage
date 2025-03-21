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

import { stringifyError } from '@backstage/errors';
import { randomBytes } from 'crypto';
import knexFactory, { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import yn from 'yn';
import { Engine, LARGER_POOL_CONFIG, TestDatabaseProperties } from './types';

async function waitForMysqlReady(
  connection: Knex.MySqlConnectionConfig,
): Promise<void> {
  const startTime = Date.now();

  let lastError: Error | undefined;
  let attempts = 0;
  for (;;) {
    attempts += 1;

    let knex: Knex | undefined;
    try {
      knex = knexFactory({
        client: 'mysql2',
        connection: {
          // make a copy because the driver mutates this
          ...connection,
        },
      });
      const result = await knex.select(knex.raw('version() AS version'));
      if (Array.isArray(result) && result[0]?.version) {
        return;
      }
    } catch (e) {
      lastError = e;
    } finally {
      await knex?.destroy();
    }

    if (Date.now() - startTime > 30_000) {
      throw new Error(
        `Timed out waiting for the database to be ready for connections, ${attempts} attempts, ${
          lastError
            ? `last error was ${stringifyError(lastError)}`
            : '(no errors thrown)'
        }`,
      );
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

export async function startMysqlContainer(image: string): Promise<{
  connection: Knex.MySqlConnectionConfig;
  stopContainer: () => Promise<void>;
}> {
  const user = 'root';
  const password = uuid();

  // Lazy-load to avoid side-effect of importing testcontainers
  const { GenericContainer } =
    require('testcontainers') as typeof import('testcontainers');

  const container = await new GenericContainer(image)
    .withExposedPorts(3306)
    .withEnvironment({ MYSQL_ROOT_PASSWORD: password })
    .withTmpFs({ '/var/lib/mysql': 'rw' })
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(3306);
  const connection = { host, port, user, password };
  const stopContainer = async () => {
    await container.stop({ timeout: 10_000 });
  };

  await waitForMysqlReady(connection);

  return { connection, stopContainer };
}

export function parseMysqlConnectionString(
  connectionString: string,
): Knex.MySqlConnectionConfig {
  try {
    const {
      protocol,
      username,
      password,
      port,
      hostname,
      pathname,
      searchParams,
    } = new URL(connectionString);

    if (protocol !== 'mysql:') {
      throw new Error(`Unknown protocol ${protocol}`);
    } else if (!username || !password) {
      throw new Error(`Missing username/password`);
    } else if (!pathname.match(/^\/[^/]+$/)) {
      throw new Error(`Expected single path segment`);
    }

    const result: Knex.MySqlConnectionConfig = {
      user: username,
      password,
      host: hostname,
      port: Number(port || 3306),
      database: decodeURIComponent(pathname.substring(1)),
    };

    const ssl = searchParams.get('ssl');
    if (ssl) {
      result.ssl = ssl;
    }

    const debug = searchParams.get('debug');
    if (debug) {
      result.debug = yn(debug);
    }

    return result;
  } catch (e) {
    throw new Error(`Error while parsing MySQL connection string, ${e}`, e);
  }
}

export class MysqlEngine implements Engine {
  static async create(
    properties: TestDatabaseProperties,
  ): Promise<MysqlEngine> {
    const { connectionStringEnvironmentVariableName, dockerImageName } =
      properties;

    if (connectionStringEnvironmentVariableName) {
      const connectionString =
        process.env[connectionStringEnvironmentVariableName];
      if (connectionString) {
        const connection = parseMysqlConnectionString(connectionString);
        return new MysqlEngine(
          properties,
          connection as Knex.MySqlConnectionConfig,
        );
      }
    }

    if (dockerImageName) {
      const { connection, stopContainer } = await startMysqlContainer(
        dockerImageName,
      );
      return new MysqlEngine(properties, connection, stopContainer);
    }

    throw new Error(`Test databasee for ${properties.name} not configured`);
  }

  readonly #properties: TestDatabaseProperties;
  readonly #connection: Knex.MySqlConnectionConfig;
  readonly #knexInstances: Knex[];
  readonly #databaseNames: string[];
  readonly #stopContainer?: () => Promise<void>;

  constructor(
    properties: TestDatabaseProperties,
    connection: Knex.MySqlConnectionConfig,
    stopContainer?: () => Promise<void>,
  ) {
    this.#properties = properties;
    this.#connection = connection;
    this.#knexInstances = [];
    this.#databaseNames = [];
    this.#stopContainer = stopContainer;
  }

  async createDatabaseInstance(): Promise<Knex> {
    const adminConnection = this.#connectAdmin();
    try {
      const databaseName = `db${randomBytes(16).toString('hex')}`;

      await adminConnection.raw('CREATE DATABASE ??', [databaseName]);
      this.#databaseNames.push(databaseName);

      const knexInstance = knexFactory({
        client: this.#properties.driver,
        connection: {
          ...this.#connection,
          database: databaseName,
        },
        ...LARGER_POOL_CONFIG,
      });
      this.#knexInstances.push(knexInstance);

      return knexInstance;
    } finally {
      await adminConnection.destroy();
    }
  }

  async shutdown(): Promise<void> {
    for (const instance of this.#knexInstances) {
      await instance.destroy();
    }

    const adminConnection = this.#connectAdmin();
    try {
      for (const databaseName of this.#databaseNames) {
        await adminConnection.raw('DROP DATABASE ??', [databaseName]);
      }
    } finally {
      await adminConnection.destroy();
    }

    await this.#stopContainer?.();
  }

  #connectAdmin(): Knex {
    const connection = {
      ...this.#connection,
      database: null as unknown as string,
    };
    return knexFactory({
      client: this.#properties.driver,
      connection,
      pool: {
        min: 0,
        max: 1,
        acquireTimeoutMillis: 20_000,
        createTimeoutMillis: 20_000,
        createRetryIntervalMillis: 1_000,
      },
    });
  }
}
