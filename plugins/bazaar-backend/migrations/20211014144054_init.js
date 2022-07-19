/*
 * Copyright 2021 The Backstage Authors
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
  await knex.schema.createTable('metadata', table => {
    table.comment('The table of Bazaar metadata');
    table
      .text('entity_ref')
      .notNullable()
      .unique()
      .comment('The ref of the entity');
    table.text('name').notNullable().comment('The name of the entity');
    table
      .text('community')
      .comment('Link to where the community can discuss ideas');
    table
      .text('announcement')
      .notNullable()
      .comment('The announcement of the Bazaar project');
    table
      .text('status')
      .defaultTo('proposed')
      .notNullable()
      .comment('The status of the Bazaar project');
    table
      .text('updated_at')
      .notNullable()
      .comment('Timestamp on ISO 8601 format when entity was last updated');
  });

  await knex.schema.createTable('members', table => {
    table.comment('The table of Bazaar members');
    table
      .text('entity_ref')
      .notNullable()
      .references('metadata.entity_ref')
      .onDelete('CASCADE')
      .comment('The ref of the entity');
    table.text('user_id').notNullable().comment('The user id of the member');
    table
      .dateTime('join_date')
      .defaultTo(knex.fn.now())
      .notNullable()
      .comment('The timestamp when this member joined');
    table.text('picture').comment('Link to profile picture');
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTable('metadata');
  await knex.schema.dropTable('members');
};
