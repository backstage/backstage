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

/*
 * Prepares the performance dataset before the test suites run, so that
 * parallel Jest workers only ever read it or copy it.
 *
 * For each id in PERFORMANCE_DATABASE_IDS, on the server given by
 * BACKSTAGE_TEST_DATABASE_<ID>_CONNECTION_STRING, this:
 *
 * 1. migrates the template database and seeds it with
 *    PERFORMANCE_DATASET_SIZE entities, unless its marker already matches;
 * 2. closes the template to connections, so it can be copied while tests run;
 * 3. turns autovacuum off for the template's tables, so that statistics and
 *    page visibility stay as they were when the dataset was prepared;
 * 4. if the template changed, or has no statistics, runs ANALYZE with a high
 *    statistics target. A template restored from a Postgres 18 dump keeps the
 *    statistics from the dump, so that plans are the same between runs;
 * 5. recreates the read copy if it is stale, and prewarms its tables and
 *    indexes with pg_prewarm.
 *
 * Run it from the repository root, while no tests are running:
 *
 *   node --require @backstage/cli/config/nodeTransform.cjs \
 *     plugins/catalog-backend/src/tests/performance/lib/preloadDataset.ts
 */

// Only used by performance tests, which run with dev dependencies available
// eslint-disable-next-line @backstage/no-undeclared-imports
import type { TestDatabaseId } from '@backstage/backend-test-utils';
import { ForwardedError } from '@backstage/errors';
import knexFactory, { Knex } from 'knex';
import { applyDatabaseMigrations } from '../../../database/migrations';
import {
  CLONE_DATABASE_PREFIX,
  DATASET_DATABASE,
  TEMPLATE_DATABASE,
  createDatabaseFromTemplate,
  disableJit,
  getDatasetSize,
  getPerformanceDatabaseIds,
  markerMatches,
  readDatasetMarker,
  seedDataset,
  serverConnection,
} from './dataset';

function log(databaseId: TestDatabaseId, message: string) {
  process.stdout.write(`[${databaseId}] ${message}\n`);
}

async function databaseExists(admin: Knex, name: string): Promise<boolean> {
  const row = await admin('pg_database').where('datname', name).first();
  return Boolean(row);
}

/** Runs `fn` with a connection to `database`, closing it afterwards. */
async function withDatabase<T>(
  databaseId: TestDatabaseId,
  database: string,
  fn: (knex: Knex) => Promise<T>,
): Promise<T> {
  const knex = knexFactory({
    client: 'pg',
    connection: serverConnection(databaseId, database),
  });
  try {
    return await fn(knex);
  } finally {
    await knex.destroy();
  }
}

/** Drops copies left behind by test runs that didn't clean up. */
async function dropLeftoverClones(databaseId: TestDatabaseId, admin: Knex) {
  const rows = await admin('pg_database')
    .where('datname', 'like', `${CLONE_DATABASE_PREFIX}%`)
    .select('datname');
  for (const { datname } of rows) {
    log(databaseId, `Dropping leftover copy ${datname}`);
    try {
      await admin.raw('DROP DATABASE ??', [datname]);
    } catch (error) {
      throw new ForwardedError(
        `Could not drop leftover copy ${datname}; make sure no performance tests are running`,
        error,
      );
    }
  }
}

// Sampling more rows makes the statistics, and the plans chosen from them,
// much less dependent on which rows ANALYZE happened to sample
const STATISTICS_TARGET = 1000;

async function hasStatistics(knex: Knex): Promise<boolean> {
  const row = await knex('pg_stats')
    .where({ schemaname: 'public', tablename: 'search' })
    .first();
  return Boolean(row);
}

async function disableAutovacuum(knex: Knex) {
  const tables = await knex('pg_tables')
    .where('schemaname', 'public')
    .select('tablename');
  for (const { tablename } of tables) {
    await knex.raw(
      'ALTER TABLE ?? SET (autovacuum_enabled = false, toast.autovacuum_enabled = false)',
      [tablename],
    );
  }
}

async function analyze(knex: Knex) {
  await knex.transaction(async trx => {
    await trx.raw(`SELECT set_config('default_statistics_target', ?, true)`, [
      String(STATISTICS_TARGET),
    ]);
    await trx.raw('ANALYZE');
  });
}

