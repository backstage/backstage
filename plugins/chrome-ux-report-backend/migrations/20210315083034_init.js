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
  await knex.schema.createTable('origins', table => {
    table.comment('The table of chrome ux report sites');
    table.increments('id').primary().notNullable();
    table.text('origin').unique().notNullable();
  });

  await knex.schema.createTable('periods', table => {
    table.comment('The table of chrome ux report monthsWithYear');
    table.increments('id').primary().notNullable();
    table.text('period').unique().notNullable();
  });

  await knex.schema.createTable('uxMetrics', table => {
    table.comment('The table of chrome ux report metrics');
    table.increments('id').primary().notNullable();
    table
      .integer('origin_id')
      .references('id')
      .inTable('origins')
      .notNullable()
      .onDelete('CASCADE');
    table
      .integer('period_id')
      .references('id')
      .inTable('periods')
      .notNullable()
      .onDelete('CASCADE');
    table.float('fast_fp').notNullable();
    table.float('avg_fp').notNullable();
    table.float('slow_fp').notNullable();
    table.float('fast_fcp').notNullable();
    table.float('avg_fcp').notNullable();
    table.float('slow_fcp').notNullable();
    table.float('fast_dcl').notNullable();
    table.float('avg_dcl').notNullable();
    table.float('slow_dcl').notNullable();
    table.float('fast_ol').notNullable();
    table.float('avg_ol').notNullable();
    table.float('slow_ol').notNullable();
    table.float('fast_fid').notNullable();
    table.float('avg_fid').notNullable();
    table.float('slow_fid').notNullable();
    table.float('fast_ttfb').notNullable();
    table.float('avg_ttfb').notNullable();
    table.float('slow_ttfb').notNullable();
    table.float('small_cls').notNullable();
    table.float('medium_cls').notNullable();
    table.float('large_cls').notNullable();
    table.float('fast_lcp').notNullable();
    table.float('avg_lcp').notNullable();
    table.float('slow_lcp').notNullable();
    table.unique(['origin_id', 'period_id'], 'origins_periods_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('uxMetrics');
  await knex.schema.dropTable('origins');
  await knex.schema.dropTable('periods');
};
