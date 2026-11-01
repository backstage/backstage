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
 * Lets final entity rows outlive their candidate as tombstones.
 *
 * Adds an informational `final_entities.deleted_at`, and replaces the cascade
 * from `refresh_state` with a deletion trigger that asks the stitcher to
 * reconcile every deleted ref. The stitcher then tombstones the row and
 * assigns it a generation. PostgreSQL uses one statement-level trigger per
 * deletion; MySQL and SQLite only have row-level triggers, which is slower
 * for wide deletions but has the same effect.
 *
 * The trigger is always created before the foreign key is dropped, so that a
 * failed or partial run never leaves deletions untracked. Each step skips
 * work that is already done, so a failed run can simply be retried.
 *
 * DRAFT: this activates retained rows unconditionally. Older stitchers in a
 * rolling deployment assume that a final row's ID equals its candidate's ID,
 * so a real rollout needs an explicit mixed-version fence first.
 */

const { randomUUID } = require('node:crypto');

const foreignKeyName = 'final_entities_entity_id_foreign';
const functionName = 'catalog_enqueue_stitch_for_deleted_refresh_state';
const triggerName = 'refresh_state_stitch_enqueue';

/** @param {import('knex').Knex} knex */
const isPg = knex => knex.client.config.client === 'pg';

/** @param {import('knex').Knex} knex */
const isMysql = knex => String(knex.client.config.client).includes('mysql');

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  if (isPg(knex)) {
    await knex.transaction(async tx => {
      // Every step is quick, but adding the column, creating the trigger and
      // dropping the foreign key all need strong locks on busy tables. Fail
      // rather than queue behind long-running queries and block everything
      // else that is waiting on those tables.
      await tx.raw("SET LOCAL lock_timeout = '5s'");
      await addDeletedAtColumn(tx);
      await createPostgresTrigger(tx);
      for (const name of await findPostgresForeignKeys(tx)) {
        await tx.raw('ALTER TABLE final_entities DROP CONSTRAINT ??', [name]);
      }
    });
    return;
  }

  await addDeletedAtColumn(knex);

  if (isMysql(knex)) {
    // Matches the application's enqueue contract, as on PostgreSQL. Triggers
    // are not fired by foreign key actions in MySQL, but nothing cascades into
    // refresh_state. An existing trigger is kept: on a retry after the
    // foreign key is gone it is all that tracks deletions, and these
    // statements don't run in a transaction.
    const [existing] = await knex.raw(
      'SELECT 1 FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = DATABASE() AND TRIGGER_NAME = ?',
      [triggerName],
    );
    if (!existing.length) {
      await knex.raw(`
      CREATE TRIGGER ${triggerName}
      AFTER DELETE ON refresh_state
      FOR EACH ROW
      INSERT INTO stitch_queue (entity_ref, stitch_ticket, failure_count, next_stitch_at)
      VALUES (OLD.entity_ref, UUID(), 0, CURRENT_TIMESTAMP)
      ON DUPLICATE KEY UPDATE
        stitch_ticket = VALUES(stitch_ticket),
        failure_count = 0
    `);
    }
    for (const name of await findMysqlForeignKeys(knex)) {
      await knex.raw('ALTER TABLE final_entities DROP FOREIGN KEY ??', [name]);
    }
    return;
  }

  // As on MySQL, an existing trigger is kept
  await knex.raw(`
    CREATE TRIGGER IF NOT EXISTS ${triggerName}
    AFTER DELETE ON refresh_state
    FOR EACH ROW
    BEGIN
      INSERT INTO stitch_queue (entity_ref, stitch_ticket, failure_count, next_stitch_at)
      VALUES (OLD.entity_ref, lower(hex(randomblob(16))), 0, CURRENT_TIMESTAMP)
      ON CONFLICT (entity_ref) DO UPDATE SET
        stitch_ticket = excluded.stitch_ticket,
        failure_count = 0;
    END
  `);
  if (await hasSqliteForeignKey(knex)) {
    // SQLite cannot drop a foreign key, so Knex rebuilds the table. That is
    // only safe outside a transaction, where Knex can turn off foreign key
    // enforcement; otherwise dropping the old table would cascade into the
    // search table. This is why the migration runs without a transaction.
    await knex.schema.alterTable('final_entities', table => {
      table.dropForeign(['entity_id']);
    });
  }
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  if (isPg(knex)) {
    await knex.transaction(async tx => {
      await removeUnmatchedFinalEntities(tx);
      if (!(await findPostgresForeignKeys(tx)).length) {
        await tx.raw(`
          ALTER TABLE final_entities
          ADD CONSTRAINT ${foreignKeyName}
          FOREIGN KEY (entity_id) REFERENCES refresh_state (entity_id)
          ON DELETE CASCADE
        `);
      }
      await tx.raw(`DROP TRIGGER IF EXISTS ${triggerName} ON refresh_state`);
      await tx.raw(`DROP FUNCTION IF EXISTS ${functionName}()`);
      await dropDeletedAtColumn(tx);
    });
    return;
  }

  await removeUnmatchedFinalEntities(knex);
  const hasForeignKey = isMysql(knex)
    ? (await findMysqlForeignKeys(knex)).length > 0
    : await hasSqliteForeignKey(knex);
  if (!hasForeignKey) {
    await knex.schema.alterTable('final_entities', table => {
      table
        .foreign('entity_id')
        .references('entity_id')
        .inTable('refresh_state')
        .onDelete('CASCADE');
    });
  }
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggerName}`);
  await dropDeletedAtColumn(knex);
};

exports.config = { transaction: false };

/** @param {import('knex').Knex} knex */
async function addDeletedAtColumn(knex) {
  if (!(await knex.schema.hasColumn('final_entities', 'deleted_at'))) {
    await knex.schema.alterTable('final_entities', table => {
      table
        .dateTime('deleted_at')
        .nullable()
        .comment('When the entity was last tombstoned; informational only');
    });
  }
}

/** @param {import('knex').Knex} knex */
async function dropDeletedAtColumn(knex) {
  if (await knex.schema.hasColumn('final_entities', 'deleted_at')) {
    await knex.schema.alterTable('final_entities', table => {
      table.dropColumn('deleted_at');
    });
  }
}

/** @param {import('knex').Knex} knex */
async function createPostgresTrigger(knex) {
  // Matches the application's enqueue contract: a new ticket and a reset
  // failure count, but an unchanged next_stitch_at for an existing row so
  // that an active lease is not stolen. refresh_state.entity_ref is unique,
  // so one statement cannot conflict on the same queue row twice.
  await knex.raw(`
    CREATE OR REPLACE FUNCTION ${functionName}()
    RETURNS trigger LANGUAGE plpgsql
    -- Resolve stitch_queue in this plugin's schema, whatever the deleting
    -- session's search_path is.
    SET search_path FROM CURRENT
    AS $$
    BEGIN
      INSERT INTO stitch_queue (entity_ref, stitch_ticket, failure_count, next_stitch_at)
      SELECT entity_ref, gen_random_uuid()::text, 0, CURRENT_TIMESTAMP
      FROM deleted_rows
      ORDER BY entity_ref
      ON CONFLICT (entity_ref) DO UPDATE
        SET stitch_ticket = EXCLUDED.stitch_ticket,
            failure_count = 0;
      RETURN NULL;
    END $$
  `);
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggerName} ON refresh_state`);
  await knex.raw(`
    CREATE TRIGGER ${triggerName}
    AFTER DELETE ON refresh_state
    REFERENCING OLD TABLE AS deleted_rows
    FOR EACH STATEMENT
    EXECUTE FUNCTION ${functionName}()
  `);
}

