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
  // Start out with an original_value column that's equal to the value column
  await knex.schema.alterTable('search', table => {
    table
      .string('original_value')
      .nullable()
      .comment('Holds the corresponding original case sensitive value');
  });
  await knex('search').update({ original_value: knex.ref('value') });

  // Make sure to reprocess everything, to make sure that the original_value
  // column is populated with values with the proper casing. It's unfortunately
  // not enough to just reset the final_entities hash, since stitching is driven
  // only by processing resulting in data that isn't matching the refresh_state
  // hash.
  await knex('final_entities').update({ hash: '' });
  await knex('refresh_state').update({
    result_hash: '',
    next_update_at: knex.fn.now(),
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('search', table => {
    table.dropColumn('original_value');
  });
};
