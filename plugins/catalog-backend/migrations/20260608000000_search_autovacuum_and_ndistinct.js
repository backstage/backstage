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
 * Tunes autovacuum thresholds on high-churn catalog tables and fixes
 * the `n_distinct` estimate on the `search` table.
 *
 * ## Autovacuum scale factors
 *
 * Several catalog tables experience high churn from entity stitching
 * and ingestion cycles. At the default
 * `autovacuum_vacuum_scale_factor` of 0.2, autovacuum only triggers
 * after 20% of the table changes. On large tables this allows the
 * visibility map to degrade enough that PostgreSQL avoids index-only
 * scans on covering indexes, falling back to sequential scans.
 *
 * This migration sets both scale factors to 0.01 on:
 *
 * - `search` (13.6M rows, ~28 rows per entity, full churn on stitch)
 * - `final_entities` (490K rows, updated on every stitch)
 * - `relations` (3.7M rows, deleted and re-inserted on stitch)
 * - `refresh_state_references` (490K rows, deleted and re-inserted
 *   on ingestion)
 *
 * This triggers autovacuum after ~1% of each table changes, keeping
 * the visibility map healthy and enabling index-only scans.
 *
 * ## n_distinct override (search table only)
 *
 * The default ANALYZE samples ~30K rows. With ~490K distinct
 * `entity_id` values in a 13.6M-row table, the sample consistently
 * underestimates `n_distinct` by ~12x (e.g. 38K estimated vs 490K
 * actual). This causes the planner to severely underestimate the
 * output of HashAggregate nodes in catalog list queries.
 *
 * Setting `n_distinct = -1` tells the planner to assume the column
 * has as many distinct values as there are rows. This is a slight
 * overestimate (the actual ratio is ~1:28), but it is far more
 * accurate than the sampled estimate and safe for planning purposes.
 *
 * ## Cost
 *
 * All operations are metadata-only (instant) on any table size.
 * They modify `pg_class.reloptions` and `pg_attribute.attoptions`
 * respectively — no table scan, no lock contention.
 *
 * MySQL and SQLite do not support these settings; this migration is a
 * no-op on those engines.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  if (!knex.client.config.client.includes('pg')) {
    return;
  }

  const tables = [
    'search',
    'final_entities',
    'relations',
    'refresh_state_references',
  ];

  for (const table of tables) {
    await knex.raw(
      `ALTER TABLE ?? SET (
        autovacuum_vacuum_scale_factor = 0.01,
        autovacuum_analyze_scale_factor = 0.01
      )`,
      [table],
    );
  }

  await knex.raw(
    `ALTER TABLE search ALTER COLUMN entity_id SET (n_distinct = -1)`,
  );
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  if (!knex.client.config.client.includes('pg')) {
    return;
  }

  const tables = [
    'search',
    'final_entities',
    'relations',
    'refresh_state_references',
  ];

  for (const table of tables) {
    await knex.raw(
      `ALTER TABLE ?? RESET (
        autovacuum_vacuum_scale_factor,
        autovacuum_analyze_scale_factor
      )`,
      [table],
    );
  }

  await knex.raw(
    `ALTER TABLE search ALTER COLUMN entity_id RESET (n_distinct)`,
  );
};
