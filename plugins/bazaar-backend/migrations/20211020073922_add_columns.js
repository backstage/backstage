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
  await knex.schema.alterTable('metadata', table => {
    table
      .text('size')
      .defaultTo('medium')
      .notNullable()
      .comment('The estimated magnitude of the project');
    table
      .text('timeboxed')
      .defaultTo('no')
      .notNullable()
      .comment('Possible deadline of the project');
    table.text('responsible').comment('Contact person of the project');
  });
};

exports.down = async function down(knex) {
  await knex.schema.alterTable('metadata', table => {
    table.dropColumn('size').dropColumn('timeboxed').dropColumn('responsible');
  });
};
