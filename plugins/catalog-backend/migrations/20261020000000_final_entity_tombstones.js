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
 * Adds an informational `final_entities.deleted_at`. On PostgreSQL, also
 * replaces the cascade from `refresh_state` with a statement-level trigger
 * that asks the stitcher to reconcile every deleted ref. The stitcher then
 * tombstones the row and assigns it a generation.
 *
 * MySQL and SQLite keep the cascade for now, so their final rows are still
 * deleted together with the candidate and never become tombstones.
 *
 * DRAFT: this activates retained rows unconditionally. Older stitchers in a
 * rolling deployment assume that a final row's ID equals its candidate's ID,
 * so a real rollout needs an explicit mixed-version fence first.
 */

const foreignKeyName = 'final_entities_entity_id_foreign';
const functionName = 'catalog_enqueue_stitch_for_deleted_refresh_state';
const triggerName = 'refresh_state_stitch_enqueue';

/** @param {import('knex').Knex} knex */
const isPg = knex => knex.client.config.client === 'pg';

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  if (!(await knex.schema.hasColumn('final_entities', 'deleted_at'))) {
    await knex.schema.alterTable('final_entities', table => {
      table
        .dateTime('deleted_at')
        .nullable()
        .comment('When the entity was last tombstoned; informational only');
    });
  }

  if (!isPg(knex)) {
    return;
  }

  // Matches the application's enqueue contract: a new ticket and a reset
  // failure count, but an unchanged next_stitch_at for an existing row so
  // that an active lease is not stolen. refresh_state.entity_ref is unique,
  // so one statement cannot conflict on the same queue row twice.
  await knex.raw(`
    CREATE OR REPLACE FUNCTION ${functionName}()
    RETURNS trigger LANGUAGE plpgsql AS $$
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
  await knex.raw(
    `ALTER TABLE final_entities DROP CONSTRAINT IF EXISTS ${foreignKeyName}`,
  );
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  if (isPg(knex)) {
    // Rows without a matching candidate (tombstones and reused slots) cannot
    // satisfy the restored foreign key. Their search rows cascade with them.
    // A reused slot still has a live candidate, so ask for it to be stitched
    // again into a row keyed by the candidate's own ID.
    await knex.raw(`
      WITH removed AS (
        DELETE FROM final_entities
        WHERE NOT EXISTS (
          SELECT 1 FROM refresh_state
          WHERE refresh_state.entity_id = final_entities.entity_id
        )
        RETURNING entity_ref
      )
      INSERT INTO stitch_queue (entity_ref, stitch_ticket, failure_count, next_stitch_at)
      SELECT removed.entity_ref, gen_random_uuid()::text, 0, CURRENT_TIMESTAMP
      FROM removed
      JOIN refresh_state ON refresh_state.entity_ref = removed.entity_ref
      ON CONFLICT (entity_ref) DO UPDATE
        SET stitch_ticket = EXCLUDED.stitch_ticket,
            failure_count = 0
    `);
    await knex.raw(`
      ALTER TABLE final_entities
      ADD CONSTRAINT ${foreignKeyName}
      FOREIGN KEY (entity_id) REFERENCES refresh_state (entity_id)
      ON DELETE CASCADE
    `);
    await knex.raw(`DROP TRIGGER IF EXISTS ${triggerName} ON refresh_state`);
    await knex.raw(`DROP FUNCTION IF EXISTS ${functionName}()`);
  }

  if (await knex.schema.hasColumn('final_entities', 'deleted_at')) {
    await knex.schema.alterTable('final_entities', table => {
      table.dropColumn('deleted_at');
    });
  }
};
