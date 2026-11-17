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

// Persisted recovery bookkeeping. Table names must match
// src/ownership/recovery.ts. The lease table is owned by the storage
// migration (1000_storage) and is never recreated here.
exports.up = async function up(knex) {
  await knex.schema.createTable('ai_recovery_sessions', table => {
    table.text('plugin_id').notNullable();
    table.text('session_id').notNullable();
    table.text('origin_kind').notNullable();
    table.text('origin_user_id').nullable();
    table.text('origin_service_plugin_id').nullable();
    table.text('definition_version').notNullable();
    table.boolean('dispatch_unknown').notNullable().defaultTo(false);
    table.text('status').notNullable();
    table.text('detail').nullable();
    table.bigInteger('revision').notNullable().defaultTo(0);
    table.timestamp('updated_at', { useTz: true }).notNullable();
    table.primary(['plugin_id', 'session_id']);
    table.check("origin_kind IN ('user', 'service')");
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTable('ai_recovery_sessions');
};
