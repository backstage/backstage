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

import { DatabaseManager } from '@backstage/backend-common';
import { Knex } from 'knex';
import { getDockerImageForName } from '../util/getDockerImageForName';

/**
 * The possible databases to test against.
 *
 * @public
 */
export type TestDatabaseId =
  | 'POSTGRES_16'
  | 'POSTGRES_15'
  | 'POSTGRES_14'
  | 'POSTGRES_13'
  | 'POSTGRES_12'
  | 'POSTGRES_11'
  | 'POSTGRES_9'
  | 'MYSQL_8'
  | 'SQLITE_3';

export type TestDatabaseProperties = {
  name: string;
  driver: string;
  dockerImageName?: string;
  connectionStringEnvironmentVariableName?: string;
};

export type Instance = {
  stopContainer?: () => Promise<void>;
  dropDatabases?: () => Promise<void>;
  databaseManager: DatabaseManager;
  connections: Array<Knex>;
  databaseNames: Array<string>;
};

export const allDatabases: Record<TestDatabaseId, TestDatabaseProperties> =
  Object.freeze({
    POSTGRES_16: {
      name: 'Postgres 16.x',
      driver: 'pg',
      dockerImageName: getDockerImageForName('postgres:16'),
      connectionStringEnvironmentVariableName:
        'BACKSTAGE_TEST_DATABASE_POSTGRES16_CONNECTION_STRING',
    },
    POSTGRES_15: {
      name: 'Postgres 15.x',
      driver: 'pg',
      dockerImageName: getDockerImageForName('postgres:15'),
      connectionStringEnvironmentVariableName:
        'BACKSTAGE_TEST_DATABASE_POSTGRES15_CONNECTION_STRING',
    },
    POSTGRES_14: {
      name: 'Postgres 14.x',
      driver: 'pg',
      dockerImageName: getDockerImageForName('postgres:14'),
      connectionStringEnvironmentVariableName:
        'BACKSTAGE_TEST_DATABASE_POSTGRES14_CONNECTION_STRING',
    },
    POSTGRES_13: {
      name: 'Postgres 13.x',
      driver: 'pg',
      dockerImageName: getDockerImageForName('postgres:13'),
      connectionStringEnvironmentVariableName:
        'BACKSTAGE_TEST_DATABASE_POSTGRES13_CONNECTION_STRING',
    },
    POSTGRES_12: {
      name: 'Postgres 12.x',
      driver: 'pg',
      dockerImageName: getDockerImageForName('postgres:12'),
      connectionStringEnvironmentVariableName:
        'BACKSTAGE_TEST_DATABASE_POSTGRES12_CONNECTION_STRING',
    },
    POSTGRES_11: {
      name: 'Postgres 11.x',
      driver: 'pg',
      dockerImageName: getDockerImageForName('postgres:11'),
      connectionStringEnvironmentVariableName:
        'BACKSTAGE_TEST_DATABASE_POSTGRES11_CONNECTION_STRING',
    },
    POSTGRES_9: {
      name: 'Postgres 9.x',
      driver: 'pg',
      dockerImageName: getDockerImageForName('postgres:9'),
      connectionStringEnvironmentVariableName:
        'BACKSTAGE_TEST_DATABASE_POSTGRES9_CONNECTION_STRING',
    },
    MYSQL_8: {
      name: 'MySQL 8.x',
      driver: 'mysql2',
      dockerImageName: getDockerImageForName('mysql:8'),
      connectionStringEnvironmentVariableName:
        'BACKSTAGE_TEST_DATABASE_MYSQL8_CONNECTION_STRING',
    },
    SQLITE_3: {
      name: 'SQLite 3.x',
      driver: 'better-sqlite3',
    },
  });
