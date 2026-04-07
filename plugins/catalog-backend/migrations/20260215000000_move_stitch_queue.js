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
 * Creates a dedicated stitch_queue table and moves the stitch queue columns
 * from refresh_state into it. The stitch queue semantically is a separate
 * concern from the refresh state.
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  const isSQLite = knex.client.config.client.includes('sqlite');

  // Step 1: Create the stitch_queue table
  await knex.schema.createTable('stitch_queue', table => {
    table
      .string('entity_ref', 255)
      .primary()
      .notNullable()
      .comment('The entity ref that needs stitching');
    table
      .string('stitch_ticket')
      .notNullable()
      .comment('Changes with every new stitch request');
    table
      .dateTime('next_stitch_at')
      .notNullable()
      .index('stitch_queue_next_stitch_at_idx')
      .comment('Timestamp of when entity should be stitched');
  });

  // Step 2: Migrate existing stitch requests from refresh_state to stitch_queue
  const pendingStitches = await knex
    .select({
      entity_ref: 'refresh_state.entity_ref',
      next_stitch_at: 'refresh_state.next_stitch_at',
      next_stitch_ticket: 'refresh_state.next_stitch_ticket',
    })
    .from('refresh_state')
    .whereNotNull('refresh_state.next_stitch_at');

  await knex.batchInsert(
    'stitch_queue',
    pendingStitches.map(row => ({
      entity_ref: row.entity_ref,
      stitch_ticket: row.next_stitch_ticket || '',
      next_stitch_at: row.next_stitch_at,
    })),
    1000,
  );

  // Step 3: Remove next_stitch_at and next_stitch_ticket columns from refresh_state
  if (isSQLite) {
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

  // Step 4: Remove stitch_ticket from final_entities (now managed via stitch_queue)
  if (isSQLite) {
    await knex.raw('ALTER TABLE final_entities DROP COLUMN stitch_ticket');
  } else {
    await knex.schema.alterTable('final_entities', table => {
      table.dropColumn('stitch_ticket');
    });
  }
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  const isSQLite = knex.client.config.client.includes('sqlite');

  // Step 1: Add back stitch_ticket to final_entities
  await knex.schema.alterTable('final_entities', table => {
    table
      .text('stitch_ticket')
      .nullable()
      .comment('Random value representing a unique stitch attempt ticket');
  });
  await knex('final_entities').update({ stitch_ticket: '' });
  if (isSQLite) {
    // SQLite doesn't support ALTER COLUMN, but the nullable column is fine
  } else {
    await knex.schema.alterTable('final_entities', table => {
      table.text('stitch_ticket').notNullable().alter();
    });
  }

  // Step 2: Add back the columns to refresh_state
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

  // Step 2b: Create partial index separately
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

  // Step 3: Migrate stitch requests back from stitch_queue to refresh_state
  if (isSQLite) {
    const pendingStitches = await knex
      .select({
        entityRef: 'stitch_queue.entity_ref',
        nextStitchAt: 'stitch_queue.next_stitch_at',
        latestTicket: 'stitch_queue.stitch_ticket',
      })
      .from('stitch_queue');

    for (const row of pendingStitches) {
      await knex('refresh_state')
        .update({
          next_stitch_at: row.nextStitchAt,
          next_stitch_ticket: row.latestTicket,
        })
        .where('entity_ref', row.entityRef);
    }
  } else {
    await knex('refresh_state')
      .update({
        next_stitch_at: knex
          .select('stitch_queue.next_stitch_at')
          .from('stitch_queue')
          .whereRaw('stitch_queue.entity_ref = refresh_state.entity_ref'),
        next_stitch_ticket: knex
          .select('stitch_queue.stitch_ticket')
          .from('stitch_queue')
          .whereRaw('stitch_queue.entity_ref = refresh_state.entity_ref'),
      })
      .whereIn('entity_ref', knex.select('entity_ref').from('stitch_queue'));
  }

  // Step 4: Drop the stitch_queue table
  await knex.schema.dropTable('stitch_queue');
};
