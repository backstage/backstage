/*
 * Copyright 2021 The Backstage Authors
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
 * @param { import("knex").Knex } knex
 */
exports.up = async function up(knex) {
  const isMySQL = knex.client.config.client.includes('mysql');
  if (isMySQL) {
    knex.schema.hasColumn('static_assets_cache', 'id').then(async res => {
      if (res) {
        return;
      }
      await knex.schema.alterTable('static_assets_cache', table => {
        table
          .increments('id', { primaryKey: true })
          .comment('Primary key to distinguish unique lines from each other');
      });
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  const isMySQL = knex.client.config.client.includes('mysql');
  if (isMySQL) {
    await knex.schema.alterTable('static_assets_cache', table =>
      table.dropPrimary(),
    );
  }
};
