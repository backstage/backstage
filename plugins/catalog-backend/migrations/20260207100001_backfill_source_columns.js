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
 * Backfills source_type and source_key columns from refresh_state_references table,
 * then makes the columns NOT NULL.
 *
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function up(knex) {
  // Backfill from refresh_state_references
  // For each entity in refresh_state, find the corresponding reference and populate source columns
  if (knex.client.config.client.includes('pg')) {
    // PostgreSQL supports UPDATE ... FROM syntax
    await knex.raw(`
      UPDATE refresh_state
      SET
        source_type = CASE
          WHEN rsr.source_key IS NOT NULL THEN 'provider'
          ELSE 'entity'
        END,
        source_key = COALESCE(rsr.source_key, rsr.source_entity_ref),
        created_at = COALESCE(refresh_state.created_at, refresh_state.last_discovery_at)
      FROM refresh_state_references rsr
      WHERE rsr.target_entity_ref = refresh_state.entity_ref
        AND refresh_state.source_type IS NULL
    `);
  } else if (knex.client.config.client.includes('mysql')) {
    // MySQL uses JOIN syntax for UPDATE
    await knex.raw(`
      UPDATE refresh_state rs
      JOIN refresh_state_references rsr ON rsr.target_entity_ref = rs.entity_ref
      SET
        rs.source_type = CASE
          WHEN rsr.source_key IS NOT NULL THEN 'provider'
          ELSE 'entity'
        END,
        rs.source_key = COALESCE(rsr.source_key, rsr.source_entity_ref),
        rs.created_at = COALESCE(rs.created_at, rs.last_discovery_at)
      WHERE rs.source_type IS NULL
    `);
  } else {
    // SQLite - need to do this in chunks to avoid table lock issues
    const rows = await knex('refresh_state')
      .whereNull('source_type')
      .select('entity_ref');

    for (const row of rows) {
      const ref = await knex('refresh_state_references')
        .where('target_entity_ref', row.entity_ref)
        .first();

      if (ref) {
        await knex('refresh_state')
          .where('entity_ref', row.entity_ref)
          .update({
            source_type: ref.source_key ? 'provider' : 'entity',
            source_key: ref.source_key || ref.source_entity_ref,
            created_at: knex.raw('COALESCE(created_at, last_discovery_at)'),
          });
      }
    }
  }

  // Handle any orphaned entities (no reference but still in refresh_state)
  // These would have been from providers that are no longer registered
  // Set them as provider-sourced with an 'unknown' source key
  await knex('refresh_state')
    .whereNull('source_type')
    .update({
      source_type: 'provider',
      source_key: 'unknown',
      created_at: knex.raw(
        knex.client.config.client.includes('sqlite3')
          ? 'COALESCE(created_at, last_discovery_at)'
          : 'COALESCE(created_at, last_discovery_at)',
      ),
    });

  // Now make columns NOT NULL
  // Different syntax for different databases
  if (knex.client.config.client.includes('pg')) {
    await knex.raw(`
      ALTER TABLE refresh_state
        ALTER COLUMN source_type SET NOT NULL,
        ALTER COLUMN source_key SET NOT NULL,
        ALTER COLUMN created_at SET NOT NULL
    `);
  } else if (knex.client.config.client.includes('mysql')) {
    // MySQL requires redefining the column
    await knex.raw(`
      ALTER TABLE refresh_state
        MODIFY source_type VARCHAR(16) NOT NULL,
        MODIFY source_key TEXT NOT NULL,
        MODIFY created_at DATETIME NOT NULL
    `);
  } else {
    // SQLite doesn't support ALTER COLUMN, so we need to recreate the table
    // For SQLite, we'll skip making columns NOT NULL as it would require table recreation
    // The application layer will ensure non-null values going forward
  }
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function down(knex) {
  // Make columns nullable again
  if (knex.client.config.client.includes('pg')) {
    await knex.raw(`
      ALTER TABLE refresh_state
        ALTER COLUMN source_type DROP NOT NULL,
        ALTER COLUMN source_key DROP NOT NULL,
        ALTER COLUMN created_at DROP NOT NULL
    `);
  } else if (knex.client.config.client.includes('mysql')) {
    await knex.raw(`
      ALTER TABLE refresh_state
        MODIFY source_type VARCHAR(16) NULL,
        MODIFY source_key TEXT NULL,
        MODIFY created_at DATETIME NULL
    `);
  }
  // SQLite: columns were already nullable, no action needed

  // Clear the backfilled data
  await knex('refresh_state').update({
    source_type: null,
    source_key: null,
    created_at: null,
  });
};
