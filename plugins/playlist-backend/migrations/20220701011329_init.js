/*
 * Copyright 2022 The Backstage Authors
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
  await knex.schema.createTable('playlists', table => {
    table.comment('Playlists table');
    table.uuid('id').primary().comment('Automatically generated unique ID');
    table.text('name').notNullable().comment('The name of the playlist');
    table.text('description').comment('The description of the playlist');
    table.string('owner').notNullable().comment('The owner entity ref');
    table
      .boolean('public')
      .defaultTo(false)
      .notNullable()
      .comment('Whether the playlist is public');
  });

  await knex.schema.createTable('entities', table => {
    table.comment('The table of playlist entities');
    table
      .uuid('playlist_id')
      .notNullable()
      .references('playlists.id')
      .onDelete('CASCADE')
      .comment('The id of the playlist this entity belongs to');
    table.string('entity_ref').notNullable().comment('A entity ref');
    table.unique(['playlist_id', 'entity_ref'], {
      indexName: 'playlist_entity_composite_index',
    });
  });

  await knex.schema.createTable('followers', table => {
    table.comment('The table of playlist followers');
    table
      .uuid('playlist_id')
      .notNullable()
      .references('playlists.id')
      .onDelete('CASCADE')
      .comment('The id of the playlist being followed');
    table.string('user_ref').notNullable().comment('A user entity ref');
    table.unique(['playlist_id', 'user_ref'], {
      indexName: 'playlist_follower_composite_index',
    });
  });
};

/**
 * @param { import("knex").Knex } knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('playlists');
  await knex.schema.dropTable('entities');
  await knex.schema.dropTable('followers');
};
