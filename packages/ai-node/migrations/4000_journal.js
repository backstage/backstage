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

// Durable audit journal. Table names must match src/journal/knex.ts and
// src/journal/retention.ts. The lease table is owned by the storage
// migration (1000_storage.js); this migration only adds journal tables.
exports.up = async function up(knex) {
  await knex.schema.createTable('ai_journal_events', table => {
    table.bigIncrements('id').primary();
    table.text('plugin_id').notNullable();
    table.text('session_id').notNullable();
    // decision | outcome | recovery
    table.text('kind').notNullable();
    // Outcome rows reference the decision row they settle.
    table.bigInteger('attempt_id').nullable();
    table.text('actor').nullable();
    table.text('conversation_id').nullable();
    table.text('task_id').nullable();
    table.text('call_id').nullable();
    table.text('definition_version').nullable();
    table.text('config_version').nullable();
    table.text('provider').nullable();
    table.text('model').nullable();
    table.text('operation').nullable();
    // Canonical http(s) origin + path of the attempt destination.
    table.text('destination').nullable();
    table.integer('attempt').nullable();
    // allow | deny, on decision rows.
    table.text('decision').nullable();
    table.text('reason').nullable();
    // Outcome status, on outcome rows.
    table.text('status').nullable();
    table.integer('http_status').nullable();
    table.text('detail').nullable();
    // Recovery event kind, on recovery rows.
    table.text('recovery_kind').nullable();
    table.text('fence_owner').notNullable();
    table.text('fence_token').notNullable();
    table.timestamp('created_at', { useTz: true }).notNullable();
    table.index(
      ['plugin_id', 'session_id', 'id'],
      'ai_journal_events_ns_id_idx',
    );
    table.index(['kind', 'created_at'], 'ai_journal_events_retention_idx');
  });

  await knex.schema.createTable('ai_journal_session_owners', table => {
    table.text('plugin_id').notNullable();
    table.text('session_id').notNullable();
    table.text('owner_ref').notNullable();
    table.timestamp('created_at', { useTz: true }).notNullable();
    table.primary(['plugin_id', 'session_id']);
  });

  await knex.schema.createTable('ai_journal_uncertainty', table => {
    table.bigInteger('attempt_id').notNullable();
    table.text('note').notNullable();
    table.timestamp('recorded_at', { useTz: true }).notNullable();
    table.primary(['attempt_id']);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('ai_journal_uncertainty');
  await knex.schema.dropTableIfExists('ai_journal_session_owners');
  await knex.schema.dropTableIfExists('ai_journal_events');
};
