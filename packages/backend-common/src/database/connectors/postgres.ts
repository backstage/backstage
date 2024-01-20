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

import knexFactory, { Knex } from 'knex';

import { Config } from '@backstage/config';
import { ForwardedError } from '@backstage/errors';
import { mergeDatabaseConfig } from '../config';
import { DatabaseConnector } from '../types';
import defaultNameOverride from './defaultNameOverride';
import defaultSchemaOverride from './defaultSchemaOverride';
import { Client } from 'pg';

/**
 * Creates a knex postgres database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export function createPgDatabaseClient(
  dbConfig: Config,
  overrides?: Knex.Config,
) {
  const knexConfig = buildPgDatabaseConfig(dbConfig, overrides);
  const database = knexFactory(knexConfig);

  const role = dbConfig.getOptionalString('role');

  if (role) {
    database.client.pool.on(
      'createSuccess',
      async (_event: number, pgClient: Client) => {
        await pgClient.query(`SET ROLE ${role}`);
      },
    );
  }
  return database;
}

/**
 * Builds a knex postgres database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export function buildPgDatabaseConfig(
  dbConfig: Config,
  overrides?: Knex.Config,
) {
  return mergeDatabaseConfig(
    dbConfig.get(),
    {
      connection: getPgConnectionConfig(dbConfig, !!overrides),
      useNullAsDefault: true,
    },
    overrides,
  );
}

/**
 * Gets the postgres connection config
 *
 * @param dbConfig - The database config
 * @param parseConnectionString - Flag to explicitly control connection string parsing
 */
export function getPgConnectionConfig(
  dbConfig: Config,
  parseConnectionString?: boolean,
): Knex.PgConnectionConfig | string {
  const connection = dbConfig.get('connection') as any;
  const isConnectionString =
    typeof connection === 'string' || connection instanceof String;
  const autoParse = typeof parseConnectionString !== 'boolean';

  const shouldParseConnectionString = autoParse
    ? isConnectionString
    : parseConnectionString && isConnectionString;

  return shouldParseConnectionString
    ? parsePgConnectionString(connection as string)
    : connection;
}

/**
 * Parses a connection string using pg-connection-string
 *
 * @param connectionString - The postgres connection string
 */
export function parsePgConnectionString(connectionString: string) {
  const parse = requirePgConnectionString();
  return parse(connectionString);
}

function requirePgConnectionString() {
  try {
    return require('pg-connection-string').parse;
  } catch (e) {
    throw new ForwardedError("Postgres: Install 'pg-connection-string'", e);
  }
}

/**
 * Creates the missing Postgres database if it does not exist
 *
 * @param dbConfig - The database config
 * @param databases - The name of the databases to create
 */
export async function ensurePgDatabaseExists(
  dbConfig: Config,
  ...databases: Array<string>
) {
  const admin = createPgDatabaseClient(dbConfig, {
    connection: {
      database: 'postgres',
    },
    pool: {
      min: 0,
      acquireTimeoutMillis: 10000,
    },
  });

  try {
    const ensureDatabase = async (database: string) => {
      const result = await admin
        .from('pg_database')
        .where('datname', database)
        .count<Record<string, { count: string }>>();

      if (parseInt(result[0].count, 10) > 0) {
        return;
      }

      await admin.raw(`CREATE DATABASE ??`, [database]);
    };

    await Promise.all(
      databases.map(async database => {
        // For initial setup we use a smaller timeout but several retries. Given that this
        // is a separate connection pool we should never really run into issues with connection
        // acquisition timeouts, but we do anyway. This might be a bug in knex or some other dependency.
        let lastErr: Error | undefined = undefined;
        for (let i = 0; i < 3; i++) {
          try {
            return await ensureDatabase(database);
          } catch (err) {
            lastErr = err;
          }
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        throw lastErr;
      }),
    );
  } finally {
    await admin.destroy();
  }
}

/**
 * Creates the missing Postgres schema if it does not exist
 *
 * @param dbConfig - The database config
 * @param schemas - The name of the schemas to create
 */
export async function ensurePgSchemaExists(
  dbConfig: Config,
  ...schemas: Array<string>
): Promise<void> {
  const admin = createPgDatabaseClient(dbConfig);
  const role = dbConfig.getOptionalString('role');

  try {
    const ensureSchema = async (database: string) => {
      if (role) {
        await admin.raw(`CREATE SCHEMA IF NOT EXISTS ?? AUTHORIZATION ??`, [
          database,
          role,
        ]);
      } else {
        await admin.raw(`CREATE SCHEMA IF NOT EXISTS ??`, [database]);
      }
    };

    await Promise.all(schemas.map(ensureSchema));
  } finally {
    await admin.destroy();
  }
}

/**
 * Drops the Postgres databases.
 *
 * @param dbConfig - The database config
 * @param databases - The name of the databases to drop
 */
export async function dropPgDatabase(
  dbConfig: Config,
  ...databases: Array<string>
) {
  const admin = createPgDatabaseClient(dbConfig);
  await Promise.all(
    databases.map(async database => {
      await admin.raw(`DROP DATABASE ??`, [database]);
    }),
  );
}

/**
 * PostgreSQL database connector.
 *
 * Exposes database connector functionality via an immutable object.
 */
export const pgConnector: DatabaseConnector = Object.freeze({
  createClient: createPgDatabaseClient,
  ensureDatabaseExists: ensurePgDatabaseExists,
  ensureSchemaExists: ensurePgSchemaExists,
  createNameOverride: defaultNameOverride,
  createSchemaOverride: defaultSchemaOverride,
  parseConnectionString: parsePgConnectionString,
  dropDatabase: dropPgDatabase,
});
