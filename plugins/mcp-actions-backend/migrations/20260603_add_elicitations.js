/*
 * Copyright 2025 The Backstage Authors
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
  await knex.schema.createTable('mcp_elicitations', table => {
    table.text('elicitation_id').primary();
    table.text('action_id').notNullable();
    table.text('user_entity_ref').notNullable();
    table.text('secrets').nullable();
    table.text('csrf_token').nullable();
    table.text('status').notNullable().defaultTo('pending');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.index('created_at', 'idx_mcp_elicitations_created_at');
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTable('mcp_elicitations');
};
