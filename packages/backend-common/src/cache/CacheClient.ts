/*
 * Copyright 2021 Spotify AB
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

import { JsonValue } from '@backstage/config';
import cacheManager from 'cache-manager';
import { createHash } from 'crypto';

type CacheClientArgs = {
  client: cacheManager.Cache;
  pluginId: string;
  defaultTtl: number;
  onError: 'reject' | 'returnEmpty';
};

type CacheSetOptions = {
  ttl?: number;
};

/**
 * A pre-configured, storage agnostic cache client suitable for use by
 * Backstage plugins.
 */
export interface CacheClient {
  /**
   * Reads data from a cache store for the given key. If no data was found,
   * returns undefined.
   */
  get(key: string): Promise<JsonValue | undefined>;

  /**
   * Writes the given data to a cache store, associated with the given key. An
   * optional TTL may also be provided, otherwise it defaults to the TTL that
   * was provided when the client was instantiated.
   */
  set(key: string, value: JsonValue, options: CacheSetOptions): Promise<void>;

  /**
   * Removes the given key from the cache store.
   */
  delete(key: string): Promise<void>;
}

/**
 * A simple, concrete implementation of the CacheClient, suitable for almost
 * all uses in Backstage.
 */
export class DefaultCacheClient implements CacheClient {
  private readonly client: cacheManager.Cache;
  private readonly defaultTtl: number;
  private readonly pluginId: string;
  private readonly onError: 'reject' | 'returnEmpty';

  constructor({ client, defaultTtl, pluginId, onError }: CacheClientArgs) {
    this.client = client;
    this.defaultTtl = defaultTtl;
    this.pluginId = pluginId;
    this.onError = onError;
  }

  async get(key: string): Promise<JsonValue | undefined> {
    const k = this.getNormalizedKey(key);
    try {
      const data = (await this.client.get(k)) as string | undefined;
      return this.deserializeData(data);
    } catch (e) {
      if (this.onError === 'reject') {
        throw e;
      }
      return undefined;
    }
  }

  async set(
    key: string,
    value: JsonValue,
    opts: CacheSetOptions = {},
  ): Promise<void> {
    const k = this.getNormalizedKey(key);
    try {
      const data = this.serializeData(value);
      await this.client.set(k, data, {
        ttl: opts.ttl || this.defaultTtl,
      });
    } catch (e) {
      if (this.onError === 'reject') {
        throw e;
      }
    }
  }

  async delete(key: string): Promise<void> {
    const k = this.getNormalizedKey(key);
    try {
      await this.client.del(k);
    } catch (e) {
      if (this.onError === 'reject') {
        throw e;
      }
    }
  }

  /**
   * Namespaces key by plugin to discourage cross-plugin integration via the
   * cache store.
   */
  private getNormalizedKey(key: string): string {
    // Namespace key by plugin ID and remove potentially invalid characters.
    const candidateKey = `${this.pluginId}:${key}`;
    const wellFormedKey = Buffer.from(candidateKey).toString('base64');

    // Memcache in particular doesn't do well with keys > 250 bytes.
    if (wellFormedKey.length < 250) {
      return wellFormedKey;
    }

    return createHash('md5').update(candidateKey).digest('base64');
  }

  private serializeData(data: JsonValue): string {
    return JSON.stringify(data);
  }

  private deserializeData(data: string | undefined): JsonValue | undefined {
    return data ? JSON.parse(data) : undefined;
  }
}
