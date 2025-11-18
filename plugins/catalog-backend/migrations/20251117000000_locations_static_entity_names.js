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
  await knex.schema.alterTable('locations', table => {
    table
      .string('entity_naming')
      .nullable()
      .comment('How the location entity is named: by hash or by id');
  });

  await knex('locations').update({ entity_naming: 'hash' });

  await knex.schema.alterTable('locations', table => {
    table.string('entity_naming').notNullable().alter({ alterNullable: true });
  });
};

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('locations', table => {
    table.dropColumn('entity_naming');
  });
};
