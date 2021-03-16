/*
 * Copyright 2021 Spotify AB
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
  await knex.schema.createTable('sites', table => {
    table.comment('The table of chrome ux report sites');
    table.increments('id').primary().notNullable();
    table.text('origin').unique().notNullable();
  });

  await knex.schema.createTable('monthsWithYear', table => {
    table.comment('The table of chrome ux report monthsWithYear');
    table.increments('id').primary().notNullable();
    table.text('date').unique().notNullable();
  });

  await knex.schema.createTable('uxMetrics', table => {
    table.comment('The table of chrome ux report metrics');
    table.increments('id').primary().notNullable();
    table
      .integer('sites_id')
      .references('id')
      .inTable('sites')
      .notNullable()
      .onDelete('CASCADE');
    table
      .integer('monthsWithYear_id')
      .references('id')
      .inTable('monthsWithYear')
      .notNullable()
      .onDelete('CASCADE');
    table.text('form_factor').notNullable();
    table.text('connection_type').notNullable();
    table.json('first_contentful_paint').notNullable();
    table.json('largest_contentful_paint').notNullable();
    table.json('dom_content_loaded').notNullable();
    table.json('layout_instability').notNullable();
    table.json('onload').notNullable();
    table.json('first_input').notNullable();
    table.json('notifications').notNullable();
    table.json('time_to_first_byte').notNullable();

    table.unique(['sites_id', 'monthsWithYear_id'], 'last');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('metrics');
  await knex.schema.dropTable('sites');
  await knex.schema.dropTable('monthsWithYear');
};
