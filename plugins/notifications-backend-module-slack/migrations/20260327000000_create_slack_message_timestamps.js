// @ts-check
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

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable(
    'slack_message_timestamps',
    function tableSetup(table) {
      table.string('origin', 256).notNullable();
      table.string('scope', 512).notNullable();
      table.string('channel', 64).notNullable();
      table.string('ts', 64).notNullable();
      table
        .timestamp('created_at', { useTz: true })
        .defaultTo(knex.fn.now())
        .notNullable();
      table.primary(['origin', 'scope', 'channel']);
      table.index('created_at', 'idx_slack_message_timestamps_created_at');
    },
  );
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('slack_message_timestamps');
};
