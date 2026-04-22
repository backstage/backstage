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

import { LoggerService } from '@backstage/backend-plugin-api';
import { isError } from '@backstage/errors';
import { Knex } from 'knex';

// Stable lock key for the pg_advisory_lock two-argument form.
const LOCK_NAMESPACE = 202604;
const LOCK_ID = 15;

/**
 * Minimal interface for a raw PostgreSQL connection, as returned by the Knex
 * pool's acquireConnection(). Avoids importing `pg` types directly.
 */
interface PgConnection {
  query(text: string, values?: any[]): Promise<{ rows: Record<string, any>[] }>;
}

interface DeferredIndex {
  name: string;
  columns: string[];
  where?: string;
}

const DEFERRED_INDICES: DeferredIndex[] = [
  {
    name: 'search_entity_key_value_idx',
    columns: ['entity_id', 'key', 'value'],
  },
  {
    name: 'search_key_value_entity_idx',
    columns: ['key', 'value', 'entity_id'],
  },
  {
    name: 'search_facets_covering_idx',
    columns: ['key', 'original_value', 'entity_id'],
    where: 'WHERE original_value IS NOT NULL',
  },
];

const SUPERSEDED_INDICES = [
  'search_key_value_idx',
  'search_key_original_value_idx',
];

/**
 * Creates covering indices on the `search` table in the background, designed
 * to run after service startup without blocking readiness. This helper is
 * PostgreSQL-specific and uses `CREATE INDEX CONCURRENTLY` with advisory
 * locking to coordinate across multiple pods. On other engines, index creation
 * happens inline in the migration rather than through this helper.
 *
 * @remarks
 *
 * All PostgreSQL operations run on a single dedicated connection acquired from
 * the pool, ensuring that the session-level advisory lock, statement timeout,
 * and DDL statements all share the same session. When finished, the connection
 * is released back to the pool after releasing the advisory lock and resetting
 * `statement_timeout`; if the pod dies, the session terminates and PostgreSQL
 * auto-releases the lock and cancels any in-flight DDL.
 *
 * This function is intentionally fire-and-forget from the caller's perspective.
 * Failures are logged but do not prevent the service from operating — the
 * indices are a performance optimization, not a correctness requirement.
 */
export async function ensureDeferredIndices(
  knex: Knex,
  logger?: LoggerService,
): Promise<void> {
  const client = knex.client.config.client;
  if (client !== 'pg') {
    return;
  }

  const log = logger?.child({ task: 'deferred-indices' });
  const startTime = Date.now();

  log?.info('Attempting to create deferred search indices');

  // Acquire a dedicated connection from the pool so that advisory lock,
  // session settings, and DDL all execute on the same PostgreSQL session.
  // This is critical: Knex's normal knex.raw() picks a random connection
  // from the pool each time, which would cause the advisory lock to be
  // acquired on one connection while DDL runs on another.
  let conn: PgConnection;
  try {
    conn = await knex.client.acquireConnection();
  } catch (error) {
    log?.warn(
      'Failed to acquire database connection for deferred index creation',
      isError(error) ? error : undefined,
    );
    return;
  }

  try {
    // Skip on read replicas — indices replicate from the primary automatically
    // via streaming replication. pg_is_in_recovery() returns true on standbys.
    const recoveryResult = await conn.query('SELECT pg_is_in_recovery() AS ro');
    if (recoveryResult.rows[0].ro) {
      log?.debug(
        'Connected to a read replica (standby), skipping deferred index creation',
      );
      return;
    }

    const lockResult = await conn.query(
      'SELECT pg_try_advisory_lock($1, $2) AS locked',
      [LOCK_NAMESPACE, LOCK_ID],
    );

    if (!lockResult.rows[0].locked) {
      log?.info(
        'Another instance is already creating deferred indices, skipping',
      );
      return;
    }

    try {
      await conn.query('SET statement_timeout = 3600000');

      for (const index of DEFERRED_INDICES) {
        await ensureIndex(conn, index, log);
      }

      for (const name of SUPERSEDED_INDICES) {
        await dropSupersededIndex(conn, name, log);
      }

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      log?.info(`Deferred index creation completed in ${elapsed}s`);
    } finally {
      // Release the advisory lock and reset statement_timeout to the server
      // default before returning the connection to the pool. If the connection
      // is dead these will fail harmlessly — PostgreSQL auto-releases advisory
      // locks and resets session state when the session terminates.
      await conn
        .query('SELECT pg_advisory_unlock($1, $2)', [LOCK_NAMESPACE, LOCK_ID])
        .catch(() => {});
      await conn.query('RESET statement_timeout').catch(() => {});
    }
  } finally {
    await knex.client.releaseConnection(conn);
  }
}

async function getIndexState(
  conn: PgConnection,
  indexName: string,
): Promise<'valid' | 'invalid' | 'missing'> {
  const result = await conn.query(
    `SELECT i.indisvalid
       FROM pg_index i
      WHERE i.indexrelid = to_regclass($1)`,
    [indexName],
  );

  if (result.rows.length === 0) {
    return 'missing';
  }

  return result.rows[0].indisvalid ? 'valid' : 'invalid';
}

async function ensureIndex(
  conn: PgConnection,
  index: DeferredIndex,
  log?: LoggerService,
): Promise<void> {
  const state = await getIndexState(conn, index.name);

  if (state === 'valid') {
    log?.debug(`Index ${index.name} already exists and is valid, skipping`);
    return;
  }

  if (state === 'invalid') {
    log?.warn(
      `Index ${index.name} exists but is INVALID (likely from an interrupted creation), dropping and recreating`,
    );
    await conn.query(`DROP INDEX CONCURRENTLY IF EXISTS ${index.name}`);
  }

  log?.info(`Creating index ${index.name} concurrently`);
  const columnExpr = `(${index.columns.join(', ')})`;
  const whereClause = index.where ? ` ${index.where}` : '';
  await conn.query(
    `CREATE INDEX CONCURRENTLY IF NOT EXISTS ${index.name} ON search ${columnExpr}${whereClause}`,
  );
  log?.info(`Index ${index.name} created successfully`);
}

async function dropSupersededIndex(
  conn: PgConnection,
  name: string,
  log?: LoggerService,
): Promise<void> {
  const state = await getIndexState(conn, name);
  if (state === 'missing') {
    return;
  }

  log?.info(`Dropping superseded index ${name}`);
  await conn.query(`DROP INDEX CONCURRENTLY IF EXISTS ${name}`);
}
