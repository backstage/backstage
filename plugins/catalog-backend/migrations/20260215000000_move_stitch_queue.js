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
 * Moves the stitch queue columns from refresh_state to final_entities.
 * The stitch queue semantically belongs to final_entities since stitching
 * operates on a per-entity-ref basis and produces one output entity.
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  const isSQLite = knex.client.config.client.includes('sqlite');

  // Step 1: Add next_stitch_at column to final_entities
  await knex.schema.alterTable('final_entities', table => {
    table
      .dateTime('next_stitch_at')
      .nullable()
      .comment('Timestamp of when entity should be stitched');
  });

  // Step 1b: Create partial index separately
  // For SQLite, we use raw SQL to create the partial index to avoid
  // Knex's table rebuild which can cause issues with FK constraints.
  // For other databases, we use Knex's API.
  if (isSQLite) {
    await knex.raw(`
      CREATE INDEX final_entities_next_stitch_at_idx
      ON final_entities (next_stitch_at)
      WHERE next_stitch_at IS NOT NULL
    `);
  } else {
    await knex.schema.alterTable('final_entities', table => {
      table.index('next_stitch_at', 'final_entities_next_stitch_at_idx', {
        predicate: knex.whereNotNull('next_stitch_at'),
      });
    });
  }

  // Step 2: Migrate existing stitch requests from refresh_state to final_entities
  // using upsert - insert new rows or update existing ones in a single operation.
  const pendingStitches = await knex
    .select({
      entity_id: 'refresh_state.entity_id',
      entity_ref: 'refresh_state.entity_ref',
      next_stitch_at: 'refresh_state.next_stitch_at',
      next_stitch_ticket: 'refresh_state.next_stitch_ticket',
    })
    .from('refresh_state')
    .whereNotNull('refresh_state.next_stitch_at');

  // Process in batches to avoid issues with large datasets
  for (let i = 0; i < pendingStitches.length; i += 1000) {
    const batch = pendingStitches.slice(i, i + 1000);
    await knex('final_entities')
      .insert(
        batch.map(row => ({
          entity_id: row.entity_id,
          entity_ref: row.entity_ref,
          hash: '', // Empty hash indicates needs stitching
          stitch_ticket: row.next_stitch_ticket || '',
          final_entity: null,
          last_updated_at: null,
          next_stitch_at: row.next_stitch_at,
        })),
      )
      .onConflict('entity_ref')
      .merge(['next_stitch_at', 'stitch_ticket']);
  }

  // Step 4: Remove next_stitch_at and next_stitch_ticket columns from refresh_state
  if (isSQLite) {
    // SQLite 3.35+ supports ALTER TABLE DROP COLUMN natively
    // Use raw SQL to avoid Knex's table rebuild which can cause issues with FKs
    await knex.raw('DROP INDEX IF EXISTS refresh_state_next_stitch_at_idx');
    await knex.raw('ALTER TABLE refresh_state DROP COLUMN next_stitch_at');
    await knex.raw('ALTER TABLE refresh_state DROP COLUMN next_stitch_ticket');
  } else {
    await knex.schema.alterTable('refresh_state', table => {
      table.dropIndex([], 'refresh_state_next_stitch_at_idx');
      table.dropColumn('next_stitch_at');
      table.dropColumn('next_stitch_ticket');
    });
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  const isSQLite = knex.client.config.client.includes('sqlite');

  // Step 1: Add back the columns to refresh_state
  await knex.schema.alterTable('refresh_state', table => {
    table
      .dateTime('next_stitch_at')
      .nullable()
      .comment('Timestamp of when entity should be stitched');
    table
      .string('next_stitch_ticket')
      .nullable()
      .comment('Random value distinguishing stitch requests');
  });

  // Step 1b: Create partial index separately
  if (isSQLite) {
    await knex.raw(`
      CREATE INDEX refresh_state_next_stitch_at_idx
      ON refresh_state (next_stitch_at)
      WHERE next_stitch_at IS NOT NULL
    `);
  } else {
    await knex.schema.alterTable('refresh_state', table => {
      table.index('next_stitch_at', 'refresh_state_next_stitch_at_idx', {
        predicate: knex.whereNotNull('next_stitch_at'),
      });
    });
  }

  // Step 2: Migrate stitch requests back from final_entities to refresh_state
  if (isSQLite) {
    const pendingStitches = await knex
      .select({
        entityRef: 'final_entities.entity_ref',
        nextStitchAt: 'final_entities.next_stitch_at',
        stitchTicket: 'final_entities.stitch_ticket',
      })
      .from('final_entities')
      .whereNotNull('final_entities.next_stitch_at');

    for (const row of pendingStitches) {
      await knex('refresh_state')
        .update({
          next_stitch_at: row.nextStitchAt,
          next_stitch_ticket: row.stitchTicket,
        })
        .where('entity_ref', row.entityRef);
    }
  } else {
    await knex('refresh_state')
      .update({
        next_stitch_at: knex
          .select('final_entities.next_stitch_at')
          .from('final_entities')
          .whereRaw('final_entities.entity_ref = refresh_state.entity_ref')
          .whereNotNull('final_entities.next_stitch_at'),
        next_stitch_ticket: knex
          .select('final_entities.stitch_ticket')
          .from('final_entities')
          .whereRaw('final_entities.entity_ref = refresh_state.entity_ref')
          .whereNotNull('final_entities.next_stitch_at'),
      })
      .whereIn(
        'entity_ref',
        knex
          .select('entity_ref')
          .from('final_entities')
          .whereNotNull('next_stitch_at'),
      );
  }

  // Step 3: Remove next_stitch_at column from final_entities
  if (isSQLite) {
    await knex.raw('DROP INDEX IF EXISTS final_entities_next_stitch_at_idx');
    await knex.schema.alterTable('final_entities', table => {
      table.dropColumn('next_stitch_at');
    });
  } else {
    await knex.schema.alterTable('final_entities', table => {
      table.dropIndex([], 'final_entities_next_stitch_at_idx');
      table.dropColumn('next_stitch_at');
    });
  }
};
