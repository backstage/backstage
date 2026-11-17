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

import type { Namespace } from '../contracts';
import { startLeaseKeepalive } from './keepalive';
import { createManualClock, createMemoryNamespaceLease } from './testing';
import type { LeaseInvalidationReason, NamespaceLease } from './types';

const namespace: Namespace = { pluginId: 'plugin', sessionId: 'session' };
const ttlMs = 1000;

function invalidated() {
  let resolve!: (reason: LeaseInvalidationReason) => void;
  const promise = new Promise<LeaseInvalidationReason>(done => {
    resolve = done;
  });
  return { promise, onInvalidated: resolve };
}

it('invalidates a fence whose lease was taken over', async () => {
  const clock = createManualClock();
  const lease = createMemoryNamespaceLease({ clock, ttlMs });
  const fence = await lease.acquire(namespace, 'replica-a');
  const signal = invalidated();

  const keepalive = startLeaseKeepalive(lease, fence!, {
    intervalMs: 10,
    onInvalidated: signal.onInvalidated,
  });
  expect(keepalive.invalidated).toBe(false);

  // A successor takes the lease: this generation can never be trusted again.
  clock.advance(ttlMs);
  expect(await lease.acquire(namespace, 'replica-b')).toBeDefined();

  await expect(signal.promise).resolves.toBe('renewal-rejected');
  expect(keepalive.invalidated).toBe(true);
  await keepalive.stop();
});

it('invalidates a fence when renewal fails with an error', async () => {
  const fence = {
    namespace,
    owner: 'replica-a',
    token: '1',
  };
  const lease = {
    acquire: async () => fence,
    renew: async () => {
      throw new Error('database is unavailable');
    },
    release: async () => {},
    enumerate: async () => ({ namespaces: [] }),
  } satisfies NamespaceLease;
  const signal = invalidated();

  const keepalive = startLeaseKeepalive(lease, fence, {
    intervalMs: 10,
    onInvalidated: signal.onInvalidated,
  });

  await expect(signal.promise).resolves.toBe('renewal-error');
  await keepalive.stop();
});

it('stops renewing without invalidating after an explicit stop', async () => {
  const clock = createManualClock();
  const lease = createMemoryNamespaceLease({ clock, ttlMs });
  const fence = await lease.acquire(namespace, 'replica-a');
  const onInvalidated = jest.fn();

  const keepalive = startLeaseKeepalive(lease, fence!, {
    intervalMs: 10,
    onInvalidated,
  });
  await keepalive.stop();

  clock.advance(ttlMs);
  await lease.acquire(namespace, 'replica-b');
  await new Promise(resolve => setTimeout(resolve, 50));

  expect(onInvalidated).not.toHaveBeenCalled();
  expect(keepalive.invalidated).toBe(false);
});

it('rejects a non-positive cadence', async () => {
  const lease = createMemoryNamespaceLease({ ttlMs });
  const fence = await lease.acquire(namespace, 'replica-a');
  expect(() =>
    startLeaseKeepalive(lease, fence!, { intervalMs: 0, onInvalidated() {} }),
  ).toThrow('Lease keepalive interval must be positive milliseconds');
});
