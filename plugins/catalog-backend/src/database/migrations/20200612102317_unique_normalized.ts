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
  return knex.schema.alterTable('entities', table => {
    // these are added as nullable because sqlite does not support alter column
    table
      .string('kind_normalized')
      .nullable()
      .comment('The kind field of the entity, normalized');
    table
      .string('name_normalized')
      .nullable()
      .comment('The metadata.name field of the entity, normalized');
    table
      .string('namespace_normalized')
      .nullable()
      .comment('The metadata.namespace field of the entity, normalized');
    table.dropUnique([], 'entities_unique_name');
    table.unique(
      ['kind_normalized', 'name_normalized', 'namespace_normalized'],
      'entities_unique_name_normalized',
    );
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.alterTable('entities', table => {
    table.dropUnique([], 'entities_unique_name_normalized');
    table.unique(['kind', 'name', 'namespace'], 'entities_unique_name');
    table.dropColumns(
      'kind_normalized',
      'name_normalized',
      'namespace_normalized',
    );
  });
}
