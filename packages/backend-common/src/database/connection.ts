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

import knexFactory, { Knex } from 'knex';
import { Config } from '@backstage/config';
import { mergeDatabaseConfig } from './config';
import { createPgDatabaseClient, ensurePgDatabaseExists } from './postgres';
import { createSqliteDatabaseClient } from './sqlite3';

type DatabaseClient = 'pg' | 'sqlite3' | string;

/**
 * Creates a knex database connection
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function createDatabaseClient(
  dbConfig: Config,
  overrides?: Partial<Knex.Config>,
) {
  const client: DatabaseClient = dbConfig.getString('client');

  if (client === 'pg') {
    return createPgDatabaseClient(dbConfig, overrides);
  } else if (client === 'sqlite3') {
    return createSqliteDatabaseClient(dbConfig, overrides);
  }

  return knexFactory(mergeDatabaseConfig(dbConfig.get(), overrides));
}

/**
 * Alias for createDatabaseClient
 * @deprecated Use createDatabaseClient instead
 */
export const createDatabase = createDatabaseClient;

/**
 * Ensures that the given databases all exist, creating them if they do not.
 */
export async function ensureDatabaseExists(
  dbConfig: Config,
  ...databases: Array<string>
) {
  const client: DatabaseClient = dbConfig.getString('client');

  if (client === 'pg') {
    return ensurePgDatabaseExists(dbConfig, ...databases);
  }

  return undefined;
}
