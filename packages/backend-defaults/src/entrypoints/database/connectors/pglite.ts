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

import { DevDataStore } from '@backstage/backend-dev-utils';
import { LifecycleService, LoggerService } from '@backstage/backend-plugin-api';
import { Config, ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import knexFactory, { Knex } from 'knex';
import { merge } from 'lodash';
import { Connector } from '../types';
import { mergeDatabaseConfig } from './mergeDatabaseConfig';

/**
 * Provides a config lookup path for a plugin's config block.
 */
function pluginPath(pluginId: string): string {
  return `plugin.${pluginId}`;
}

/**
 * Creates a knex postgres database connection
 *
 * @param dbConfig - The database config
 * @param overrides - Additional options to merge with the config
 */
async function createPgLiteDatabaseClient(
  pluginId: string,
  dbConfig: Config,
  lifecycle: LifecycleService,
) {
  const { PGlite } = await import('@electric-sql/pglite');
  const { default: ClientPgLite } = await import('knex-pglite');

  class WrappedClientPgLite extends ClientPgLite {
    constructor(config: any) {
      super({ ...config, client: 'pg' });
    }
  }

  const devStore = DevDataStore.get();

  const config: Knex.Config = mergeDatabaseConfig(
    dbConfig.get(),
    {
      useNullAsDefault: true,
    },
    {
      client: WrappedClientPgLite,
      connection: devStore
        ? async () => {
            const dataKey = `sqlite3-db-${pluginId}`;
            const { data: seedData } = await devStore.load(dataKey);
            console.log(`DEBUG: seedData=`, seedData);
            const pglite = await PGlite.create({
              loadDataDir: seedData ? new Blob([seedData]) : undefined,
            });

            lifecycle.addShutdownHook(async () => {
              const blob = await pglite.dumpDataDir('gzip');
              const data = await blob.arrayBuffer();
              await devStore.save(dataKey, data);
            });
            return { pglite };
          }
        : undefined,
    },
  );

  return knexFactory(config);
}

export class PgLiteConnector implements Connector {
  constructor(private readonly config: Config) {}

  async getClient(
    pluginId: string,
    deps: {
      logger: LoggerService;
      lifecycle: LifecycleService;
    },
  ): Promise<Knex> {
    const pluginConfig = new ConfigReader(
      this.getAdditionalKnexConfig(pluginId) as JsonObject,
    );

    const client = createPgLiteDatabaseClient(
      pluginId,
      pluginConfig,
      deps.lifecycle,
    );

    return client;
  }

  /**
   * Provides the knexConfig which should be used for a given plugin.
   *
   * @param pluginId - Plugin to get the knexConfig for
   * @returns The merged knexConfig value or undefined if it isn't specified
   */
  private getAdditionalKnexConfig(pluginId: string): JsonObject | undefined {
    const pluginConfig = this.config
      .getOptionalConfig(`${pluginPath(pluginId)}.knexConfig`)
      ?.get<JsonObject>();

    const baseConfig = this.config
      .getOptionalConfig('knexConfig')
      ?.get<JsonObject>();

    return merge(baseConfig, pluginConfig);
  }
}
