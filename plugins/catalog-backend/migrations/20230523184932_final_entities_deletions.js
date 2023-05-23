/*
 * Copyright 2023 The Backstage Authors
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
  await knex.schema.alterTable('final_entities', table => {
    table
      .text('entity_ref')
      .unique()
      .nullable()
      .comment('The reference of the entity that is stored in this row');

    table
      .dateTime('deleted_at')
      .nullable()
      .comment('Timestamp at which the entity was deleted');

    if (knex.client.config.client.includes('sqlite3')) {
      // SQLite forces bigIncrements to be the primary key
      table
        .bigInteger('change_index')
        .comment('The index of the most recent change to the entity');
    } else {
      table
        .bigIncrements('change_index', { primaryKey: false })
        .comment('The index of the most recent change to the entity');
    }
  });

  await knex('final_entities').update({
    entity_ref: knex('refresh_state')
      .select('entity_ref')
      .where('entity_id', knex.raw('??', ['final_entities.entity_id'])),
  });

  await knex.schema.alterTable('final_entities', table => {
    table.dropPrimary();
    table.primary(['entity_ref']);

    table.setNullable('entity_id');
    table.dropForeign('entity_id');
    table
      .foreign('entity_id')
      .references('entity_id')
      .inTable('refresh_state')
      .onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  await knex('final_entities').whereNull('entity_id').delete();

  await knex.schema.alterTable('final_entities', table => {
    table.dropNullable('entity_id');
    table.dropForeign('entity_id');
    table
      .foreign('entity_id')
      .references('entity_id')
      .inTable('refresh_state')
      .onDelete('CASCADE');

    table.dropPrimary();
    table.primary(['entity_id']);

    table.dropColumn('entity_ref');
    table.dropColumn('deleted_at');
    table.dropColumn('change_index');
  });
};
