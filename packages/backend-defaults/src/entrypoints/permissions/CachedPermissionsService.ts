/*
 * Copyright 2026 The Backstage Authors
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
  PermissionsService,
  PermissionsServiceRequestOptions,
} from '@backstage/backend-plugin-api';
import {
  AuthorizePermissionRequest,
  AuthorizePermissionResponse,
  PolicyDecision,
  QueryPermissionRequest,
} from '@backstage/plugin-permission-common';
import { toInternalBackstageCredentials } from '../auth/helpers';

const DEFAULT_TTL_MS = 5_000;
const SWEEP_INTERVAL_MS = 30_000;

export type PermissionDecisionCacheEntry = {
  promise: Promise<PolicyDecision | AuthorizePermissionResponse>;
  expiresAt: number;
};

export class CachedPermissionsService implements PermissionsService {
  readonly #delegate: PermissionsService;
  readonly #entries: Map<string, PermissionDecisionCacheEntry>;
  readonly #ttlMs: number;
  #lastSweep: number = Date.now();

  constructor(
    delegate: PermissionsService,
    options?: {
      entries?: Map<string, PermissionDecisionCacheEntry>;
      ttlMs?: number;
    },
  ) {
    this.#delegate = delegate;
    this.#entries = options?.entries ?? new Map();
    this.#ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  }

  async authorize(
    requests: AuthorizePermissionRequest[],
    options: PermissionsServiceRequestOptions,
  ): Promise<AuthorizePermissionResponse[]> {
    const { token } = toInternalBackstageCredentials(options.credentials);
    if (!token) {
      return this.#delegate.authorize(requests, options);
    }

    return this.#cachedBatch(
      'a',
      token,
      requests,
      r =>
        'resourceRef' in r && r.resourceRef
          ? `${r.permission.name}\x00${r.resourceRef}`
          : r.permission.name,
      misses => this.#delegate.authorize(misses, options),
    );
  }

  async authorizeConditional(
    requests: QueryPermissionRequest[],
    options: PermissionsServiceRequestOptions,
  ): Promise<PolicyDecision[]> {
    const { token } = toInternalBackstageCredentials(options.credentials);
    if (!token) {
      return this.#delegate.authorizeConditional(requests, options);
    }

    return this.#cachedBatch(
      'c',
      token,
      requests,
      r => r.permission.name,
      misses => this.#delegate.authorizeConditional(misses, options),
    );
  }

  async #cachedBatch<
    TRequest,
    TResponse extends PolicyDecision | AuthorizePermissionResponse,
  >(
    prefix: string,
    token: string,
    requests: TRequest[],
    getKey: (request: TRequest) => string,
    fetch: (misses: TRequest[]) => Promise<TResponse[]>,
  ): Promise<TResponse[]> {
    const now = Date.now();
    this.#maybeSweep(now);

    const results: (Promise<TResponse> | undefined)[] = new Array(
      requests.length,
    );
    const misses: { index: number; request: TRequest; cacheKey: string }[] = [];

    for (let i = 0; i < requests.length; i++) {
      const cacheKey = `${prefix}\x00${getKey(requests[i])}\x00${token}`;
      const cached = this.#entries.get(cacheKey);
      if (cached && cached.expiresAt > now) {
        results[i] = cached.promise as Promise<TResponse>;
      } else {
        if (cached) {
          this.#entries.delete(cacheKey);
        }
        misses.push({ index: i, request: requests[i], cacheKey });
      }
    }

    if (misses.length > 0) {
      const fetchPromise = fetch(misses.map(m => m.request));

      for (let j = 0; j < misses.length; j++) {
        const { index, cacheKey } = misses[j];

        const promise = fetchPromise.then(
          responses => responses[j],
          error => {
            this.#entries.delete(cacheKey);
            throw error;
          },
        );

        this.#entries.set(cacheKey, {
          promise,
          expiresAt: now + this.#ttlMs,
        });

        results[index] = promise;
      }
    }

    return Promise.all(results as Promise<TResponse>[]);
  }

  #maybeSweep(now: number) {
    if (now - this.#lastSweep > SWEEP_INTERVAL_MS) {
      this.#lastSweep = now;
      for (const [key, entry] of this.#entries) {
        if (entry.expiresAt <= now) {
          this.#entries.delete(key);
        }
      }
    }
  }
}
