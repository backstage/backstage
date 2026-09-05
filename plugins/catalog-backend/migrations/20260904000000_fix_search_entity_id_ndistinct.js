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
 * Corrects the `n_distinct` override for `search.entity_id`.
 *
 * The previous value of `-1` tells PostgreSQL that every row has a distinct
 * entity ID. In practice, the search table contains many rows per entity,
 * causing the planner to underestimate the number of entities matching
 * catalog filters.
 *
 * The grouped query computes the exact fraction of distinct entity IDs while
 * taking advantage of the index whose leading column is `entity_id`. Using a
 * negative fraction allows PostgreSQL to scale the estimate as the table
 * grows. Empty tables use PostgreSQL's normal estimation instead.
 *
 * `ANALYZE` applies the override immediately and refreshes the extended search
 * statistics. On large catalogs, both the grouped query and `ANALYZE` scan a
 * sample or index data and can take several seconds.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  if (!knex.client.config.client.includes('pg')) {
    return;
  }

  const result = await knex.raw(
    `SELECT -NULLIF(
              COUNT(*) FILTER (WHERE entity_id IS NOT NULL),
              0
            )::double precision /
              NULLIF(SUM(rows_per_entity), 0) AS n_distinct
     FROM (
       SELECT entity_id, COUNT(*) AS rows_per_entity
       FROM search
       GROUP BY entity_id
     ) AS grouped_search`,
  );
  const nDistinct = result.rows[0]?.n_distinct;

  if (nDistinct === null) {
    await knex.raw(
      `ALTER TABLE search ALTER COLUMN entity_id RESET (n_distinct)`,
    );
  } else if (
    typeof nDistinct === 'number' &&
    Number.isFinite(nDistinct) &&
    nDistinct >= -1 &&
    nDistinct < 0
  ) {
    await knex.raw(
      `ALTER TABLE search
       ALTER COLUMN entity_id SET (n_distinct = ${nDistinct})`,
    );
  } else {
    throw new Error(`Invalid n_distinct value calculated: ${nDistinct}`);
  }

  await knex.raw(`ANALYZE search`);
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  if (!knex.client.config.client.includes('pg')) {
    return;
  }

  await knex.raw(
    `ALTER TABLE search ALTER COLUMN entity_id SET (n_distinct = -1)`,
  );
  await knex.raw(`ANALYZE search`);
};

// Let ALTER TABLE commit before ANALYZE scans the table so that the
// AccessExclusiveLock is not held for the duration of the scan.
exports.config = {
  transaction: false,
};
