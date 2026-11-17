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

import type { Knex } from 'knex';
import type { Fence, Namespace } from '../contracts';
import {
  assertToken,
  dialectOf,
  expiredNow,
  expiryFromNow,
  inTransaction,
  liveCondition,
  nextToken,
  type Dialect,
} from './sql';
import type { NamespaceLease, PageOfNamespaces } from './types';
import { decodeNamespaceCursor, encodeNamespaceCursor } from './cursor';

const TABLE = 'ai_namespace_leases';

/** Options for {@link createKnexNamespaceLease}. */
export interface KnexNamespaceLeaseOptions {
  readonly db: Knex;
  /** Lease lifetime in milliseconds. Default one minute. */
  readonly ttlMs?: number;
  /** Enumeration page size. Default 100. */
  readonly pageSize?: number;
}

type LeaseKey = Readonly<{ plugin_id: string; session_id: string }>;

type LeaseRow = { owner_id: string; token: string | number; live: unknown };

function keyOf(namespace: Namespace): LeaseKey {
  return { plugin_id: namespace.pluginId, session_id: namespace.sessionId };
}

function assertNamespace(namespace: Namespace): void {
  for (const [field, value] of [
    ['pluginId', namespace?.pluginId],
    ['sessionId', namespace?.sessionId],
  ] as const) {
    if (typeof value !== 'string' || value.length === 0) {
      throw new TypeError(`Invalid namespace ${field}`);
    }
  }
}

const DEFAULT_TTL_MS = 60_000;
const DEFAULT_PAGE_SIZE = 100;

/**
 * The Knex implementation of the namespace lease seam.
 *
 * @remarks
 *
 * It uses exactly the fence protocol fixed for the storage adapter: the
 * existing `ai_namespace_leases(plugin_id, session_id, owner_id, token,
 * expires_at)` table, database time for expiry, and decimal-string tokens that
 * increase monotonically without JavaScript number precision loss.
 *
 * Acquisition, renewal and release are single conditional statements, so
 * they serialize on the lease row: acquisition is a compare-and-swap on the
 * observed `(owner, token, live)` state, and every mutation re-checks the
 * current generation in SQL. Release expires the row conditionally on
 * owner and token and never deletes it, so a stale release cannot affect a
 * successor's lease and the token counter cannot restart.
 */
export class KnexNamespaceLease implements NamespaceLease {
  readonly #db: Knex;
  readonly #dialect: Dialect;
  readonly #ttlMs: number;
  readonly #pageSize: number;

  constructor(options: KnexNamespaceLeaseOptions, dialect: Dialect) {
    this.#db = options.db;
    this.#dialect = dialect;
    this.#ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
    this.#pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  }

  #expiry(): Knex.Raw {
    return expiryFromNow(this.#db, this.#dialect, this.#ttlMs);
  }

  #live(executor: Knex | Knex.Transaction): Knex.Raw {
    return executor.raw(`${liveCondition(this.#dialect)} as live`);
  }

