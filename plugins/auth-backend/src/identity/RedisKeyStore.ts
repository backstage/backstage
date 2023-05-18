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

import {AnyJWK, KeyStore, StoredKey} from './types';
import {Config} from "@backstage/config";
import {RedisFunctions, RedisModules, RedisScripts} from '@redis/client';
import {createClient, RedisClientOptions, RedisClientType} from 'redis';
import {DateTime} from "luxon";
import {Logger} from "winston";

type Options = {
  config: Config;
  logger?: Logger;
};

const REDIS_JWT_KEYSTORE_PREFIX = "JWT_KEY";

export class RedisKeyStore implements KeyStore {
  static async create(options: Options): Promise<RedisKeyStore> {
    const {config, logger} = options;

    const redisClientConfig =
      config.getOptional<RedisClientOptions>('integrations.redis');

    if (redisClientConfig) {
      const client = createClient<RedisModules, RedisFunctions, RedisScripts>(
        redisClientConfig,
      );

      client.on('ready', () => {
        logger?.info(
          `Redis connection successfully established. RedisKeyStore is ready!`,
        );
      });

      client.on('error', error => {
        logger?.error(`Error : ${error}`);
      });

      await client.connect();

      return new RedisKeyStore(client);
    }
    throw new Error("Unable to create RedisKeyStore. Please provide Redis integration config under 'integrations.redis'.");
  }

  private readonly redisClient;

  private constructor(client: RedisClientType<
    RedisModules,
    RedisFunctions,
    RedisScripts
  >) {
    this.redisClient = client;
  }

  private compoundKey(keyId: string): string {
    return `${REDIS_JWT_KEYSTORE_PREFIX}:${keyId}`;
  }

  async addKey(jwk: AnyJWK): Promise<void> {
    const key = this.compoundKey(jwk.kid);
    const entry = {
      key: jwk,
      createdAt: DateTime.utc().toJSDate()
    };
    await this.redisClient.set(key, JSON.stringify(entry));
  }

  async listKeys(): Promise<{ items: StoredKey[] }> {
    const keys = await this.redisClient.keys(`${REDIS_JWT_KEYSTORE_PREFIX}*`);
    if (keys.length > 0) {
      const jwks = await this.redisClient.mGet(keys);
      return {
        items: jwks?.map(row => {
          const entry = JSON.parse(row!);
          return {
            key: entry.key,
            createdAt: new Date(entry.createdAt),
          }
        }),
      };
    }
    return {items: []}
  }

  async removeKeys(kids: string[]): Promise<void> {
    if (kids.length > 0) {
      const ids = kids.map(kid => this.compoundKey(kid));
      await this.redisClient.del(ids);
    }
  }
}
