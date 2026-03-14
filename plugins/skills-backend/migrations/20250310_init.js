/*
 * Copyright 2026 The Backstage Authors
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
  await knex.schema.createTable('skills', table => {
    table.string('name', 64).primary();
    table.string('description', 1024).notNullable();
    table.string('license', 255).nullable();
    table.string('compatibility', 500).nullable();
    table.text('metadata').nullable();
    table.text('allowed_tools').nullable();
    table.string('source', 255).notNullable();
    table.datetime('created_at').defaultTo(knex.fn.now()).notNullable();
    table.datetime('updated_at').defaultTo(knex.fn.now()).notNullable();

    table.index(['source'], 'skills_source_idx');
  });

  await knex.schema.createTable('skill_files', table => {
    table.string('skill_name', 64).notNullable();
    table.string('path', 512).notNullable();
    table.text('content').notNullable();

    table.primary(['skill_name', 'path']);
    table
      .foreign('skill_name')
      .references('name')
      .inTable('skills')
      .onDelete('CASCADE');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('skill_files');
  await knex.schema.dropTable('skills');
};
