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

// @ts-check

/**
 * Creates extended multi-column statistics on (key, value) in the search
 * table. These statistics capture the correlation between `key` and `value`
 * columns, which the planner cannot infer from standard single-column
 * statistics alone. Without them, compound filter queries like
 * `WHERE key='kind' AND value='component'` get wildly underestimated
 * (e.g. 13 estimated vs 17,000 actual rows), causing the planner to
 * choose materialize-then-sort plans instead of LIMIT-short-circuit
 * index scans.
 *
 * ## What this creates
 *
 * On PostgreSQL 10+:
 *   CREATE STATISTICS search_key_value_stats (dependencies, ndistinct, mcv)
 *     ON key, value FROM search;
 *
 * - `dependencies`: tells the planner that `value` depends on `key`
 * - `ndistinct`: number of distinct (key, value) combinations
 * - `mcv`: most common (key, value) pairs with their actual frequencies
 *
 * ## Cost
 *
 * - **Creation**: `CREATE STATISTICS` is metadata-only (instant).
 * - **ANALYZE**: reads a sample of the table (~30k rows by default) to
 *   compute the statistics. Takes 2-4 seconds on a 14M-row table. This
 *   happens once on migration and then automatically during regular
 *   autovacuum analyze cycles.
 * - **Storage**: a few KB in `pg_statistic_ext_data` — negligible.
 * - **Maintenance**: autovacuum refreshes the statistics during its
 *   regular `ANALYZE` passes, just like single-column statistics.
 *   No manual maintenance needed.
 *
 * MySQL and SQLite do not support extended statistics; this migration
 * is a no-op on those engines.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  if (!knex.client.config.client.includes('pg')) {
    return;
  }

  const exists = await knex.raw(
    `SELECT 1 FROM pg_statistic_ext WHERE stxname = 'search_key_value_stats'`,
  );

  if (exists.rows.length > 0) {
    return;
  }

  await knex.raw(
    `CREATE STATISTICS search_key_value_stats (dependencies, ndistinct, mcv) ON key, value FROM search`,
  );

  await knex.raw(`ANALYZE search`);
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  if (!knex.client.config.client.includes('pg')) {
    return;
  }

  await knex.raw(`DROP STATISTICS IF EXISTS search_key_value_stats`);
};
