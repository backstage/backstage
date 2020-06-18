/*
 * Copyright 2020 Spotify AB
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

import Knex from 'knex';
import path from 'path';
import { Logger } from 'winston';
import { PublicKey } from './types';

const migrationsDir = path.resolve(
  require.resolve('@backstage/plugin-auth-backend/package.json'),
  '../migrations',
);

const TABLE = 'signing_keys';

type Row = {
  created_at: Date;
  kid: string;
  key: string;
};

type Options = {
  logger: Logger;
  database: Knex;
};

export class DatabaseKeyStore {
  static async create(options: Options): Promise<DatabaseKeyStore> {
    const { logger, database } = options;

    await database.migrate.latest({
      directory: migrationsDir,
    });

    return new DatabaseKeyStore({ logger, database });
  }

  private readonly logger: Logger;
  private readonly database: Knex;

  private constructor(options: Options) {
    const { logger, database } = options;

    this.database = database;
    this.logger = logger.child({ service: 'key-store' });
  }

  async addPublicKey(key: PublicKey): Promise<void> {
    this.logger.info(`Storing public key ${key.kid}`);

    await this.database<Row>(TABLE).insert({
      kid: key.kid,
      key: JSON.stringify(key),
    });
    console.log(`DEBUG: stored key`);
  }

  async listPublicKeys(): Promise<PublicKey[]> {
    const rows = await this.database<Row>(TABLE).select();
    console.log('DEBUG: rows =', rows);
    return rows.map(row => JSON.parse(row.key));
  }
}
