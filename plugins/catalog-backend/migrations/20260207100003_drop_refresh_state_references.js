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
 * Drops the refresh_state_references table now that source tracking is done
 * via inline columns in refresh_state (source_type, source_key).
 *
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function up(knex) {
  await knex.schema.dropTableIfExists('refresh_state_references');
};

/**
 * Recreates the refresh_state_references table and repopulates it from
 * the inline source columns in refresh_state.
 *
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function down(knex) {
  // Recreate the table
  await knex.schema.createTable('refresh_state_references', table => {
    table.bigIncrements('id').primary();
    table.text('source_key').nullable();
    table.text('source_entity_ref').nullable();
    table.text('target_entity_ref').notNullable();

    table.index('source_key', 'refresh_state_references_source_key_idx');
    table.index(
      'source_entity_ref',
      'refresh_state_references_source_entity_ref_idx',
    );
    table.index(
      'target_entity_ref',
      'refresh_state_references_target_entity_ref_idx',
    );
  });

  // Add foreign key constraints
  if (knex.client.config.client.includes('pg')) {
    await knex.raw(`
      ALTER TABLE refresh_state_references
        ADD CONSTRAINT refresh_state_references_source_entity_ref_fk
        FOREIGN KEY (source_entity_ref) REFERENCES refresh_state(entity_ref)
        ON DELETE CASCADE
    `);
    await knex.raw(`
      ALTER TABLE refresh_state_references
        ADD CONSTRAINT refresh_state_references_target_entity_ref_fk
        FOREIGN KEY (target_entity_ref) REFERENCES refresh_state(entity_ref)
        ON DELETE CASCADE
    `);
  }

  // Repopulate from inline source columns
  if (knex.client.config.client.includes('pg')) {
    await knex.raw(`
      INSERT INTO refresh_state_references (source_key, source_entity_ref, target_entity_ref)
      SELECT
        CASE WHEN source_type = 'provider' THEN source_key ELSE NULL END,
        CASE WHEN source_type = 'entity' THEN source_key ELSE NULL END,
        entity_ref
      FROM refresh_state
      WHERE source_type IS NOT NULL
    `);
  } else if (knex.client.config.client.includes('mysql')) {
    await knex.raw(`
      INSERT INTO refresh_state_references (source_key, source_entity_ref, target_entity_ref)
      SELECT
        CASE WHEN source_type = 'provider' THEN source_key ELSE NULL END,
        CASE WHEN source_type = 'entity' THEN source_key ELSE NULL END,
        entity_ref
      FROM refresh_state
      WHERE source_type IS NOT NULL
    `);
  } else {
    // SQLite
    const rows = await knex('refresh_state')
      .whereNotNull('source_type')
      .select('source_type', 'source_key', 'entity_ref');

    const references = rows.map(row => ({
      source_key: row.source_type === 'provider' ? row.source_key : null,
      source_entity_ref: row.source_type === 'entity' ? row.source_key : null,
      target_entity_ref: row.entity_ref,
    }));

    if (references.length > 0) {
      await knex.batchInsert('refresh_state_references', references, 50);
    }
  }
};
