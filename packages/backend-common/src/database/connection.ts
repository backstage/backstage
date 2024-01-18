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

import { Config } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { InputError } from '@backstage/errors';
import knexFactory, { Knex } from 'knex';
import limiterFactory from 'p-limit';
import { mergeDatabaseConfig } from './config';
import { DatabaseConnector } from './types';

import { mysqlConnector, pgConnector, sqlite3Connector } from './connectors';
import {
  LifecycleService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';

type DatabaseClient =
  | 'pg'
  | 'better-sqlite3'
  | 'sqlite3'
  | 'mysql'
  | 'mysql2'
  | string;

// This limits the number of concurrent CREATE DATABASE and CREATE SCHEMA
// commands, globally, to just one. This is overly defensive, and was added as
// an attempt to counteract the pool issues on recent node versions. See
// https://github.com/backstage/backstage/pull/19988
const ddlLimiter = limiterFactory(1);

/**
 * Mapping of client type to supported database connectors
 *
 * Database connectors can be aliased here, for example mysql2 uses
 * the same connector as mysql.
 */
const ConnectorMapping: Record<DatabaseClient, DatabaseConnector> = {
  pg: pgConnector,
  'better-sqlite3': sqlite3Connector,
  sqlite3: sqlite3Connector,
  mysql: mysqlConnector,
  mysql2: mysqlConnector,
};

/**
 * Creates a knex database connection
 *
 * @public
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
export function createDatabaseClient(
  dbConfig: Config,
  overrides?: Partial<Knex.Config>,
  deps?: {
    lifecycle: LifecycleService;
    pluginMetadata: PluginMetadataService;
  },
) {
  const client: DatabaseClient = dbConfig.getString('client');

  return (
    ConnectorMapping[client]?.createClient(dbConfig, overrides, deps) ??
    knexFactory(mergeDatabaseConfig(dbConfig.get(), overrides))
  );
}

/**
 * Ensures that the given databases all exist, creating them if they do not.
 *
 * @public
 */
export async function ensureDatabaseExists(
  dbConfig: Config,
  ...databases: Array<string>
): Promise<void> {
  const client: DatabaseClient = dbConfig.getString('client');

  return await ddlLimiter(() =>
    ConnectorMapping[client]?.ensureDatabaseExists?.(dbConfig, ...databases),
  );
}

/**
 * Drops the given databases.
 *
 * @public
 */
export async function dropDatabase(
  dbConfig: Config,
  ...databases: Array<string>
): Promise<void> {
  const client: DatabaseClient = dbConfig.getString('client');

  return await ddlLimiter(() =>
    ConnectorMapping[client]?.dropDatabase?.(dbConfig, ...databases),
  );
}

/**
 * Ensures that the given schemas all exist, creating them if they do not.
 *
 * @public
 */
export async function ensureSchemaExists(
  dbConfig: Config,
  ...schemas: Array<string>
): Promise<void> {
  const client: DatabaseClient = dbConfig.getString('client');

  return await ddlLimiter(() =>
    ConnectorMapping[client]?.ensureSchemaExists?.(dbConfig, ...schemas),
  );
}

/**
 * Provides a `Knex.Config` object with the provided database name for a given
 * client.
 */
export function createNameOverride(
  client: string,
  name: string,
): Partial<Knex.Config> {
  try {
    return ConnectorMapping[client].createNameOverride(name);
  } catch (e) {
    throw new InputError(
      `Unable to create database name override for '${client}' connector`,
      e,
    );
  }
}

/**
 * Provides a `Knex.Config` object with the provided database schema for a given
 * client. Currently only supported by `pg`.
 */
export function createSchemaOverride(
  client: string,
  name: string,
): Partial<Knex.Config | undefined> {
  try {
    return ConnectorMapping[client]?.createSchemaOverride?.(name);
  } catch (e) {
    throw new InputError(
      `Unable to create database schema override for '${client}' connector`,
      e,
    );
  }
}

/**
 * Parses a connection string for a given client and provides a connection config.
 */
export function parseConnectionString(
  connectionString: string,
  client?: string,
): Knex.StaticConnectionConfig {
  if (typeof client === 'undefined' || client === null) {
    throw new InputError(
      'Database connection string client type auto-detection is not yet supported.',
    );
  }

  try {
    return ConnectorMapping[client].parseConnectionString(connectionString);
  } catch (e) {
    throw new InputError(
      `Unable to parse connection string for '${client}' connector`,
    );
  }
}

/**
 * Normalizes a connection config or string into an object which can be passed
 * to Knex.
 */
export function normalizeConnection(
  connection: Knex.StaticConnectionConfig | JsonObject | string | undefined,
  client: string,
): Partial<Knex.StaticConnectionConfig> {
  if (typeof connection === 'undefined' || connection === null) {
    return {};
  }

  return typeof connection === 'string' || connection instanceof String
    ? parseConnectionString(connection as string, client)
    : connection;
}
