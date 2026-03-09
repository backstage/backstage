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
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  const useTz = knex.client.config.client === 'pg';

  await knex.schema.createTable('backstage_queue_items', table => {
    table.string('id', 255).primary();
    table.string('queue_name', 255).notNullable();

    if (knex.client.config.client === 'pg') {
      table.jsonb('payload').notNullable();
    } else {
      table.json('payload').notNullable();
    }

    table.integer('attempt').notNullable();
    table.integer('priority').notNullable();
    table.timestamp('available_at', { useTz }).notNullable();
    table.timestamp('lease_expires_at', { useTz }).nullable();
    table.string('lease_token', 255).nullable();
    table.timestamp('created_at', { useTz }).notNullable();
    table.timestamp('updated_at', { useTz }).notNullable();

    table.index(['queue_name', 'available_at'], 'bq_available_idx');
    table.index(['queue_name', 'lease_expires_at'], 'bq_lease_idx');
    table.index(['queue_name', 'priority', 'created_at'], 'bq_priority_idx');
  });
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('backstage_queue_items');
};
