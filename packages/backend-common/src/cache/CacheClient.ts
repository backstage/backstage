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
};

export interface CacheClient {
  get(key: string): Promise<JsonValue>;
  set(key: string, value: JsonValue, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export class ConcreteCacheClient implements CacheClient {
  private readonly client: cacheManager.Cache;
  private readonly pluginId: string;

  constructor({ client, pluginId }: CacheClientArgs) {
    this.client = client;
    this.pluginId = pluginId;
  }

  async get(key: string): Promise<JsonValue> {
    const k = this.getNormalizedKey(key);
    try {
      const data = (await this.client.get(k)) as string | undefined;
      return this.unserializeData(data);
    } catch (_e) {
      return null;
    }
  }

  async set(key: string, value: JsonValue, ttl?: number): Promise<void> {
    const k = this.getNormalizedKey(key);
    try {
      const data = this.serializeData(value);
      await this.client.set(k, data, ttl ? { ttl } : undefined);
    } catch (_e) {
      return;
    }
  }

  async delete(key: string): Promise<void> {
    const k = this.getNormalizedKey(key);
    try {
      await this.client.del(k);
    } catch (_e) {
      return;
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

    return createHash('md5').update(candidateKey).digest('hex');
  }

  private serializeData(data: JsonValue): string {
    return JSON.stringify(data);
  }

  private unserializeData(data: string | undefined): JsonValue {
    return data ? JSON.parse(data) : null;
  }
}
