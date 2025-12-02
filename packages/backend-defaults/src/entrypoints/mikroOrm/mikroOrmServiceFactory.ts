/*
 * Copyright 2024 The Backstage Authors
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

import {
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { MikroORM, EntitySchema } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { BetterSqliteDriver } from '@mikro-orm/better-sqlite';

/**
 *
 * @alpha
 */
export const mikroOrmServiceFactory = createServiceFactory({
  service: coreServices.mikroOrm,
  deps: {
    config: coreServices.rootConfig,
    logger: coreServices.logger,
    lifecycle: coreServices.lifecycle,
    pluginMetadata: coreServices.pluginMetadata,
  },
  async factory({ config, logger, lifecycle, pluginMetadata }) {
    return {
      async init(entities: EntitySchema[]) {
        const pluginId = pluginMetadata.getId();
        logger.info(`Initializing MikroORM for ${pluginId}`);

        const dbConfig = config.getConfig('backend.database');
        const client = dbConfig.getString('client');

        let driver: any;
        let dbName: string | undefined;
        let clientUrl: string | undefined;
        let host: string | undefined;
        let port: number | undefined;
        let user: string | undefined;
        let password: string | undefined;

        const connection = dbConfig.getOptional('connection');

        if (client === 'pg') {
          driver = PostgreSqlDriver;
          if (typeof connection === 'object' && connection !== null) {
            const conn = connection as any;
            host = conn.host;
            port = conn.port;
            user = conn.user;
            password = conn.password;
            dbName = conn.database;
          } else if (typeof connection === 'string') {
            clientUrl = connection;
          }
        } else if (client === 'better-sqlite3' || client === 'sqlite3') {
          driver = BetterSqliteDriver;
          if (typeof connection === 'object' && connection !== null) {
            const conn = connection as any;
            dbName = conn.filename;
          } else if (typeof connection === 'string') {
            dbName = connection;
          }
        } else {
          throw new Error(`Unsupported database client: ${client}`);
        }

        const orm = await MikroORM.init({
          entities,
          driver,
          dbName,
          clientUrl,
          host,
          port,
          user,
          password,
          debug: process.env.NODE_ENV !== 'production',
          allowGlobalContext: true,
        });

        lifecycle.addShutdownHook(() => orm.close());

        return orm;
      },
    };
  },
});
