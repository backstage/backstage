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
import { createManualClock, createMemoryNamespaceLease } from './testing';

const namespace: Namespace = { pluginId: 'plugin', sessionId: 'session' };
const ttlMs = 1000;

function fixture() {
  const clock = createManualClock();
  const lease = createMemoryNamespaceLease({ clock, ttlMs, pageSize: 2 });
  return { clock, lease };
}

it('decides expiry from the injected clock and takes over with the next token', async () => {
  const { clock, lease } = fixture();
  const first = await lease.acquire(namespace, 'replica-a');
  expect(first!.token).toBe('1');
  expect(await lease.acquire(namespace, 'replica-b')).toBeUndefined();

  clock.advance(ttlMs);
  expect(await lease.renew(first!)).toBe(false);

  const second = await lease.acquire(namespace, 'replica-b');
  expect(second!.token).toBe('2');
  // A stale release cannot expire the successor's generation.
  await lease.release(first!);
  expect(await lease.renew(second!)).toBe(true);
});

it('retains rows and keeps tokens monotonic across release and reacquisition', async () => {
  const { lease } = fixture();
  const first = await lease.acquire(namespace, 'replica-a');
  await lease.release(first!);
  expect(lease.inspect(namespace)).toBeDefined();

  const second = await lease.acquire(namespace, 'replica-a');
  await lease.release(second!);
  const third = await lease.acquire(namespace, 'replica-b');

  expect([first!.token, second!.token, third!.token]).toEqual(['1', '2', '3']);
});

it('extends a live lease re-acquired by the same owner', async () => {
  const { clock, lease } = fixture();
  const first = await lease.acquire(namespace, 'replica-a');
  clock.advance(600);
  const again = await lease.acquire(namespace, 'replica-a');

  expect(again).toEqual(first);
  expect(lease.inspect(namespace)!.expiresAt).toBe(clock.now() + ttlMs);
});

it('pages enumeration in session key order', async () => {
  const { lease } = fixture();
  for (const sessionId of ['d', 'a', 'c', 'b']) {
    await lease.acquire({ pluginId: 'plugin', sessionId }, 'replica-a');
  }
  await lease.acquire(
    { pluginId: 'other-plugin', sessionId: 'a' },
    'replica-a',
  );

  const seen: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await lease.enumerate('plugin', cursor);
    seen.push(...page.namespaces.map(item => item.sessionId));
    cursor = page.next;
  } while (cursor !== undefined);

  expect(seen).toEqual(['a', 'b', 'c', 'd']);
  await expect(lease.enumerate('plugin', 'not-a-cursor')).rejects.toThrow(
    'Invalid namespace enumeration cursor',
  );
});
