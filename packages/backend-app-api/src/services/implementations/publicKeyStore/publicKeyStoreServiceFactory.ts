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
  PublicKeyStoreService,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import { DateTime } from 'luxon';
import { Knex } from 'knex';
import { JsonObject } from '@backstage/types';
import { resolvePackagePath } from '@backstage/backend-common';

const MIGRATIONS_TABLE = 'backstage_backend_public_keys__knex_migrations';
const TABLE = 'backstage_backend_public_keys__keys';

type Row = {
  id: string;
  key: string;
  expires_at: string | Date; // Needs parsing to handle different DB implementations
};

/** @internal */
export class DatabaseKeyStore implements PublicKeyStoreService {
  private constructor(private readonly client: Knex) {}

  static async create(options: { database: DatabaseService }) {
    const { database } = options;

    console.log(`DEBUG: ###### CREATING STORE`);

    const client = await database.getClient();
    if (!database.migrations?.skip) {
      await applyDatabaseMigrations(client);
    }
    return new DatabaseKeyStore(client);
  }

  async addKey(options: {
    id: string;
    key: JsonObject & { kid: string };
    expiresAt: Date;
  }) {
    console.log(`DEBUG: STORING KEY`, options);
    await this.client<Row>(TABLE).insert({
      id: options.key.kid,
      key: JSON.stringify(options.key),
      // TODO: figure out the best way to format this for the DB
      expires_at: DateTime.fromJSDate(options.expiresAt).toSQL()!,
    });
  }

  async listKeys() {
    const rows = await this.client<Row>(TABLE).select();

    // TODO: move over filter/delete the logic from listPublicKeys() in plugins/auth-backend/src/identity/TokenFactory.ts

    return {
      keys: rows.map(row => ({
        key: JSON.parse(row.key),
        expiresAt: parseDate(row.expires_at),
      })),
    };
  }

  // async removeKeys(kids: string[]): Promise<void> {
  //   await this.client(TABLE).delete().whereIn('kid', kids);
  // }
}

export const publicKeyStoreServiceFactory = createServiceFactory({
  service: coreServices.publicKeyStore,
  deps: {
    database: coreServices.database,
  },
  async factory({ database }) {
    return DatabaseKeyStore.create({ database });
  },
});

function parseDate(date: string | Date) {
  const parsedDate =
    typeof date === 'string'
      ? DateTime.fromSQL(date, { zone: 'UTC' })
      : DateTime.fromJSDate(date);

  if (!parsedDate.isValid) {
    throw new Error(
      `Failed to parse date, reason: ${parsedDate.invalidReason}, explanation: ${parsedDate.invalidExplanation}`,
    );
  }

  return parsedDate.toJSDate();
}

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
