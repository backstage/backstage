/*
 * Copyright 2025 The Backstage Authors
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
import { LifecycleService, LoggerService } from '@backstage/backend-plugin-api';
import { Config, ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import knexFactory, { Knex } from 'knex';
import { omit } from 'lodash';
import { Client } from 'pg';
import format from 'pg-format';
import { Connector } from '../types';
import { buildPgDatabaseConfig, normalizeConnection } from './postgres';
import ClientPgLite from 'knex-pglite';

class WrappedClientPgLite extends ClientPgLite {
  constructor(config: any) {
    super({ ...config, client: 'pg' });
  }
}

async function createPgLiteDatabaseClient(dbConfig: Config): Promise<Knex> {
  const pgKnexConfig = await buildPgDatabaseConfig(dbConfig, { client: 'pg' });
  const pgLiteKnexConfig = {
    ...pgKnexConfig,
    client: WrappedClientPgLite,
    dialect: 'postgres',
    connection: {},
  };
  const database = knexFactory(pgLiteKnexConfig);

  const role = dbConfig.getOptionalString('role');

  if (role) {
    database.client.pool.on(
      'createSuccess',
      async (_event: number, pgClient: Client) => {
        const query = format('SET ROLE %I', role);
        await pgClient.query(query);
      },
    );
  }
  return database;
}

function checkNoPluginConfig(config: Config) {
  if (config.has('plugin')) {
    throw new Error(
      'The pglite connector does not support plugin division mode "plugin" since all plugins have to share the same connection.',
    );
  }
}

export class PgLiteConnector implements Connector {
  private sharedClient?: Knex;

  constructor(private readonly config: Config) {}

  async getClient(
    _pluginId: string,
    _deps: {
      logger: LoggerService;
      lifecycle: LifecycleService;
    },
  ): Promise<Knex> {
    if (this.sharedClient) {
      return this.sharedClient;
    }

    checkNoPluginConfig(this.config);

    const pluginDivisionMode = this.getPluginDivisionModeConfig();
    if (pluginDivisionMode !== 'database') {
      throw new Error(
        `The PgLite driver does not support plugin division mode '${pluginDivisionMode}'`,
      );
    }

    const basePluginConfig = new ConfigReader(
      this.getKnexConfig() as JsonObject,
    );

    this.sharedClient = await createPgLiteDatabaseClient(basePluginConfig);

    return this.sharedClient;
  }

  private getPluginDivisionModeConfig(): string {
    return this.config.getOptionalString('pluginDivisionMode') ?? 'database';
  }

  /**
   * Provides a Knex connection config.
   *
   * This method provides a baseConfig for a database connector.
   */
  private getConnectionConfig(): Knex.StaticConnectionConfig {
    let baseConnection = normalizeConnection(this.config.get('connection'));
    baseConnection = omit(baseConnection, 'database');

    (
      baseConnection as Knex.PgConnectionConfig
    ).application_name ||= `backstage_plugins`;

    return {
      // include base connection if client type has not been overridden
      ...baseConnection,
    } as Knex.StaticConnectionConfig;
  }

  /**
   * Provides a Knex database config for a given plugin.
   *
   * This method provides a Knex configuration object along with the plugin's
   * client type.
   *
   * @param pluginId - The plugin that the database config should correspond with
   */
  private getKnexConfig(): Knex.Config {
    const role = this.config.getOptionalString('role');
    const knex = this.config.getOptionalConfig('knexConfig')?.get<JsonObject>();

    return {
      connection: this.getConnectionConfig(),
      ...knex,
      ...(role && { role }),
    };
  }
}
