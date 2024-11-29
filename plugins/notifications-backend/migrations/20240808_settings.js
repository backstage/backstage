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
exports.up = async function up(knex) {
  await knex.schema.createTable('user_settings', table => {
    table.string('user').notNullable();
    table.string('channel').notNullable();
    table.string('origin').notNullable();
    table.boolean('enabled').defaultTo(true).notNullable();
    table.index(['user'], 'user_settings_user_idx');
    table.unique(['user', 'channel', 'origin'], {
      indexName: 'user_settings_unique_idx',
    });
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('user_settings');
};
