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

import {
  PluginDatabaseManager,
  resolvePackagePath,
} from '@backstage/backend-common';
import { Knex } from 'knex';
import { isNil } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

/**
 * internal
 * @public
 */
export interface BadgesStore {
  getBadgeUuid(
    name: string,
    namespace: string,
    kind: string,
  ): Promise<{ uuid: string }>;

  getBadgeFromUuid(
    uuid: string,
  ): Promise<{ name: string; namespace: string; kind: string } | undefined>;
}

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-badges-backend', // Package name
  'migrations', // Migrations directory
);

/**
 * DatabaseBadgesStore
 * @internal
 */
export class DatabaseBadgesStore implements BadgesStore {
  private constructor(private readonly db: Knex) {}

  static async create({
    database,
    skipMigrations,
  }: {
    database: PluginDatabaseManager;
    skipMigrations?: boolean;
  }): Promise<DatabaseBadgesStore> {
    const client = await database.getClient();

    if (!database.migrations?.skip && !skipMigrations) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }

    return new DatabaseBadgesStore(client);
  }

  async getBadgeFromUuid(
    uuid: string,
  ): Promise<{ name: string; namespace: string; kind: string } | undefined> {
    const result = await this.db('badges')
      .select('namespace', 'name', 'kind')
      .where({ uuid: uuid })
      .first();

    return result;
  }

  async getBadgeUuid(
    name: string,
    namespace: string,
    kind: string,
  ): Promise<{ uuid: string }> {
    const result = await this.db('badges')
      .select('uuid')
      .where({ name: name, namespace: namespace, kind: kind })
      .first();

    let uuid = result?.uuid;

    if (isNil(uuid)) {
      uuid = uuidv4();

      await this.db('badges')
        .insert({
          uuid: uuid,
          name: name,
          namespace: namespace,
          kind: kind,
        })
        .onConflict(['name', 'namespace', 'kind'])
        .ignore();
    }

    return { uuid };
  }
}
