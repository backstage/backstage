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

import knex from 'knex';
import { ConfigReader } from '@backstage/config';
import { mergeDatabaseConfig } from './config';

/**
 * Creates a knex sqlite3 database connection
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function createPgDatabase(
  dbConfig: ConfigReader,
  overrides?: knex.Config,
) {
  const knexConfig = buildPgDatabaseConfig(dbConfig, overrides);
  const database = knex(knexConfig);
  return database;
}

/**
 * Builds a knex postgres database connection
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function buildPgDatabaseConfig(
  dbConfig: ConfigReader,
  overrides?: knex.Config,
) {
  const connection = dbConfig.get('connection') as any;

  return mergeDatabaseConfig(
    dbConfig.get(),
    {
      // Only parse the connection string when overrides are provided
      connection:
        overrides &&
        (typeof connection === 'string' || connection instanceof String)
          ? parsePgConnectionString(connection as string)
          : connection,
      useNullAsDefault: true,
    },
    overrides,
  );
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
