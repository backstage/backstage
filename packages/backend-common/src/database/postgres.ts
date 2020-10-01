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

import knex, { PgConnectionConfig } from 'knex';
import { cloneDeep } from 'lodash';
import { Config, JsonValue } from '@backstage/config';
import { mergeDatabaseConfig } from './config';

/**
 * Creates a knex Postgres database connection
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export async function createPgDatabaseClient(
  dbConfig: Config,
  overrides?: knex.Config,
) {
  const baseConfig = buildPgDatabaseConfig(dbConfig, overrides);
  const knexConfig = baseConfig;

  // Bootstrap the missing database.
  if (!!baseConfig?.connection.database) {
    const knexAdminConfig = buildPgDatabaseAdminConfig(cloneDeep(baseConfig));
    const admin = knex(knexAdminConfig);

    await ensurePgDatabase(admin, baseConfig.connection.database);
  }

  const database = knex(knexConfig);
  return database;
}

/**
 * Builds a knex Postgres database connection
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function buildPgDatabaseConfig(
  dbConfig: Config,
  overrides?: knex.Config,
) {
  return mergeDatabaseConfig(
    cloneDeep(dbConfig.get()),
    {
      connection: getPgConnectionConfig(dbConfig, !!overrides),
      useNullAsDefault: true,
    },
    overrides,
  );
}

/**
 * Builds a knex Postgres database connection for database creation
 *
 * @param dbConfig The database config
 */
function buildPgDatabaseAdminConfig(dbConfig: JsonValue) {
  return mergeDatabaseConfig(dbConfig, {
    connection: {
      database: 'postgres',
    },
  });
}

/**
 * Gets the Postgres connection config
 *
 * @param dbConfig The database config
 * @param parseConnectionString Flag to explicitly control connection string parsing
 */
export function getPgConnectionConfig(
  dbConfig: Config,
  parseConnectionString?: boolean,
): PgConnectionConfig | string {
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
 * Creates the missing Postgres database if it does not exist
 *
 * @param admin The administrative database connection, defaulting to the `postgres` database
 * @param database The name of the database to create
 */
async function ensurePgDatabase(admin: knex, database: string) {
  const result = await admin
    .from('pg_database')
    .where('datname', database)
    .count<Record<string, { count: string }>>();

  if (parseInt(result[0].count, 10) > 0) {
    return;
  }

  await admin.raw(`CREATE DATABASE ??`, [database]);
}

/**
 * Parses a connection string using pg-connection-string
 *
 * @param connectionString The postgres connection string
 */
export function parsePgConnectionString(connectionString: string) {
  const parse = requirePgConnectionString();
  return parse(connectionString);
}

function requirePgConnectionString() {
  try {
    return require('pg-connection-string').parse;
  } catch (e) {
    const message = `Postgres: Install 'pg-connection-string'`;
    throw new Error(`${message}\n${e.message}`);
  }
}
