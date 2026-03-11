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
 * Changes the search table's foreign key from refresh_state(entity_id)
 * to final_entities(entity_id). This allows search entries to reference
 * final entities directly, with CASCADE delete when entities are removed.
 *
 * For PostgreSQL and MySQL, the migration is structured to minimize lock
 * time on large tables by batch-deleting orphaned rows before any DDL.
 * PostgreSQL additionally uses NOT VALID / VALIDATE CONSTRAINT to keep
 * the AccessExclusiveLock duration minimal.
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  const client = knex.client.config.client;

  if (client.includes('pg')) {
    // Batch-delete orphaned rows BEFORE touching the schema.
    // This runs outside any DDL lock, so it doesn't block reads.
    for (;;) {
      const deleted = await knex.raw(`
        DELETE FROM "search"
        WHERE ctid IN (
          SELECT s.ctid FROM "search" s
          LEFT JOIN "final_entities" fe ON s."entity_id" = fe."entity_id"
          WHERE fe."entity_id" IS NULL
            AND s."entity_id" IS NOT NULL
          LIMIT 10000
        )
      `);
      if (deleted.rowCount === 0) {
        break;
      }
    }

    // Drop old FK and add new one with NOT VALID (minimal lock time).
    // NOT VALID skips the full table scan — we already cleaned up orphans above.
    await knex.raw(
      `ALTER TABLE "search" DROP CONSTRAINT IF EXISTS "search_entity_id_foreign"`,
    );
    await knex.raw(`
      ALTER TABLE "search"
      ADD CONSTRAINT "search_entity_id_foreign"
      FOREIGN KEY ("entity_id") REFERENCES "final_entities"("entity_id")
      ON DELETE CASCADE
      NOT VALID
    `);

    // Validate the FK separately. This only takes a
    // ShareUpdateExclusiveLock, which does NOT block reads/writes.
    await knex.raw(
      `ALTER TABLE "search" VALIDATE CONSTRAINT "search_entity_id_foreign"`,
    );
  } else if (client.includes('mysql')) {
    // Batch-delete orphaned rows before DDL to reduce lock time.
    // Uses LEFT JOIN to find orphans efficiently, then deletes by entity_id.
    // MySQL doesn't support LIMIT in multi-table DELETE, so we find the
    // orphaned entity_ids first, then delete in a separate statement.
    for (;;) {
      const [orphanIds] = await knex.raw(`
        SELECT DISTINCT s.\`entity_id\` FROM \`search\` s
        LEFT JOIN \`final_entities\` fe ON s.\`entity_id\` = fe.\`entity_id\`
        WHERE fe.\`entity_id\` IS NULL
          AND s.\`entity_id\` IS NOT NULL
        LIMIT 10000
      `);
      if (orphanIds.length === 0) {
        break;
      }
      const ids = orphanIds.map(
        (/** @type {{ entity_id: string }} */ r) => r.entity_id,
      );
      await knex('search').whereIn('entity_id', ids).delete();
    }

    // Drop old FK and add new one inside an explicit transaction, since the
    // global transaction wrapper is disabled for this migration. MySQL does
    // not support NOT VALID, but the table is already clean so validation
    // is fast.
    await knex.transaction(async trx => {
      await trx.schema.alterTable('search', table => {
        table.dropForeign(['entity_id']);
      });
      await trx.schema.alterTable('search', table => {
        table
          .foreign('entity_id')
          .references('entity_id')
          .inTable('final_entities')
          .onDelete('CASCADE');
      });
    });
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
    for (;;) {
      const deleted = await knex.raw(`
        DELETE FROM "search"
        WHERE ctid IN (
          SELECT s.ctid FROM "search" s
          LEFT JOIN "refresh_state" rs ON s."entity_id" = rs."entity_id"
          WHERE rs."entity_id" IS NULL
            AND s."entity_id" IS NOT NULL
          LIMIT 10000
        )
      `);
      if (deleted.rowCount === 0) {
        break;
      }
    }

    await knex.raw(
      `ALTER TABLE "search" DROP CONSTRAINT IF EXISTS "search_entity_id_foreign"`,
    );
    await knex.raw(`
      ALTER TABLE "search"
      ADD CONSTRAINT "search_entity_id_foreign"
      FOREIGN KEY ("entity_id") REFERENCES "refresh_state"("entity_id")
      ON DELETE CASCADE
      NOT VALID
    `);

    await knex.raw(
      `ALTER TABLE "search" VALIDATE CONSTRAINT "search_entity_id_foreign"`,
    );
  } else if (client.includes('mysql')) {
    for (;;) {
      const [orphanIds] = await knex.raw(`
        SELECT DISTINCT s.\`entity_id\` FROM \`search\` s
        LEFT JOIN \`refresh_state\` rs ON s.\`entity_id\` = rs.\`entity_id\`
        WHERE rs.\`entity_id\` IS NULL
          AND s.\`entity_id\` IS NOT NULL
        LIMIT 10000
      `);
      if (orphanIds.length === 0) {
        break;
      }
      const ids = orphanIds.map(
        (/** @type {{ entity_id: string }} */ r) => r.entity_id,
      );
      await knex('search').whereIn('entity_id', ids).delete();
    }

    await knex.transaction(async trx => {
      await trx.schema.alterTable('search', table => {
        table.dropForeign(['entity_id']);
      });
      await trx.schema.alterTable('search', table => {
        table
          .foreign('entity_id')
          .references('entity_id')
          .inTable('refresh_state')
          .onDelete('CASCADE');
      });
    });
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
