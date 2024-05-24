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

import {
  DatabaseService,
  LoggerService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { DateTime } from 'luxon';
import { Knex } from 'knex';
import { JsonObject } from '@backstage/types';
import { KeyStore } from './types';

const MIGRATIONS_TABLE = 'backstage_backend_public_keys__knex_migrations';
/** @internal */
export const TABLE = 'backstage_backend_public_keys__keys';

type Row = {
  id: string;
  key: string;
  expires_at: string;
};

export function applyDatabaseMigrations(knex: Knex): Promise<void> {
  const migrationsDir = resolvePackagePath(
    '@backstage/backend-app-api',
    'migrations',
  );

  return knex.migrate.latest({
    directory: migrationsDir,
    tableName: MIGRATIONS_TABLE,
  });
}

/** @internal */
export class DatabaseKeyStore implements KeyStore {
  static async create(options: {
    database: DatabaseService;
    logger: LoggerService;
  }) {
    const { database, logger } = options;

    const client = await database.getClient();
    if (!database.migrations?.skip) {
      await applyDatabaseMigrations(client);
    }
    return new DatabaseKeyStore(client, logger);
  }

  private constructor(
    private readonly client: Knex,
    private readonly logger: LoggerService,
  ) {}

  async addKey(options: {
    id: string;
    key: JsonObject & { kid: string };
    expiresAt: Date;
  }) {
    await this.client<Row>(TABLE).insert({
      id: options.key.kid,
      key: JSON.stringify(options.key),
      expires_at: options.expiresAt.toISOString(),
    });
  }

  async listKeys() {
    const rows = await this.client<Row>(TABLE).select();
    const keys = rows.map(row => ({
      id: row.id,
      key: JSON.parse(row.key),
      expiresAt: new Date(row.expires_at),
    }));

    const validKeys = [];
    const expiredKeys = [];

    for (const key of keys) {
      if (DateTime.fromJSDate(key.expiresAt) < DateTime.local()) {
        expiredKeys.push(key);
      } else {
        validKeys.push(key);
      }
    }

    // Lazily prune expired keys. This may cause duplicate removals if we have concurrent callers, but w/e
    if (expiredKeys.length > 0) {
      const kids = expiredKeys.map(({ key }) => key.kid);

      this.logger.info(
        `Removing expired plugin service keys, '${kids.join("', '")}'`,
      );

      // We don't await this, just let it run in the background
      this.client<Row>(TABLE)
        .delete()
        .whereIn('id', kids)
        .catch(error => {
          this.logger.error(
            'Failed to remove expired plugin service keys',
            error,
          );
        });
    }

    return { keys: validKeys };
  }
}
