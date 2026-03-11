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

const BATCH_SIZE = 10000;

/**
 * Batch-deletes orphaned search rows whose entity_id doesn't exist in the
 * given reference table. Processes in chunks to avoid long locks.
 *
 * @param {import('knex').Knex} knex
 * @param {string} refTable - The table to check entity_id against
 */
async function batchDeleteOrphansPg(knex, refTable) {
  for (;;) {
    const deleted = await knex.raw(`
      DELETE FROM "search"
      WHERE ctid IN (
        SELECT s.ctid FROM "search" s
        LEFT JOIN "${refTable}" r ON s."entity_id" = r."entity_id"
        WHERE r."entity_id" IS NULL
          AND s."entity_id" IS NOT NULL
        LIMIT ${BATCH_SIZE}
      )
    `);
    if (deleted.rowCount === 0) {
      break;
    }
  }
}

/**
 * @param {import('knex').Knex} knex
 * @param {string} refTable
 */
async function batchDeleteOrphansMysql(knex, refTable) {
  for (;;) {
    const [orphanIds] = await knex.raw(`
      SELECT DISTINCT s.\`entity_id\` FROM \`search\` s
      LEFT JOIN \`${refTable}\` r ON s.\`entity_id\` = r.\`entity_id\`
      WHERE r.\`entity_id\` IS NULL
        AND s.\`entity_id\` IS NOT NULL
      LIMIT ${BATCH_SIZE}
    `);
    if (orphanIds.length === 0) {
      break;
    }
    const ids = orphanIds.map(
      (/** @type {{ entity_id: string }} */ r) => r.entity_id,
    );
    await knex('search').whereIn('entity_id', ids).delete();
  }
}

/**
 * Changes the search table's foreign key from refresh_state(entity_id)
 * to final_entities(entity_id). This allows search entries to reference
 * final entities directly, with CASCADE delete when entities are removed.
 *
 * On PostgreSQL, the migration first switches the foreign key to point at
 * final_entities using a single ALTER TABLE with a NOT VALID constraint,
 * then batch-deletes any pre-existing orphaned rows outside of DDL, and
 * finally VALIDATEs the constraint to keep the AccessExclusiveLock window
 * as short as possible.
 *
 * On MySQL, the migration batch-deletes orphaned rows in chunks around the
 * foreign key change to reduce lock time on large tables.
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  const client = knex.client.config.client;

  if (client.includes('pg')) {
    // Drop old FK and immediately add the new one as NOT VALID in a single
    // ALTER TABLE statement. This prevents new orphan rows from being
    // inserted while we clean up existing ones, and eliminates any window
    // where no FK exists at all.
    await knex.raw(`
      ALTER TABLE "search"
      DROP CONSTRAINT IF EXISTS "search_entity_id_foreign",
      ADD CONSTRAINT "search_entity_id_foreign"
      FOREIGN KEY ("entity_id") REFERENCES "final_entities"("entity_id")
      ON DELETE CASCADE
      NOT VALID
    `);

    // Batch-delete orphaned rows that existed before the NOT VALID FK was
    // added. This runs outside any DDL lock, so it doesn't block reads.
    await batchDeleteOrphansPg(knex, 'final_entities');

    // Validate the FK separately. This only takes a
    // ShareUpdateExclusiveLock, which does not block normal reads/writes
    // (DML) but can still conflict with some DDL or maintenance operations.
    await knex.raw(
      `ALTER TABLE "search" VALIDATE CONSTRAINT "search_entity_id_foreign"`,
    );
  } else if (client.includes('mysql')) {
    // Batch-delete orphaned rows before DDL to reduce lock time.
    await batchDeleteOrphansMysql(knex, 'final_entities');

    // Swap the FK with retry logic. MySQL DDL causes implicit commits so
    // DROP and ADD are never truly atomic. If new orphan rows sneak in
    // between the DROP and ADD, the ADD will fail — we clean up and retry.
    // The information_schema check makes the DROP idempotent so that
    // re-runs after a partial failure don't crash.
    const MAX_ATTEMPTS = 5;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const [fks] = await knex.raw(`
        SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'search'
          AND CONSTRAINT_NAME = 'search_entity_id_foreign'
          AND CONSTRAINT_TYPE = 'FOREIGN KEY'
      `);
      if (fks.length > 0) {
        await knex.schema.alterTable('search', table => {
          table.dropForeign(['entity_id']);
        });
      }

      await batchDeleteOrphansMysql(knex, 'final_entities');

      try {
        await knex.schema.alterTable('search', table => {
          table
            .foreign('entity_id')
            .references('entity_id')
            .inTable('final_entities')
            .onDelete('CASCADE');
        });
        break;
      } catch (e) {
        if (attempt === MAX_ATTEMPTS) throw e;
      }
    }
  } else {
    // SQLite: wrap in an explicit transaction since the global transaction
    // wrapper is disabled for this migration.
    await knex.transaction(async trx => {
      await trx.schema.alterTable('search', table => {
        table.dropForeign(['entity_id']);
      });

      await trx('search')
        .whereNotIn('entity_id', trx('final_entities').select('entity_id'))
        .delete();

      await trx.schema.alterTable('search', table => {
        table
          .foreign('entity_id')
          .references('entity_id')
          .inTable('final_entities')
          .onDelete('CASCADE');
      });
    });
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  const client = knex.client.config.client;

  if (client.includes('pg')) {
    await knex.raw(`
      ALTER TABLE "search"
      DROP CONSTRAINT IF EXISTS "search_entity_id_foreign",
      ADD CONSTRAINT "search_entity_id_foreign"
      FOREIGN KEY ("entity_id") REFERENCES "refresh_state"("entity_id")
      ON DELETE CASCADE
      NOT VALID
    `);

    await batchDeleteOrphansPg(knex, 'refresh_state');

    await knex.raw(
      `ALTER TABLE "search" VALIDATE CONSTRAINT "search_entity_id_foreign"`,
    );
  } else if (client.includes('mysql')) {
    await batchDeleteOrphansMysql(knex, 'refresh_state');

    const MAX_ATTEMPTS = 5;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const [fks] = await knex.raw(`
        SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'search'
          AND CONSTRAINT_NAME = 'search_entity_id_foreign'
          AND CONSTRAINT_TYPE = 'FOREIGN KEY'
      `);
      if (fks.length > 0) {
        await knex.schema.alterTable('search', table => {
          table.dropForeign(['entity_id']);
        });
      }

      await batchDeleteOrphansMysql(knex, 'refresh_state');

      try {
        await knex.schema.alterTable('search', table => {
          table
            .foreign('entity_id')
            .references('entity_id')
            .inTable('refresh_state')
            .onDelete('CASCADE');
        });
        break;
      } catch (e) {
        if (attempt === MAX_ATTEMPTS) throw e;
      }
    }
  } else {
    await knex.transaction(async trx => {
      await trx.schema.alterTable('search', table => {
        table.dropForeign(['entity_id']);
      });

      await trx('search')
        .whereNotIn('entity_id', trx('refresh_state').select('entity_id'))
        .delete();

      await trx.schema.alterTable('search', table => {
        table
          .foreign('entity_id')
          .references('entity_id')
          .inTable('refresh_state')
          .onDelete('CASCADE');
      });
    });
  }
};

// Disable the default transaction wrapper so the batched deletes run
// outside of the DDL transaction that holds AccessExclusiveLock.
exports.config = {
  transaction: false,
};
