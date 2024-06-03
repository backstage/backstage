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

exports.up = async function up(knex) {
  await knex.schema.createTable('notification_metadata', table => {
    table
      .uuid('originating_id')
      .references('id')
      .inTable('notification')
      .onDelete('CASCADE')
      .notNullable()
      .comment('The entity that provided the relation');
    table.string('name', 255).notNullable();
    table.text('type').notNullable();
    table.string('value').notNullable();

    table.index(['name'], 'notification_metadata_name_idx');

    table.unique(['originating_id', 'name'], {
      indexName: 'notification_metadata_id_name_idx',
    });
  });

  await knex.schema.createTable('broadcast_metadata', table => {
    table
      .uuid('originating_id')
      .references('id')
      .inTable('broadcast')
      .onDelete('CASCADE')
      .notNullable()
      .comment('The entity that provided the relation');
    table.string('name', 255).notNullable();
    table.text('type').notNullable();
    table.string('value').notNullable();

    table.index(['name'], 'broadcast_metadata_name_idx');

    table.unique(['originating_id', 'name'], {
      indexName: 'broadcast_metadata_id_name_idx',
    });
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('notification_metadata');
  await knex.schema.dropTable('broadcast_metadata');
};
