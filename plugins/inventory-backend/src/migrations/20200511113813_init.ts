/*
 * Copyright 2020 Spotify AB
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

import * as Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema
    .createTable('locations', table => {
      table
        .uuid('id')
        .primary()
        .comment('Auto-generated ID of the location');
      table
        .string('type')
        .notNullable()
        .comment('The type of location');
      table
        .string('target')
        .notNullable()
        .comment('The actual target of the location');
    })
    .createTable('components', table => {
      table
        .string('name')
        .primary()
        .comment('The name of the component');
    });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('components').dropTable('locations');
}
