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

import type { RequestHandler } from 'http-proxy-middleware';
import type { ClusterDetails } from '@backstage/plugin-kubernetes-node';

export const DEFAULT_PROXY_MIDDLEWARE_CACHE_TTL_MS = 60_000;
export const DEFAULT_PROXY_MIDDLEWARE_CACHE_MAX_SIZE = 100;

/**
 * @internal
 */
export function resolveProxyMiddlewareCacheOptions(options?: {
  ttlMs?: number;
  maxSize?: number;
}): { ttlMs: number; maxSize: number } {
  const ttlMs =
    options?.ttlMs !== undefined && options.ttlMs > 0
      ? options.ttlMs
      : DEFAULT_PROXY_MIDDLEWARE_CACHE_TTL_MS;
  const maxSize =
    options?.maxSize !== undefined && options.maxSize >= 1
      ? options.maxSize
      : DEFAULT_PROXY_MIDDLEWARE_CACHE_MAX_SIZE;

  return { ttlMs, maxSize };
}

type CacheEntry = {
  middleware: RequestHandler;
  fingerprint: string;
  createdAtMs: number;
};

/**
 * Builds a cache fingerprint from cluster details that affect cached proxy middleware.
 *
 * @internal
 */
export function buildProxyMiddlewareFingerprint(
  cluster: ClusterDetails,
): string {
  return `${cluster.url}|${cluster.skipTLSVerify ?? false}|${
    cluster.caData ?? ''
  }|${cluster.caFile ?? ''}`;
}

/**
 * Bounded TTL cache for per-cluster http-proxy-middleware instances.
 *
 * @internal
 */
export class ProxyMiddlewareCache {
  readonly #ttlMs: number;
  readonly #maxSize: number;
  readonly #entries = new Map<string, CacheEntry>();
  readonly #now: () => number;

  constructor(options: {
    ttlMs?: number;
    maxSize?: number;
    now?: () => number;
  }) {
    const resolved = resolveProxyMiddlewareCacheOptions(options);
    this.#ttlMs = resolved.ttlMs;
    this.#maxSize = resolved.maxSize;
    this.#now = options.now ?? (() => Date.now());
  }

  get(cluster: ClusterDetails): RequestHandler | undefined {
    const entry = this.#entries.get(cluster.name);
    if (!entry) {
      return undefined;
    }

    const fingerprint = buildProxyMiddlewareFingerprint(cluster);
    if (
      entry.fingerprint !== fingerprint ||
      this.#now() - entry.createdAtMs > this.#ttlMs
    ) {
      this.#entries.delete(cluster.name);
      return undefined;
    }

    return entry.middleware;
  }

  set(cluster: ClusterDetails, middleware: RequestHandler): void {
    this.#entries.delete(cluster.name);

    while (this.#entries.size >= this.#maxSize) {
      const oldestKey = this.#findOldestKey();
      if (!oldestKey) {
        break;
      }
      this.#entries.delete(oldestKey);
    }

    this.#entries.set(cluster.name, {
      middleware,
      fingerprint: buildProxyMiddlewareFingerprint(cluster),
      createdAtMs: this.#now(),
    });
  }

  #findOldestKey(): string | undefined {
    let oldestKey: string | undefined;
    let oldestTime = Number.POSITIVE_INFINITY;

    for (const [key, entry] of this.#entries) {
      if (entry.createdAtMs < oldestTime) {
        oldestTime = entry.createdAtMs;
        oldestKey = key;
      }
    }

    return oldestKey;
  }
}
