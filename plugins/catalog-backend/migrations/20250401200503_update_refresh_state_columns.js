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
/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.up = async function up(knex) {
  const isMySQL = knex.client.config.client.includes('mysql');
  // update the columns to longtext for MySQL
  if (isMySQL) {
    await knex.schema.alterTable('refresh_state', table => {
      table.text('unprocessed_entity', 'longtext').alter();
      table.text('cache', 'longtext').alter();
    });
  }
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function down(knex) {
  const isMySQL = knex.client.config.client.includes('mysql');
  if (isMySQL) {
    await knex.schema.alterTable('refresh_state', table => {
      table.text('unprocessed_entity').alter();
      table.text('cache').alter();
    });
  }
};
