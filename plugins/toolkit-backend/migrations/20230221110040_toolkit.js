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

// eslint-disable-next-line func-names
exports.up = async function (knex) {
  await knex.schema.createTable('toolkit', table => {
    table.increments('id').primary().unsigned().unique();
    table.string('title').notNullable().defaultTo('Untitled').index();
    table.text('url').notNullable();
    table.text('logo').notNullable();
    table.string('owner').notNullable();
    table.enu('type', ['public', 'private']).defaultTo('public');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
  await knex.schema.createTable('toolkit_item', table => {
    table.increments('id').primary().unsigned().unique();
    table
      .integer('toolkit')
      .references('id')
      .inTable('toolkit')
      .notNullable()
      .onDelete('CASCADE');
    table.boolean('isPrivate').notNullable().defaultTo(false);
    table.string('user').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
// eslint-disable-next-line func-names
exports.down = async function (knex) {
  await knex.schema.dropTable('toolkit');
};
