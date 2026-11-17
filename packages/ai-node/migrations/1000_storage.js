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

exports.up = async knex => {
  await knex.schema.createTable('ai_namespace_leases', table => {
    table.text('plugin_id').notNullable();
    table.text('session_id').notNullable();
    table.text('owner_id').notNullable();
    table.bigInteger('token').notNullable();
    table.timestamp('expires_at', { useTz: true }).notNullable();
    table.primary(['plugin_id', 'session_id']);
    table.check('token >= 0');
  });
  await knex.schema.createTable('ai_storage_counters', table => {
    table.text('plugin_id').notNullable();
    table.text('session_id').notNullable();
    table.bigInteger('next_id').notNullable();
    table.bigInteger('next_seq').notNullable();
    table.primary(['plugin_id', 'session_id']);
  });
  await knex.schema.createTable('ai_storage_commits', table => {
    table.text('plugin_id').notNullable();
    table.text('session_id').notNullable();
    table.bigInteger('seq').notNullable();
    table.text('writes').notNullable();
    table.primary(['plugin_id', 'session_id', 'seq']);
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('ai_storage_commits');
  await knex.schema.dropTable('ai_storage_counters');
  await knex.schema.dropTable('ai_namespace_leases');
};
