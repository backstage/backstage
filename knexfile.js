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

// To create a new migration in a plugin, run:
//
//   yarn workspace <package> knex migrate:make <name_with_underscores>
//
// for example:
//
//   yarn workspace @backstage/plugin-catalog-backend knex migrate:make add_feature_foo
//
// This creates a file similar to
//
//   plugins/catalog-backend/migrations/20240206160252_add_feature_foo.js

module.exports = {
  client: 'better-sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
  migrations: {
    // unfortunately this needs to be relative to the TARGET, not this file, and
    // it just so happens to work to make it go up two steps due to our repo
    // layout
    stub: '../../scripts/templates/knex-migration.stub.js',
  },
};
