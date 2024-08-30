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
  CacheServiceOptions,
  CacheServiceSetOptions,
} from '@backstage/backend-plugin-api';
import { JsonValue } from '@backstage/types';
import { createHash } from 'crypto';
import Keyv from 'keyv';
import { ttlToMilliseconds } from './types';

export type CacheClientFactory = (options: CacheServiceOptions) => Keyv;

/**
 * A basic, concrete implementation of the CacheService, suitable for almost
 * all uses in Backstage.
 */
export class DefaultCacheClient implements CacheService {
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
    const ttl =
      opts.ttl !== undefined ? ttlToMilliseconds(opts.ttl) : undefined;
    await this.#client.set(k, value, ttl);
  }

  async delete(key: string): Promise<void> {
    const k = this.getNormalizedKey(key);
    await this.#client.delete(k);
  }

  withOptions(options: CacheServiceOptions): CacheService {
    const newOptions = { ...this.#options, ...options };
    return new DefaultCacheClient(
      this.#clientFactory(newOptions),
      this.#clientFactory,
      newOptions,
    );
  }

  /**
   * Ensures keys are well-formed for any/all cache stores.
   */
  private getNormalizedKey(candidateKey: string): string {
    // Remove potentially invalid characters.
    const wellFormedKey = Buffer.from(candidateKey).toString('base64');

    // Memcache in particular doesn't do well with keys > 250 bytes.
    // Padded because a plugin ID is also prepended to the key.
    if (wellFormedKey.length < 200) {
      return wellFormedKey;
    }

    return createHash('sha256').update(candidateKey).digest('base64');
  }
}
