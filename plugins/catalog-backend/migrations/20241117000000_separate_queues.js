/*
 * Copyright 2024 The Backstage Authors
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
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  const query = knex.schema.createTable('refresh_state_queues', table => {
    table
      .string('entity_id')
      .primary()
      .notNullable()
      .references('entity_id')
      .inTable('refresh_state')
      .onDelete('CASCADE')
      .comment('The entity that the queues target');
    table
      .timestamp('next_update_at')
      .notNullable()
      .comment('Timestamp of when entity should be updated');
  });

  if (knex.client.config.client === 'pg') {
    // Make the table UNLOGGED on postgres. It's so much more work to recreate
    // the whole table creation and indices etc by hand in a single raw
    // statement, just to get the unlogged bit in there - so we cheat with
    // string manipulation, to ensure that we get consistent results.
    await knex.schema.raw(
      query.toString().replace(/create table/i, 'create unlogged table'),
    );
  } else {
    await query;
  }

  await knex('refresh_state_queues').insert(
    knex('refresh_state').select(['entity_id', 'next_update_at']),
  );

  await knex.schema.alterTable('refresh_state_queues', table => {
    table.index('next_update_at', 'refresh_state_queues_next_update_at_idx');
  });

  await knex.schema.alterTable('refresh_state', table => {
    table.dropIndex([], 'refresh_state_next_update_at_idx');
  });

  // Not sure why, but if we do this with knex alterTable->dropColumn, refresh_state_queue gets purged as well
  await knex.schema.raw(`ALTER TABLE refresh_state DROP COLUMN next_update_at`);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('refresh_state', table => {
    table
      .dateTime('next_update_at')
      .nullable() // set non-nullable below
      .comment('Timestamp of when entity should be updated');
  });

  // This is hand written because knex has documented problems expressing UPDATE
  // from other tables - the query builder just doesn't cope with it
  if (knex.client.config.client.includes('mysql')) {
    await knex.raw(`
      UPDATE refresh_state
      LEFT OUTER JOIN refresh_state_queues
        ON refresh_state_queues.entity_id = refresh_state.entity_id
      SET
        refresh_state.next_update_at = COALESCE(refresh_state_queues.next_update_at, CURRENT_TIMESTAMP)
    `);
  } else {
    await knex.raw(`
      UPDATE refresh_state
      SET
        next_update_at = refresh_state_queues.next_update_at
      FROM refresh_state_queues
      WHERE refresh_state_queues.entity_id = refresh_state.entity_id
    `);
    await knex.raw(`
      UPDATE refresh_state
      SET next_update_at = CURRENT_TIMESTAMP
      WHERE next_update_at IS NULL
    `);
  }

  await knex.schema.alterTable('refresh_state', table => {
    table
      .dateTime('next_update_at')
      .notNullable()
      .alter({ alterNullable: true });
    table.index('next_update_at', 'refresh_state_next_update_at_idx');
  });

  await knex.schema.alterTable('refresh_state_queues', table => {
    table.dropIndex([], 'refresh_state_queues_next_update_at_idx');
  });
  await knex.schema.dropTable('refresh_state_queues');
};
