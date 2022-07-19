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

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  // This database migration uses some postgres specific features (like bytea
  // columns and build in functions) and can not be used with other database
  // engines.
  await knex.schema.alterTable('documents', table => {
    // Extend the documents table with a column that allows to check whether a
    // document with the same content is already indexed.
    table.specificType('hash', 'bytea');
  });

  await knex('documents').update({
    hash: knex.raw(
      "sha256(replace(document::text || type, '\\', '\\\\')::bytea)",
    ),
  });

  await knex.schema.alterTable('documents', table => {
    table.specificType('hash', 'bytea').notNullable().primary().alter();
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('documents', table => {
    table.dropColumn('hash');
  });
};
