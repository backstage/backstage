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

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  // This database migration uses some postgres specific features (like bytea
  // columns and build in functions) and can not be used with other database
  // engines.
  const connection = knex.client.config.connection;
  const pgAnalyzer = connection.pgAnalyzer || 'english';
  await knex.schema.alterTable('documents', table => {
    table.specificType(
      'body',
      `tsvector NOT NULL GENERATED ALWAYS AS (` +
        `setweight(to_tsvector('${pgAnalyzer}', document->>'title'), 'A') || ` +
        `setweight(to_tsvector('${pgAnalyzer}', document->>'text'), 'B') || ` +
        `setweight(to_tsvector('${pgAnalyzer}', document - 'location' - 'title' - 'text'), 'C')` +
        `) STORED`,
    );
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('documents', table => {
    table.specificType(
      'body',
      'tsvector NOT NULL GENERATED ALWAYS AS (' +
        "setweight(to_tsvector('english', document->>'title'), 'A') || " +
        "setweight(to_tsvector('english', document->>'text'), 'B') || " +
        "setweight(to_tsvector('english', document - 'location' - 'title' - 'text'), 'C')" +
        ') STORED',
    );
  });
};
