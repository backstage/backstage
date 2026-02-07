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
 * Removes the unique constraint on entity_ref and replaces it with a composite
 * unique constraint on (source_type, source_key, entity_ref).
 *
 * This allows multiple sources (providers or parent entities) to emit the same
 * entity_ref, with the stitcher selecting a "winner" based on deterministic rules.
 *
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function up(knex) {
  // The approach differs by database due to constraint naming conventions

  if (knex.client.config.client.includes('pg')) {
    // PostgreSQL: drop old unique constraint and add new composite one
    await knex.raw(`
      ALTER TABLE refresh_state
        DROP CONSTRAINT IF EXISTS refresh_state_entity_ref_uniq
    `);
    await knex.raw(`
      DROP INDEX IF EXISTS refresh_state_entity_ref_uniq
    `);
    await knex.raw(`
      CREATE UNIQUE INDEX refresh_state_source_entity_uniq
        ON refresh_state (source_type, source_key, entity_ref)
    `);
    // Keep a non-unique index on entity_ref for query performance
    await knex.raw(`
      CREATE INDEX IF NOT EXISTS refresh_state_entity_ref_idx
        ON refresh_state (entity_ref)
    `);
  } else if (knex.client.config.client.includes('mysql')) {
    // MySQL: need to find and drop the constraint by name
    // First check if the index exists
    const [indexes] = await knex.raw(`
      SHOW INDEX FROM refresh_state WHERE Key_name = 'refresh_state_entity_ref_uniq'
    `);
    if (indexes && indexes.length > 0) {
      await knex.raw(`
        ALTER TABLE refresh_state DROP INDEX refresh_state_entity_ref_uniq
      `);
    }
    await knex.raw(`
      CREATE UNIQUE INDEX refresh_state_source_entity_uniq
        ON refresh_state (source_type, source_key(255), entity_ref)
    `);
    // Keep a non-unique index on entity_ref for query performance
    const [entityRefIndexes] = await knex.raw(`
      SHOW INDEX FROM refresh_state WHERE Key_name = 'refresh_state_entity_ref_idx'
    `);
    if (!entityRefIndexes || entityRefIndexes.length === 0) {
      await knex.raw(`
        CREATE INDEX refresh_state_entity_ref_idx ON refresh_state (entity_ref)
      `);
    }
  } else {
    // SQLite: need to recreate the table to change constraints
    // For SQLite, we use a different approach - drop and recreate indexes
    await knex.raw(`DROP INDEX IF EXISTS refresh_state_entity_ref_uniq`);
    await knex.raw(`
      CREATE UNIQUE INDEX IF NOT EXISTS refresh_state_source_entity_uniq
        ON refresh_state (source_type, source_key, entity_ref)
    `);
    await knex.raw(`
      CREATE INDEX IF NOT EXISTS refresh_state_entity_ref_idx
        ON refresh_state (entity_ref)
    `);
  }
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function down(knex) {
  if (knex.client.config.client.includes('pg')) {
    await knex.raw(`DROP INDEX IF EXISTS refresh_state_source_entity_uniq`);
    await knex.raw(`DROP INDEX IF EXISTS refresh_state_entity_ref_idx`);
    await knex.raw(`
      CREATE UNIQUE INDEX refresh_state_entity_ref_uniq
        ON refresh_state (entity_ref)
    `);
  } else if (knex.client.config.client.includes('mysql')) {
    const [indexes] = await knex.raw(`
      SHOW INDEX FROM refresh_state WHERE Key_name = 'refresh_state_source_entity_uniq'
    `);
    if (indexes && indexes.length > 0) {
      await knex.raw(`
        ALTER TABLE refresh_state DROP INDEX refresh_state_source_entity_uniq
      `);
    }
    const [entityRefIndexes] = await knex.raw(`
      SHOW INDEX FROM refresh_state WHERE Key_name = 'refresh_state_entity_ref_idx'
    `);
    if (entityRefIndexes && entityRefIndexes.length > 0) {
      await knex.raw(`
        ALTER TABLE refresh_state DROP INDEX refresh_state_entity_ref_idx
      `);
    }
    await knex.raw(`
      CREATE UNIQUE INDEX refresh_state_entity_ref_uniq ON refresh_state (entity_ref)
    `);
  } else {
    await knex.raw(`DROP INDEX IF EXISTS refresh_state_source_entity_uniq`);
    await knex.raw(`DROP INDEX IF EXISTS refresh_state_entity_ref_idx`);
    await knex.raw(`
      CREATE UNIQUE INDEX refresh_state_entity_ref_uniq ON refresh_state (entity_ref)
    `);
  }
};
