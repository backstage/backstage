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

import { Logger } from 'winston';
import { Config } from '@backstage/config';
import { AuthDatabase } from '../database/AuthDatabase';
import session, { MemoryStore, Store } from 'express-session';
import connectSessionKnex from 'connect-session-knex';
import { RedisFunctions, RedisModules, RedisScripts } from '@redis/client';
import { createClient, RedisClientOptions } from 'redis';
import RedisStore from 'connect-redis';

type Options = {
  logger: Logger;
  database?: AuthDatabase;
};

const REDIS_SESSION_STORE_PREFIX = 'SESSION';

export class SessionStores {
  /**
   * Looks at the `auth.session.store` section in the application configuration
   * and returns a session store. Defaults to `database`
   *
   * @returns a session store
   */
  static async fromConfig(config: Config, options: Options): Promise<Store> {
    const { logger, database } = options;

    const sessionStoreConfig = config.getOptionalConfig('auth.session.store');
    const provider =
      sessionStoreConfig?.getOptionalString('provider') ?? 'database';

    logger.info(`Configuring "${provider}" as SessionStore provider`);

    if (provider === 'database') {
      return await this.createDatabaseSessionStore(database);
    }

    if (provider === 'redis') {
      return this.createRedisSessionStore(config, options);
    }

    if (provider === 'memory') {
      /**
       * Warning: the default server-side session storage, MemoryStore, is purposely not designed for a production environment.
       * It will leak memory under most conditions, does not scale past a single process, and is only meant for debugging and developing.
       * */
      return new MemoryStore();
    }

    throw new Error(`Unknown SessionStore provider: ${provider}`);
  }

  private static async createDatabaseSessionStore(
    database?: AuthDatabase,
  ): Promise<Store> {
    if (database) {
      const KnexSessionStore = connectSessionKnex(session);
      return new KnexSessionStore({
        createtable: false,
        knex: await database.get(),
      });
    }
    throw new Error('Database is required for Database session store.');
  }

  private static async createRedisSessionStore(
    config: Config,
    options: Options,
  ): Promise<RedisStore> {
    const { logger } = options;

    // Expect Redis server to be provided as an integration
    const redisClientConfig =
      config.getOptional<RedisClientOptions>('integrations.redis');

    if (redisClientConfig) {
      const client = createClient<RedisModules, RedisFunctions, RedisScripts>(
        redisClientConfig,
      );

      client.on('ready', () => {
        logger.info(
          `Redis connection successfully established. RedisSessionStore is ready!`,
        );
      });

      client.on('error', error => {
        logger.error(`Error : ${error}`);
      });

      await client.connect();

      return new RedisStore({
        client,
        prefix: REDIS_SESSION_STORE_PREFIX,
      });
    }
    throw new Error(
      "Unable to create RedisSessionStore. Please provide Redis integration config under 'integrations.redis'.",
    );
  }
}
