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
import { Config } from '@backstage/config';
import { mergeDatabaseConfig } from './config';

/**
 * Creates a knex sqlite3 database connection
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function createSqliteDatabaseClient(
  dbConfig: Config,
  overrides?: knex.Config,
) {
  const knexConfig = buildSqliteDatabaseConfig(dbConfig, overrides);
  const database = knex(knexConfig);

  database.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
    resource.run('PRAGMA foreign_keys = ON', () => {});
  });

  return database;
}

/**
 * Builds a knex sqlite3 connection config
 *
 * @param dbConfig The database config
 * @param overrides Additional options to merge with the config
 */
export function buildSqliteDatabaseConfig(
  dbConfig: Config,
  overrides?: knex.Config,
) {
  return mergeDatabaseConfig(
    dbConfig.get(),
    {
      useNullAsDefault: true,
    },
    overrides,
  );
}
