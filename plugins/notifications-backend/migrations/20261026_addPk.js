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
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('broadcast_user_status', table => {
    table.primary(['broadcast_id', 'user'], {
      constraintName: 'broadcast_user_pkey',
    });
  });
  await knex.schema.alterTable('broadcast_user_status', table => {
    table.dropUnique([], 'broadcast_user_idx');
  });
  await knex.schema.alterTable('user_settings', table => {
    table.primary(['settings_key_hash'], {
      constraintName: 'user_settings_pkey',
    });
  });
  await knex.schema.alterTable('user_settings', table => {
    table.dropUnique([], 'user_settings_unique_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('broadcast_user_status', table => {
    table.unique(['broadcast_id', 'user'], { indexName: 'broadcast_user_idx' });
  });
  await knex.schema.alterTable('broadcast_user_status', table => {
    table.dropPrimary('broadcast_user_pkey');
  });
  await knex.schema.alterTable('user_settings', table => {
    table.unique(['settings_key_hash'], {
      indexName: 'user_settings_unique_idx',
    });
  });
  await knex.schema.alterTable('user_settings', table => {
    table.dropPrimary('user_settings_pkey');
  });
};
