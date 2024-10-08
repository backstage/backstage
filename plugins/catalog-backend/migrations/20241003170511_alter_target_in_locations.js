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

// @ts-check

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function up(knex) {
  await knex.schema.alterTable('locations', table => {
    table.text('target').alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function down(knex) {
  const oversizedEntries = await knex('locations').where(
    knex.raw('LENGTH(target) > 255'),
  );

  if (oversizedEntries.length > 0) {
    throw new Error(
      `Migration aborted: Found ${oversizedEntries.length} entries with 'target' exceeding 255 characters. Manual intervention required.`,
    );
  }

  await knex.schema.alterTable('locations', table => {
    table.string('target').alter();
  });
};
