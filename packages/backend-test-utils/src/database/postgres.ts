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
import { parse as parsePgConnectionString } from 'pg-connection-string';
import { v4 as uuid } from 'uuid';
import { Engine, LARGER_POOL_CONFIG, TestDatabaseProperties } from './types';

async function waitForPostgresReady(
  connection: Knex.PgConnectionConfig,
): Promise<void> {
  const startTime = Date.now();

  let lastError: Error | undefined;
  let attempts = 0;
  for (;;) {
    attempts += 1;

    let knex: Knex | undefined;
    try {
      knex = knexFactory({
        client: 'pg',
        connection: {
          // make a copy because the driver mutates this
          ...connection,
        },
      });
      const result = await knex.select(knex.raw('version()'));
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

export async function startPostgresContainer(image: string): Promise<{
  connection: Knex.PgConnectionConfig;
  stopContainer: () => Promise<void>;
}> {
  const user = 'postgres';
  const password = uuid();

  // Lazy-load to avoid side-effect of importing testcontainers
  const { GenericContainer } =
    require('testcontainers') as typeof import('testcontainers');

  const container = await new GenericContainer(image)
    .withExposedPorts(5432)
    .withEnvironment({ POSTGRES_PASSWORD: password })
    .withTmpFs({ '/var/lib/postgresql/data': 'rw' })
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(5432);
  const connection = { host, port, user, password };
  const stopContainer = async () => {
    await container.stop({ timeout: 10_000 });
  };

  await waitForPostgresReady(connection);

  return { connection, stopContainer };
}

export class PostgresEngine implements Engine {
  static async create(
    properties: TestDatabaseProperties,
  ): Promise<PostgresEngine> {
    const { connectionStringEnvironmentVariableName, dockerImageName } =
      properties;

    if (connectionStringEnvironmentVariableName) {
      const connectionString =
        process.env[connectionStringEnvironmentVariableName];
      if (connectionString) {
        const connection = parsePgConnectionString(connectionString);
        return new PostgresEngine(
          properties,
          connection as Knex.PgConnectionConfig,
        );
      }
    }

    if (dockerImageName) {
      const { connection, stopContainer } = await startPostgresContainer(
        dockerImageName,
      );
      return new PostgresEngine(properties, connection, stopContainer);
    }

    throw new Error(`Test databasee for ${properties.name} not configured`);
  }

  readonly #properties: TestDatabaseProperties;
  readonly #connection: Knex.PgConnectionConfig;
  readonly #knexInstances: Knex[];
  readonly #databaseNames: string[];
  readonly #stopContainer?: () => Promise<void>;

  constructor(
    properties: TestDatabaseProperties,
    connection: Knex.PgConnectionConfig,
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
    return knexFactory({
      client: this.#properties.driver,
      connection: {
        ...this.#connection,
        database: 'postgres',
      },
      pool: {
        acquireTimeoutMillis: 10000,
      },
    });
  }
}
