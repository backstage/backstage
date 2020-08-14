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
import { createPgDatabase } from './postgres';
import { createSqlite3Database } from './sqlite3';

type DatabaseClient = 'pg' | 'sqlite3' | string;

/**
 * Creates a knex database connection
 *
 * @param config The database config
 * @param overrides Additional options to merge with the config
 */
export function createDatabase(config: ConfigReader, overrides?: knex.Config) {
  const client: DatabaseClient = config.getString('client');

  if (client === 'pg') {
    return createPgDatabase(config, overrides);
  } else if (client === 'sqlite3') {
    return createSqlite3Database(config, overrides);
  }

  return knex(mergeDatabaseConfig(config.get(), overrides));
}
