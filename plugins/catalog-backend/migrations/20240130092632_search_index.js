/*
 * Copyright 2022 The Backstage Authors
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
  if (knex.client.config.client === 'pg') {
    await knex.raw(
      'CREATE INDEX CONCURRENTLY search_key_value_idx ON search(key, value)',
    );
    await knex.raw(
      'CREATE INDEX CONCURRENTLY search_key_original_value_idx ON search(key, original_value)',
    );
  }
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  if (knex.client.config.client === 'pg') {
    await knex.raw('DROP INDEX CONCURRENTLY search_key_value_idx');
    await knex.raw('DROP INDEX CONCURRENTLY search_key_original_value_idx');
  }
};

exports.config = {
  transaction: false,
};
