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
import { Config } from '@backstage/config';
import type { Store } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { parsePgConnectionString } from '../../database/connectors/postgres.ts';
import { PostgresStore } from '@acpr/rate-limit-postgresql';

/**
 * Creates a store for `express-rate-limit` based on the configuration.
 *
 * @internal
 */
export class RateLimitStoreFactory {
  static create(config: Config): Store | undefined {
    const store = config.getOptionalConfig('backend.rateLimit.store');
    if (!store) {
      return undefined;
    }
    const client = store.getString('client');
    switch (client) {
      case 'redis':
        return this.redis(store);
      case 'postgres':
        return this.postgres(store);
      case 'memory':
      default:
        return undefined;
    }
  }

  private static redis(storeConfig: Config): Store {
    const connectionString = storeConfig.getString('connection');
    const KeyvRedis = require('@keyv/redis').default;
    const keyv = new KeyvRedis(connectionString);
    return new RedisStore({
      sendCommand: async (...args: string[]) => {
        const client = await keyv.getClient();
        return client.sendCommand(args);
      },
    });
  }

  private static postgres(storeConfig: Config): Store {
    const connection = storeConfig.get('connection') as any;
    const isConnectionString =
      typeof connection === 'string' || connection instanceof String;
    const connectionOptions = isConnectionString
      ? parsePgConnectionString(connection as string)
      : connection;
    return new PostgresStore(connectionOptions, 'rl');
  }
}
