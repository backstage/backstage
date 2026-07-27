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
exports.up = async function up(knex) {
  await knex.schema.createTable('usage_events', table => {
    table.uuid('event_id').primary();
    table.timestamp('occurred_at', { useTz: true }).notNullable();
    table.text('user_entity_ref').notNullable();
    table.uuid('session_id').notNullable();
    table.string('action', 128).notNullable();
    table.string('subject', 512).nullable();
    table.double('value').nullable();
    table.string('plugin_id', 128).nullable();
    table.string('extension_id', 128).nullable();
    table.string('current_path', 512).notNullable();
    table.string('previous_path', 512).nullable();

    table.index(['occurred_at'], 'usage_events_occurred_at_idx');
    table.index(
      ['user_entity_ref', 'occurred_at'],
      'usage_events_user_occurred_at_idx',
    );
    table.index(
      ['session_id', 'occurred_at'],
      'usage_events_session_occurred_at_idx',
    );
    table.index(
      ['current_path', 'occurred_at'],
      'usage_events_path_occurred_at_idx',
    );
    table.index(
      ['action', 'occurred_at'],
      'usage_events_action_occurred_at_idx',
    );
  });

  await knex.schema.createTable('usage_presence', table => {
    table.uuid('session_id').primary();
    table.text('user_entity_ref').notNullable();
    table.string('current_path', 512).notNullable();
    table.timestamp('started_at', { useTz: true }).notNullable();
    table.timestamp('last_seen_at', { useTz: true }).notNullable();

    table.index(['last_seen_at'], 'usage_presence_last_seen_at_idx');
    table.index(
      ['user_entity_ref', 'last_seen_at'],
      'usage_presence_user_last_seen_at_idx',
    );
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('usage_presence');
  await knex.schema.dropTableIfExists('usage_events');
};