/** Loads every table and index of the dataset into the buffer cache. */
async function prewarm(databaseId: TestDatabaseId, knex: Knex) {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS pg_prewarm');
  const { rows } = await knex.raw<{ rows: { prewarmed: string }[] }>(
    `SELECT pg_prewarm(c.oid) AS prewarmed
     FROM pg_class c
     JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname IN ('public', 'pg_toast') AND c.relkind IN ('r', 'i', 't')`,
  );
  const blocks = rows.reduce((sum, r) => sum + Number(r.prewarmed), 0);
  log(databaseId, `Prewarmed ${blocks} blocks of ${DATASET_DATABASE}`);
}

/** Migrates and seeds the template. Returns whether it changed. */
async function prepareTemplate(
  databaseId: TestDatabaseId,
  template: Knex,
  size: number,
): Promise<boolean> {
  const versionBefore = await template.migrate.currentVersion();
  await applyDatabaseMigrations(template);
  const migrated = versionBefore !== (await template.migrate.currentVersion());

  if (markerMatches(await readDatasetMarker(template), size)) {
    log(databaseId, `${TEMPLATE_DATABASE} already holds ${size} entities`);
    return migrated;
  }
  log(databaseId, `Seeding ${TEMPLATE_DATABASE} with ${size} entities`);
  const startedAt = Date.now();
  await seedDataset(template, size);
  log(databaseId, `Seeded in ${Math.round((Date.now() - startedAt) / 1000)}s`);
  return true;
}

async function preload(databaseId: TestDatabaseId, size: number) {
  const admin = knexFactory({
    client: 'pg',
    connection: serverConnection(databaseId, 'postgres'),
  });
  try {
    await dropLeftoverClones(databaseId, admin);

    if (await databaseExists(admin, TEMPLATE_DATABASE)) {
      await admin.raw('ALTER DATABASE ?? WITH ALLOW_CONNECTIONS true', [
        TEMPLATE_DATABASE,
      ]);
    } else {
      await admin.raw('CREATE DATABASE ??', [TEMPLATE_DATABASE]);
    }

    const templateChanged = await withDatabase(
      databaseId,
      TEMPLATE_DATABASE,
      template => prepareTemplate(databaseId, template, size),
    );
    const copyIsCurrent =
      !templateChanged &&
      (await databaseExists(admin, DATASET_DATABASE)) &&
      markerMatches(
        await withDatabase(databaseId, DATASET_DATABASE, readDatasetMarker),
        size,
      );

    await disableJit(admin, TEMPLATE_DATABASE);
    await withDatabase(databaseId, TEMPLATE_DATABASE, async template => {
      await disableAutovacuum(template);
      // Statistics are copied along with the data. Dumps from before
      // Postgres 18 have none, so those are analyzed after a restore.
      if (templateChanged || !(await hasStatistics(template))) {
        log(databaseId, `Analyzing ${TEMPLATE_DATABASE}`);
        await analyze(template);
      } else {
        log(databaseId, `Keeping the statistics of ${TEMPLATE_DATABASE}`);
      }
    });

    // Postgres only copies a template that nothing is connected to. Refusing
    // connections keeps it that way while the tests copy it.
    await admin.raw('ALTER DATABASE ?? WITH ALLOW_CONNECTIONS false', [
      TEMPLATE_DATABASE,
    ]);

    if (copyIsCurrent) {
      log(databaseId, `${DATASET_DATABASE} is up to date`);
    } else {
      log(databaseId, `Creating ${DATASET_DATABASE} from ${TEMPLATE_DATABASE}`);
      try {
        await admin.raw('DROP DATABASE IF EXISTS ??', [DATASET_DATABASE]);
        await createDatabaseFromTemplate(
          admin,
          DATASET_DATABASE,
          TEMPLATE_DATABASE,
        );
      } catch (error) {
        throw new ForwardedError(
          `Could not recreate ${DATASET_DATABASE}; make sure no performance tests are running`,
          error,
        );
      }
    }
    await withDatabase(databaseId, DATASET_DATABASE, knex =>
      prewarm(databaseId, knex),
    );
  } finally {
    await admin.destroy();
  }
}

async function main() {
  const size = getDatasetSize();
  for (const databaseId of getPerformanceDatabaseIds()) {
    await preload(databaseId, size);
  }
}

main().catch(error => {
  process.stderr.write(`${error.stack ?? error}\n`);
  process.exit(1);
});
