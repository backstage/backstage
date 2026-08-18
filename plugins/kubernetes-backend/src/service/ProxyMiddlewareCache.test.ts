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

import type { ClusterDetails } from '@backstage/plugin-kubernetes-node';
import type { RequestHandler } from 'http-proxy-middleware';
import {
  buildProxyMiddlewareFingerprint,
  ProxyMiddlewareCache,
  resolveProxyMiddlewareCacheOptions,
} from './ProxyMiddlewareCache';

const cluster = (overrides: Partial<ClusterDetails> = {}): ClusterDetails => ({
  name: 'cluster-a',
  url: 'https://example.com:6443',
  authMetadata: {},
  ...overrides,
});

const stubMiddleware = (): RequestHandler =>
  jest.fn() as unknown as RequestHandler;

describe('resolveProxyMiddlewareCacheOptions', () => {
  it('falls back to defaults for invalid ttl and maxSize', () => {
    expect(
      resolveProxyMiddlewareCacheOptions({ ttlMs: 0, maxSize: 0 }),
    ).toEqual({
      ttlMs: 60_000,
      maxSize: 100,
    });
  });
});

describe('buildProxyMiddlewareFingerprint', () => {
  it('includes cluster detail fields that affect the fingerprint', () => {
    expect(
      buildProxyMiddlewareFingerprint(
        cluster({
          skipTLSVerify: true,
          caData: 'abc',
          caFile: '/tmp/ca',
        }),
      ),
    ).toBe('https://example.com:6443|true|abc|/tmp/ca');
  });
});

describe('ProxyMiddlewareCache', () => {
  it('returns cached middleware when fingerprint matches and TTL has not expired', () => {
    let now = 1_000;
    const cache = new ProxyMiddlewareCache({
      ttlMs: 10_000,
      maxSize: 10,
      now: () => now,
    });
    const details = cluster();
    const middleware = stubMiddleware();

    cache.set(details, middleware);
    now += 5_000;

    expect(cache.get(details)).toBe(middleware);
  });

  it('invalidates when skipTLSVerify changes', () => {
    const cache = new ProxyMiddlewareCache({ ttlMs: 60_000, maxSize: 10 });
    const details = cluster({ skipTLSVerify: true });
    const middleware = stubMiddleware();

    cache.set(details, middleware);

    expect(cache.get(cluster({ skipTLSVerify: false }))).toBeUndefined();
    expect(cache.get(details)).toBeUndefined();
  });

  it('invalidates after TTL expires', () => {
    let now = 0;
    const cache = new ProxyMiddlewareCache({
      ttlMs: 1_000,
      maxSize: 10,
      now: () => now,
    });
    const details = cluster();
    cache.set(details, stubMiddleware());

    now = 1_001;
    expect(cache.get(details)).toBeUndefined();
  });

  it('does not evict other clusters when replacing an existing cache entry at capacity', () => {
    let now = 0;
    const cache = new ProxyMiddlewareCache({
      ttlMs: 60_000,
      maxSize: 2,
      now: () => now,
    });

    const first = stubMiddleware();
    const second = stubMiddleware();
    const secondReplacement = stubMiddleware();

    cache.set(cluster({ name: 'first' }), first);
    now += 100;
    cache.set(cluster({ name: 'second', skipTLSVerify: true }), second);
    now += 100;
    cache.set(
      cluster({ name: 'second', skipTLSVerify: false }),
      secondReplacement,
    );

    expect(cache.get(cluster({ name: 'first' }))).toBe(first);
    expect(cache.get(cluster({ name: 'second', skipTLSVerify: false }))).toBe(
      secondReplacement,
    );
  });

  it('evicts the oldest entry when maxSize is exceeded', () => {
    let now = 0;
    const cache = new ProxyMiddlewareCache({
      ttlMs: 60_000,
      maxSize: 2,
      now: () => now,
    });

    const first = stubMiddleware();
    const second = stubMiddleware();
    const third = stubMiddleware();

    cache.set(cluster({ name: 'first' }), first);
    now += 100;
    cache.set(cluster({ name: 'second' }), second);
    now += 100;
    cache.set(cluster({ name: 'third' }), third);

    expect(cache.get(cluster({ name: 'first' }))).toBeUndefined();
    expect(cache.get(cluster({ name: 'second' }))).toBe(second);
    expect(cache.get(cluster({ name: 'third' }))).toBe(third);
  });
});