/**
 * Looks the constraint up rather than relying on its generated name.
 *
 * @param {import('knex').Knex} knex
 * @returns {Promise<string[]>}
 */
async function findPostgresForeignKeys(knex) {
  const { rows } = await knex.raw(
    `SELECT con.conname
     FROM pg_constraint con
     JOIN pg_class rel ON rel.oid = con.conrelid
     JOIN pg_class ref ON ref.oid = con.confrelid
     JOIN pg_namespace n ON n.oid = rel.relnamespace
     WHERE con.contype = 'f'
       AND n.nspname = current_schema()
       AND rel.relname = 'final_entities'
       AND ref.relname = 'refresh_state'`,
  );
  return rows.map((/** @type {{ conname: string }} */ row) => row.conname);
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<string[]>}
 */
async function findMysqlForeignKeys(knex) {
  const [rows] = await knex.raw(
    `SELECT CONSTRAINT_NAME AS name
     FROM information_schema.REFERENTIAL_CONSTRAINTS
     WHERE CONSTRAINT_SCHEMA = DATABASE()
       AND TABLE_NAME = 'final_entities'
       AND REFERENCED_TABLE_NAME = 'refresh_state'`,
  );
  return rows.map((/** @type {{ name: string }} */ row) => row.name);
}

/** @param {import('knex').Knex} knex */
async function hasSqliteForeignKey(knex) {
  const rows = await knex.raw("PRAGMA foreign_key_list('final_entities')");
  return rows.some(
    (/** @type {{ table: string }} */ row) => row.table === 'refresh_state',
  );
}

/**
 * Rows without a matching candidate (tombstones and reused slots) cannot
 * satisfy the restored foreign key. Their search rows cascade with them. A
 * reused slot still has a live candidate, so ask for it to be stitched again
 * into a row keyed by the candidate's own ID.
 *
 * @param {import('knex').Knex} knex
 */
async function removeUnmatchedFinalEntities(knex) {
  const refs = await knex('final_entities')
    .whereNotExists(
      knex('refresh_state')
        .select(knex.raw('1'))
        .whereRaw('refresh_state.entity_id = final_entities.entity_id'),
    )
    .pluck('entity_ref');
  // Chunked to stay within bound parameter limits.
  for (let i = 0; i < refs.length; i += 500) {
    const chunk = refs.slice(i, i + 500);
    await knex('final_entities').whereIn('entity_ref', chunk).delete();
    const live = await knex('refresh_state')
      .whereIn('entity_ref', chunk)
      .pluck('entity_ref');
    if (live.length) {
      await knex('stitch_queue')
        .insert(
          live.map(entityRef => ({
            entity_ref: entityRef,
            stitch_ticket: randomUUID(),
            failure_count: 0,
            next_stitch_at: knex.fn.now(),
          })),
        )
        .onConflict('entity_ref')
        .merge(['stitch_ticket', 'failure_count']);
    }
  }
}
