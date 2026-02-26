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

import { ForwardedError, InputError, NotFoundError } from '@backstage/errors';
import { resolveSrv, SrvRecord } from 'node:dns';

const PROTOCOL_SUFFIX = '+srv:';

/**
 * Helps with resolution and caching of SRV lookups.
 *
 * Supports URLs on the form `http+srv://myplugin.services.region.example.net/api/myplugin`
 */
export class SrvResolvers {
  readonly #cache: Map<string, Promise<SrvRecord[]>>;
  readonly #cacheTtlMillis: number;
  readonly #resolveSrv: (host: string) => Promise<SrvRecord[]>;

  constructor(options?: {
    resolveSrv?: (host: string) => Promise<SrvRecord[]>;
    cacheTtlMillis?: number;
  }) {
    this.#cache = new Map();
    this.#cacheTtlMillis = options?.cacheTtlMillis ?? 1000;
    this.#resolveSrv =
      options?.resolveSrv ??
      (host =>
        new Promise((resolve, reject) => {
          resolveSrv(host, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }));
  }

  isSrvUrl(url: string): boolean {
    try {
      this.#parseSrvUrl(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get a resolver function for a given SRV form URL.
   *
   * @param url An SRV form URL, e.g. `http+srv://myplugin.services.region.example.net/api/myplugin`
   * @returns A function that returns resolved URLs, e.g. `http://1234abcd.region.example.net:8080/api/myplugin`
   */
  getResolver(url: string): () => Promise<string> {
    const { protocol, host, path } = this.#parseSrvUrl(url);
    return () =>
      this.#resolveHost(host).then(
        resolved => `${protocol}://${resolved}${path}`,
      );
  }

  /**
   * Attempts to parse out the relevant parts of an SRV URL.
   */
  #parseSrvUrl(url: string): { protocol: string; host: string; path: string } {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      throw new InputError(
        `SRV resolver expected a valid URL starting with http(s)+srv:// but got '${url}'`,
      );
    }
    if (!parsedUrl.protocol?.endsWith(PROTOCOL_SUFFIX) || !parsedUrl.hostname) {
      throw new InputError(
        `SRV resolver expected a URL with protocol http(s)+srv:// but got '${url}'`,
      );
    }
    if (parsedUrl.port) {
      throw new InputError(
        `SRV resolver URLs cannot contain a port but got '${url}'`,
      );
    }
    if (parsedUrl.username || parsedUrl.password) {
      throw new InputError(
        `SRV resolver URLs cannot contain username or password but got '${url}'`,
      );
    }
    if (parsedUrl.search || parsedUrl.hash) {
      throw new InputError(
        `SRV resolver URLs cannot contain search params or a hash but got '${url}'`,
      );
    }

    const protocol = parsedUrl.protocol.substring(
      0,
      parsedUrl.protocol.length - PROTOCOL_SUFFIX.length,
    );
    const host = parsedUrl.hostname;
    const path = parsedUrl.pathname.replace(/\/+$/, '');

    if (!['http', 'https'].includes(protocol)) {
      throw new InputError(
        `SRV URLs must be based on http or https but got '${url}'`,
      );
    }

    return { protocol, host, path };
  }

  /**
   * Resolves a single SRV record name to a host:port string.
   */
  #resolveHost(host: string): Promise<string> {
    let records = this.#cache.get(host);
    if (!records) {
      records = this.#resolveSrv(host).then(
        result => {
          if (!result.length) {
            throw new NotFoundError(`No SRV records found for ${host}`);
          }
          return result;
        },
        err => {
          throw new ForwardedError(`Failed SRV resolution for ${host}`, err);
        },
      );
      this.#cache.set(host, records);
      setTimeout(() => {
        this.#cache.delete(host);
      }, this.#cacheTtlMillis);
    }

    return records.then(rs => {
      const r = this.#pickRandomRecord(rs);
      return `${r.name}:${r.port}`;
    });
  }

  /**
   * Among a set of records, pick one at random.
   *
   * This assumes that the set is not empty.
   *
   * Since this contract only ever returns a single record, the best it can do
   * is to pick weighted-randomly among the highest-priority records. In order
   * to be smarter than that, the caller would have to be able to make decisions
   * on the whole set of records.
   */
  #pickRandomRecord(allRecords: SrvRecord[]): SrvRecord {
    // Lowest priority number means highest priority
    const lowestPriority = allRecords.reduce(
      (acc, r) => Math.min(acc, r.priority),
      Number.MAX_SAFE_INTEGER,
    );
    const records = allRecords.filter(r => r.priority === lowestPriority);

    const totalWeight = records.reduce((acc, r) => acc + r.weight, 0);
    const targetWeight = Math.random() * totalWeight;

    // Just as a fallback, we expect the loop below to always find a result
    let result = records[0];
    let currentWeight = 0;

    for (const record of records) {
      currentWeight += record.weight;
      if (targetWeight <= currentWeight) {
        result = record;
        break;
      }
    }

    return result;
  }
}
