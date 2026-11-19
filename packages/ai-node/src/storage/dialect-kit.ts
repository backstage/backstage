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

const isSqlite = (db: Knex) => db.client.config.client === 'better-sqlite3';

/**
 * The single definition of "this lease row is currently live".
 *
 * @remarks
 * Lease expiry is stored per dialect (millisecond epoch on SQLite, a timestamp
 * on PostgreSQL), so the liveness predicate itself is dialect-specific.
 *
 * @internal
 */
export const LEASE_LIVE_SQL: Readonly<Record<'sqlite' | 'pg', string>> =
  Object.freeze({
    sqlite:
      "CASE WHEN typeof(expires_at) IN ('integer', 'real') THEN expires_at > (julianday('now') - 2440587.5) * 86400000 ELSE julianday(expires_at) > julianday('now') END",
    pg: 'expires_at > statement_timestamp()',
  });

/** Live-lease predicate for one dialect. */
export function leaseLiveSql(dialect: 'sqlite' | 'pg'): string {
  return LEASE_LIVE_SQL[dialect];
}

/**
 * The lease clock: database time plus an optional millisecond offset, in the
 * representation `LEASE_LIVE_SQL` compares against.
 *
 * @internal
 */
export function leaseClock(db: Knex, offsetMs = 0): Knex.Raw {
  if (isSqlite(db)) {
    return offsetMs === 0
      ? db.raw("(julianday('now') - 2440587.5) * 86400000")
      : db.raw("(julianday('now') - 2440587.5) * 86400000 + ?", [offsetMs]);
  }
  return offsetMs === 0
    ? db.raw('statement_timestamp()')
    : db.raw("statement_timestamp() + (? * interval '1 millisecond')", [
        offsetMs,
      ]);
}

/**
 * Error codes that are worth retrying: the transaction lost no durable effect.
 *
 * @internal
 */
export const TRANSIENT_SQL_CODES: readonly string[] = Object.freeze([
  'SQLITE_BUSY',
  'SQLITE_LOCKED',
  '40001',
  '40P01',
]);

type LeaseKey = { plugin_id: string; session_id: string };

/** Lock first; PostgreSQL's statement clock must be read in a later query. */
export async function checkFence(
  trx: Knex.Transaction,
  key: LeaseKey,
  fence: { owner: string; token: string },
  error: string,
): Promise<void> {
  const expiry = leaseLiveSql(isSqlite(trx) ? 'sqlite' : 'pg');
  const row = await trx('ai_namespace_leases')
    .where(key)
    .where({ owner_id: fence.owner, token: fence.token })
    .whereRaw(expiry)
    .first('token');
  if (!row) throw new Error(error);
}

/** Retry only before preparation completes and after a confirmed rollback. */
export async function fencedTransaction<T, P>(
  db: Knex,
  key: LeaseKey,
  fence: { owner: string; token: string },
  errorMessage: string,
  prepare: (trx: Knex.Transaction) => Promise<P>,
  action: (trx: Knex.Transaction, prepared: P) => Promise<T>,
  options: { beforeLock?: () => void; retryPreparation?: boolean } = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const trx = await db.transaction();
    let locked = false;
    let committing = false;
    try {
      options.beforeLock?.();
      if (isSqlite(trx)) {
        await trx('ai_namespace_leases')
          .where(key)
          .update({ owner_id: trx.raw('owner_id') });
      } else {
        await trx('ai_namespace_leases').where(key).forUpdate().first();
      }
      if (!options.retryPreparation) locked = true;
      await checkFence(trx, key, fence, errorMessage);
      const prepared = await prepare(trx);
      locked = true;
      const result = await action(trx, prepared);
      committing = true;
      await trx.commit();
      return result;
    } catch (error) {
      let rolledBack = false;
      if (!trx.isCompleted()) {
        try {
          await trx.rollback();
          rolledBack = true;
        } catch {
          /* The outcome is not known safe. */
        }
      }
      const code = (error as { code?: string })?.code;
      if (
        !committing &&
        !locked &&
        rolledBack &&
        attempt < 3 &&
        TRANSIENT_SQL_CODES.includes(code ?? '')
      ) {
        await new Promise(resolve => setTimeout(resolve, 50 * 2 ** attempt));
        continue;
      }
      throw error;
    }
  }
}

/** Preserve the existing timestamp representation for each database. */
export function dbNow(db: Knex): Knex.Raw {
  return isSqlite(db)
    ? db.raw("strftime('%Y-%m-%dT%H:%M:%fZ', 'now')")
    : db.fn.now();
}

/** Cast in SQL before a 64-bit value crosses the driver boundary. */
export function bigintText(db: Knex, column: string): Knex.Raw {
  return db.raw('CAST(?? AS TEXT) AS ??', [column, column]);
}