  async acquire(
    namespace: Namespace,
    owner: string,
  ): Promise<Fence | undefined> {
    assertNamespace(namespace);
    if (typeof owner !== 'string' || owner.length === 0) {
      throw new TypeError('Invalid lease owner');
    }
    const key = keyOf(namespace);

    return inTransaction(this.#db, async trx => {
      // PostgreSQL locks the existing row outright; SQLite relies on the
      // conditional statements below, whose compare-and-swap clauses are
      // evaluated against the committed row while the write lock is held.
      const row: LeaseRow | undefined =
        this.#dialect === 'pg'
          ? await trx(TABLE)
              .where(key)
              .forUpdate()
              .select('owner_id', tokenColumn(trx), this.#live(trx))
              .first()
          : await trx(TABLE)
              .where(key)
              .select('owner_id', tokenColumn(trx), this.#live(trx))
              .first();

      if (!row) {
        try {
          await trx(TABLE).insert({
            ...key,
            owner_id: owner,
            token: '1',
            expires_at: this.#expiry(),
          });
        } catch (error) {
          if (
            (error as { code?: string })?.code === '23505' ||
            isUnique(error)
          ) {
            return undefined;
          }
          throw error;
        }
        return { namespace, owner, token: '1' };
      }

      const token = String(row.token);
      assertToken(token);

      if (row.live) {
        if (row.owner_id !== owner) return undefined;
        const updated = await trx(TABLE)
          .where({ ...key, owner_id: owner, token })
          .whereRaw(liveCondition(this.#dialect))
          .update({ expires_at: this.#expiry() });
        if (updated !== 1) return undefined;
        return { namespace, owner, token };
      }

      const successor = nextToken(token);
      const updated = await trx(TABLE)
        .where({ ...key, token })
        .whereRaw(`NOT (${liveCondition(this.#dialect)})`)
        .update({
          owner_id: owner,
          token: successor,
          expires_at: this.#expiry(),
        });
      if (updated !== 1) return undefined;

      return { namespace, owner, token: successor };
    });
  }

  async renew(fence: Fence): Promise<boolean> {
    assertFence(fence);
    const updated = await this.#db(TABLE)
      .where({
        ...keyOf(fence.namespace),
        owner_id: fence.owner,
        token: fence.token,
      })
      .whereRaw(liveCondition(this.#dialect))
      .update({ expires_at: this.#expiry() });
    return updated === 1;
  }

  async release(fence: Fence): Promise<void> {
    assertFence(fence);
    await this.#db(TABLE)
      .where({
        ...keyOf(fence.namespace),
        owner_id: fence.owner,
        token: fence.token,
      })
      .update({ expires_at: expiredNow(this.#db, this.#dialect) });
  }

  async enumerate(
    pluginId: string,
    cursor?: string,
  ): Promise<PageOfNamespaces> {
    if (typeof pluginId !== 'string' || pluginId.length === 0) {
      throw new TypeError('Invalid plugin ID');
    }
    const after =
      cursor === undefined
        ? undefined
        : decodeNamespaceCursor(cursor, pluginId);

    const query = this.#db(TABLE)
      .where('plugin_id', pluginId)
      .orderBy('session_id', 'asc')
      .limit(this.#pageSize + 1)
      .select('session_id');
    if (after !== undefined) query.where('session_id', '>', after);

    const rows: { session_id: string }[] = await query;
    const page = rows.slice(0, this.#pageSize);
    const last = page[page.length - 1];

    return {
      namespaces: page.map(row => ({
        pluginId,
        sessionId: row.session_id,
      })),
      next:
        rows.length > this.#pageSize && last
          ? encodeNamespaceCursor(pluginId, last.session_id)
          : undefined,
    };
  }
}

/**
 * Reads the token as text.
 *
 * @remarks
 *
 * SQLite hands a 64-bit integer to JavaScript as a double, which silently
 * rounds tokens beyond 2^53. Casting in SQL keeps the exact decimal string the
 * seam promises; PostgreSQL's `int8` is cast the same way for symmetry.
 */
function tokenColumn(executor: Knex | Knex.Transaction): Knex.Raw {
  return executor.raw('CAST(token AS TEXT) as token');
}

function isUnique(error: unknown): boolean {
  const message = (error as { message?: string })?.message ?? '';
  return /UNIQUE constraint failed|duplicate key value/i.test(message);
}

function assertFence(fence: Fence): void {
  assertNamespace(fence?.namespace);
  if (typeof fence.owner !== 'string' || fence.owner.length === 0) {
    throw new TypeError('Invalid lease owner');
  }
  assertToken(fence.token);
}

/**
 * Creates the Knex namespace lease adapter.
 *
 * @remarks
 *
 * Fails early when the lease table is missing, without acquiring anything, so a
 * misconfigured deployment cannot report working ownership.
 *
 * @internal
 */
export async function createKnexNamespaceLease(
  options: KnexNamespaceLeaseOptions,
): Promise<KnexNamespaceLease> {
  const dialect = dialectOf(options.db);
  const ttlMs = options.ttlMs ?? DEFAULT_TTL_MS;
  if (!Number.isSafeInteger(ttlMs) || ttlMs <= 0) {
    throw new Error('Lease lifetime must be positive milliseconds');
  }
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE;
  if (!Number.isSafeInteger(pageSize) || pageSize <= 0) {
    throw new Error('Lease enumeration page size must be positive');
  }
  await options.db(TABLE).select('token').limit(1);
  return new KnexNamespaceLease({ ...options, ttlMs, pageSize }, dialect);
}
