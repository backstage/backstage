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
 * Keeps planner statistics current on the high-churn `refresh_state` table.
 *
 * The table is updated continuously as entities are processed. On large
 * catalogs, PostgreSQL's default 20% threshold can therefore leave its row
 * count estimate far enough behind reality to produce poor orphan-cleanup
 * plans. A 1% threshold matches the other high-churn catalog tables.
 *
 * `ANALYZE` applies the setting immediately. MySQL and SQLite do not support
 * these settings, so this migration is a no-op on those engines.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  if (!knex.client.config.client.includes('pg')) {
    return;
  }

  await knex.raw(
    `ALTER TABLE refresh_state SET (
      autovacuum_vacuum_scale_factor = 0.01,
      autovacuum_analyze_scale_factor = 0.01
    )`,
  );
  await knex.raw(`ANALYZE refresh_state`);
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  if (!knex.client.config.client.includes('pg')) {
    return;
  }

  await knex.raw(
    `ALTER TABLE refresh_state RESET (
      autovacuum_vacuum_scale_factor,
      autovacuum_analyze_scale_factor
    )`,
  );
};

// Let ALTER TABLE commit before ANALYZE scans the table so that the
// AccessExclusiveLock is not held for the duration of the scan.
exports.config = {
  transaction: false,
};
