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
  await knex.schema.createTable('badges', table => {
    table.string('kind').notNullable();
    table.string('namespace').notNullable();
    table.string('name').notNullable();
    table
      .string('hash')
      .unique()
      .comment(
        'Hash is calculated from the SHA256 of badge kind, namespace, name, and applications salt',
      )
      .notNullable();
    table.index(['hash'], 'badges_hash_index');
    table.primary(['hash']);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTable('badges');
};
