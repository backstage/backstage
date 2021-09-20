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

import { Knex } from 'knex';
import set from 'lodash/set';
import { resolvePackagePath } from '@backstage/backend-common';
import { AppConfig, JsonObject } from '@backstage/config';

const migrationsDir = resolvePackagePath(
  '@backstage/config-loader',
  'migrations',
);

const TABLE = 'config';

type ConfigRow = {
  key: string;
  value: string;
};

type Options = {
  database: Knex;
};

export class DatabaseConfigStore {
  static async create(options: Options): Promise<DatabaseConfigStore> {
    const { database } = options;

    await database.migrate.latest({
      directory: migrationsDir,
    });

    return new DatabaseConfigStore(options);
  }

  private readonly database: Knex;

  private constructor(options: Options) {
    this.database = options.database;
  }

  async config(): Promise<AppConfig> {
    const rows = await this.database<ConfigRow>(TABLE).select();

    const data = rows.reduce((acc, row) => {
      set(acc, row.key, row.value);
      return acc;
    }, {} as JsonObject);

    return { context: 'database', data };
  }
}
