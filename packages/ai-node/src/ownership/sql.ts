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
import {
  TRANSIENT_SQL_CODES,
  leaseClock,
  leaseLiveSql,
} from '../storage/dialect-kit';

/**
 * Database-clock expressions shared by the lease and recovery adapters.
 *
 * @remarks
 *
 * These mirror the fence protocol fixed by the storage adapter
 * (`src/storage/knex.ts`): SQLite stores epoch milliseconds numerically, while
 * PostgreSQL uses `timestamptz` compared against `statement_timestamp()`, never
 * the transaction-start clock. Expiry is always decided by the database, never
 * by the process clock.
 *
 * @internal
 */
export type Dialect = 'sqlite' | 'pg';

export function dialectOf(db: Knex): Dialect {
  const client = String(db.client.config.client);
  if (client === 'better-sqlite3') return 'sqlite';
  if (['pg', 'postgres', 'postgresql'].includes(client)) return 'pg';
  throw new Error('Ownership requires PostgreSQL or better-sqlite3');
}

/** The single source of truth for "this lease row is currently live". */
export function liveCondition(dialect: Dialect): string {
  return leaseLiveSql(dialect);
}

/** An `expires_at` value at the current database time plus `ms`. */
export function expiryFromNow(
  db: Knex,
  _dialect: Dialect,
  ms: number,
): Knex.Raw {
  if (!Number.isSafeInteger(ms) || ms <= 0) {
    throw new Error(
      'Lease lifetime must be a positive integer of milliseconds',
    );
  }
  return leaseClock(db, ms);
}

/** An `expires_at` value at the current database time (already expired). */
export function expiredNow(db: Knex, _dialect: Dialect): Knex.Raw {
  return leaseClock(db);
}

const TOKEN_PATTERN = /^(0|[1-9][0-9]*)$/;

export function assertToken(token: string): void {
  if (typeof token !== 'string' || !TOKEN_PATTERN.test(token)) {
    throw new TypeError('Invalid lease token');
  }
}

/**
 * Increments a decimal lease token without JavaScript number precision loss.
 *
 * @internal
 */
export function nextToken(token: string): string {
  assertToken(token);
  return (BigInt(token) + 1n).toString();
}

/**
 * Runs one unit of work in its own transaction, retrying only before any
 * mutation outcome is known.
 *
 * @remarks
 *
 * A retry happens only after a rollback of a transaction that had not produced
 * a durable effect, so it can never duplicate a token bump or a lease takeover.
 */
export async function inTransaction<T>(
  db: Knex,
  action: (trx: Knex.Transaction) => Promise<T>,
  attempts = 5,
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    const trx = await db.transaction();
    let mutated = false;
    try {
      const result = await action(trx);
      mutated = true;
      await trx.commit();
      return result;
    } catch (error) {
      let rolledBack = false;
      if (!trx.isCompleted()) {
        try {
          await trx.rollback();
          rolledBack = true;
        } catch {
          /* The outcome is not known safe; do not retry. */
        }
      }
      const code = (error as { code?: string })?.code;
      if (
        !mutated &&
        rolledBack &&
        attempt < attempts - 1 &&
        TRANSIENT_SQL_CODES.includes(code ?? '')
      ) {
        await new Promise(resolve => setTimeout(resolve, 25 * 2 ** attempt));
        continue;
      }
      throw error;
    }
  }
}
