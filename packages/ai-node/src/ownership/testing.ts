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

import type { Fence, Namespace } from '../contracts';
import { nextToken } from './sql';
import { decodeNamespaceCursor, encodeNamespaceCursor } from './cursor';
import type { NamespaceLease, PageOfNamespaces } from './types';

/**
 * A clock the test controls explicitly.
 *
 * @internal
 */
export interface ManualClock {
  /** Current time in epoch milliseconds. */
  now(): number;
  /** Moves time forward. */
  advance(ms: number): void;
}

/** Creates a manually advanced clock for deterministic lease tests. */
export function createManualClock(start = 1_000_000): ManualClock {
  let current = start;
  return {
    now: () => current,
    advance: ms => {
      if (!Number.isSafeInteger(ms) || ms < 0) {
        throw new Error('Clock advance must be non-negative milliseconds');
      }
      current += ms;
    },
  };
}

/** A lease row as stored by {@link createMemoryNamespaceLease}. */
export interface MemoryLeaseRow {
  readonly owner: string;
  readonly token: string;
  readonly expiresAt: number;
}

export interface MemoryNamespaceLeaseOptions {
  readonly clock?: ManualClock;
  readonly ttlMs?: number;
  readonly pageSize?: number;
}

/**
 * A non-production lease adapter with a deterministic clock.
 *
 * @remarks
 *
 * This exists so tests can force expiry and takeover exactly, and so code that
 * depends on the lease seam can be exercised without a database. It is not a
 * persistence, fencing or security implementation: production always uses the
 * Knex adapter on the `ai_namespace_leases` table. It follows the same
 * protocol as that adapter — database-time-equivalent expiry, monotonically
 * increasing decimal tokens, conditional release and rows that are never
 * deleted — so a behaviour proven here means the same decision, not the same
 * durability.
 *
 * @internal
 */
export interface MemoryNamespaceLease extends NamespaceLease {
  /** The stored row, including released and expired ones. */
  inspect(namespace: Namespace): MemoryLeaseRow | undefined;
}

const DEFAULT_TTL_MS = 60_000;
const DEFAULT_PAGE_SIZE = 100;

export function createMemoryNamespaceLease(
  options: MemoryNamespaceLeaseOptions = {},
): MemoryNamespaceLease {
  const clock = options.clock ?? createManualClock();
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  const rows = new Map<string, MemoryLeaseRow>();

  const keyOf = (namespace: Namespace) =>
    `${namespace.pluginId}\u0000${namespace.sessionId}`;

  const live = (row: MemoryLeaseRow | undefined) =>
    row !== undefined && clock.now() < row.expiresAt;

  return {
    inspect(namespace) {
      return rows.get(keyOf(namespace));
    },

    async acquire(namespace, owner) {
      if (!owner) throw new TypeError('Invalid lease owner');
      const key = keyOf(namespace);
      const row = rows.get(key);
      const expiresAt = clock.now() + ttlMs;

      if (!live(row)) {
        const token = row === undefined ? '1' : nextToken(row.token);
        rows.set(key, { owner, token, expiresAt });
        return { namespace, owner, token } as Fence;
      }
      if (row!.owner !== owner) return undefined;
      // The same owner re-acquiring its own live lease extends the current
      // generation instead of rotating the token.
      rows.set(key, { ...row!, expiresAt });
      return { namespace, owner, token: row!.token } as Fence;
    },

    async renew(fence) {
      const key = keyOf(fence.namespace);
      const row = rows.get(key);
      if (
        !live(row) ||
        row!.owner !== fence.owner ||
        row!.token !== fence.token
      ) {
        return false;
      }
      rows.set(key, { ...row!, expiresAt: clock.now() + ttlMs });
      return true;
    },

    async release(fence) {
      const key = keyOf(fence.namespace);
      const row = rows.get(key);
      if (row?.owner !== fence.owner || row.token !== fence.token) return;
      rows.set(key, { ...row, expiresAt: clock.now() });
    },

    async enumerate(pluginId, cursor) {
      if (!pluginId) throw new TypeError('Invalid plugin ID');
      const after =
        cursor === undefined
          ? undefined
          : decodeNamespaceCursor(cursor, pluginId);
      const sessions = [...rows.keys()]
        .map(key => key.split('\u0000'))
        .filter(([plugin]) => plugin === pluginId)
        .map(([, session]) => session)
        .filter(session => after === undefined || session > after)
        .sort();
      const page = sessions.slice(0, pageSize);
      const last = page[page.length - 1];
      return {
        namespaces: page.map(sessionId => ({ pluginId, sessionId })),
        next:
          sessions.length > pageSize && last !== undefined
            ? encodeNamespaceCursor(pluginId, last)
            : undefined,
      } as PageOfNamespaces;
    },
  };
}
