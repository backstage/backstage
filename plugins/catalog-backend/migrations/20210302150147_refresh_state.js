/*
 * Copyright 2020 Spotify AB
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
 * @param {import('knex')} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('refresh_state', table => {
    table.comment('Location Refresh states');
    table
      .text('entity_ref')
      .primary()
      .notNullable()
      // .references('full_name')
      // .inTable('entities')
      // .onDelete('CASCADE')
      .comment('A reference to the entity that the refresh state is tied to');
    // TODO: This should probably be removed, just using it to make it easy to implement
    //       refreshes without having to remodel locations
    table.text('unprocessed_entity').notNullable().comment('The entity spec');
    table
      .text('processed_entity')
      .notNullable()
      .comment('The entity after processing');
    table
      .text('cache')
      .notNullable()
      .comment('Cache information tied to refreshing of this entity such etag');
    table
      .dateTime('next_update_at')
      .notNullable()
      .comment('Timestamp of when entity should be updated');
    table
      .dateTime('last_discovery_at')
      .notNullable()
      .comment('The last timestamp of which this entity was discovered');
    table.index('entity_ref', 'entity_ref_idx');
    table.index('next_update_at', 'next_update_at_idx');
  });
};

/**
 * @param {import('knex')} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('refresh_state', table => {
    table.dropIndex([], 'entity_ref_idx');
    table.dropIndex([], 'next_update_at_idx');
  });
  await knex.schema.dropTable('refresh_state');
};
