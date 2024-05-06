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

import {
  CacheService,
  CacheServiceInternal,
  CacheServiceOptions,
  CacheServiceSetOptions,
} from '@backstage/backend-plugin-api';
import { JsonValue } from '@backstage/types';
import { createHash } from 'crypto';
import Keyv from 'keyv';
import KeyvMemcache from '@keyv/memcache';

export type CacheClientFactory = (options: CacheServiceOptions) => Keyv;

const HASH_PREFIX = '_$$HASHED$$_:';
const NO_HASH_LIMIT = 200;

/**
 * A basic, concrete implementation of the CacheService, suitable for almost
 * all uses in Backstage.
 */
export class DefaultCacheClient implements CacheService, CacheServiceInternal {
  #client: Keyv;
  #clientFactory: CacheClientFactory;
  #options: CacheServiceOptions;

  constructor(
    client: Keyv,
    clientFactory: CacheClientFactory,
    options: CacheServiceOptions,
  ) {
    this.#client = client;
    this.#clientFactory = clientFactory;
    this.#options = options;
  }

  async get<TValue extends JsonValue>(
    key: string,
  ): Promise<TValue | undefined> {
    const k = this.getNormalizedKey(key);
    const value = await this.#client.get(k);
    return value as TValue | undefined;
  }

  async set(
    key: string,
    value: JsonValue,
    opts: CacheServiceSetOptions = {},
  ): Promise<void> {
    const k = this.getNormalizedKey(key);
    await this.#client.set(k, value, opts.ttl);
  }

  async delete(key: string): Promise<void> {
    const k = this.getNormalizedKey(key);
    await this.#client.delete(k);
  }

  async clear(): Promise<void> {
    if (this.#client.opts.store instanceof KeyvMemcache) {
      throw new Error('Memcached does not support clearing');
    }
    await this.#client.clear();
  }

  iterator(): AsyncGenerator<[string, JsonValue], void, any> {
    if (!this.#client.iterator) {
      throw new Error('The cache client does not support iteration');
    }
    return this.remapKeys(this.#client.iterator());
  }

  withOptions(options: CacheServiceOptions): CacheService {
    const newOptions = { ...this.#options, ...options };
    return new DefaultCacheClient(
      this.#clientFactory(newOptions),
      this.#clientFactory,
      newOptions,
    );
  }

  private async *remapKeys(
    iterator: AsyncIterable<[string, JsonValue]>,
  ): AsyncGenerator<[string, JsonValue], void, any> {
    for await (const [key, value] of iterator) {
      yield [this.getDenormalizedKey(key), value];
    }
  }

  private getDenormalizedKey(normalizedKey: string): string {
    if (normalizedKey.startsWith(HASH_PREFIX)) {
      throw new Error(
        `The key is hashed and cannot be denormalized. To iterate over keys, use keys that base64 representation is shorter than ${NO_HASH_LIMIT} bytes.`,
      );
    }
    return Buffer.from(normalizedKey, 'base64').toString('utf8');
  }

  /**
   * Ensures keys are well-formed for any/all cache stores.
   */
  private getNormalizedKey(candidateKey: string): string {
    // Remove potentially invalid characters.
    const wellFormedKey = Buffer.from(candidateKey).toString('base64');

    // Memcache in particular doesn't do well with keys > 250 bytes.
    // Padded because a plugin ID is also prepended to the key.
    if (wellFormedKey.length < NO_HASH_LIMIT) {
      return wellFormedKey;
    }

    return (
      HASH_PREFIX + createHash('sha256').update(candidateKey).digest('base64')
    );
  }
}
