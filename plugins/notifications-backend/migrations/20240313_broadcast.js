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
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('broadcast', table => {
    table.uuid('id').primary();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.string('severity', 8).notNullable();
    table.text('link').nullable();
    table.string('origin', 255).notNullable();
    table.string('scope', 255).nullable();
    table.string('topic', 255).nullable();
    table.datetime('created').defaultTo(knex.fn.now()).notNullable();
    table.datetime('updated').nullable();
    table.index(['scope', 'origin'], 'broadcast_cope_origin_idx');
  });

  await knex.schema.createTable('broadcast_user_status', table => {
    table.uuid('broadcast_id').notNullable();
    table.string('user', 255).notNullable();
    table.datetime('read').nullable();
    table.datetime('saved').nullable();

    table
      .foreign('broadcast_id')
      .references('id')
      .inTable('broadcast')
      .onDelete('CASCADE');
    table.unique(['broadcast_id', 'user'], {
      indexName: 'broadcast_user_idx',
    });
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('broadcast_user_status');
  await knex.schema.dropTable('broadcast');
};
