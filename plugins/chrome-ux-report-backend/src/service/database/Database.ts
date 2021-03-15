/*
 * Copyright 2021 Spotify AB
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

import { resolvePackagePath } from '@backstage/backend-common';
import { Knex } from 'knex';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-chrome-ux-report-backend',
  'migrations',
);

//const TABLE = 'signing_keys';

/*type Row = {
  created_at: Date; // row.created_at is a string after being returned from the database
  kid: string;
  key: string;
};*/

type Options = {
  database: Knex;
};

export class Database {
  static async create(options: Options): Promise<Database> {
    const { database } = options;

    await database.migrate.latest({
      directory: migrationsDir,
    });

    return new Database(options);
  }

  private readonly database: Knex;

  private constructor(options: Options) {
    this.database = options.database;
  }
}
