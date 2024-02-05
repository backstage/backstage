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

exports.up = async function up(knex) {
  await knex.schema.createTable('notification', table => {
    table.uuid('id').primary();
    table.string('user', 255).notNullable();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.string('severity', 8).notNullable();
    table.text('link').notNullable();
    table.string('origin', 255).notNullable();
    table.string('scope', 255).nullable();
    table.string('topic', 255).nullable();
    table.datetime('created').defaultTo(knex.fn.now()).notNullable();
    table.datetime('updated').nullable();
    table.datetime('read').nullable();
    table.datetime('done').nullable();
    table.datetime('saved').nullable();

    table.index(['user'], 'notification_user_idx');
    table.index(['scope', 'origin'], 'notification_scope_origin_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('notification');
};
