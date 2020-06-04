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
import { CommonDatabase } from './CommonDatabase';
import { Database } from './types';

export class DatabaseManager {
  public static async createDatabase(
    database: Knex,
    logger: Logger,
  ): Promise<Database> {
    await database.migrate.latest({
      directory: path.resolve(__dirname, 'migrations'),
      loadExtensions: ['.js'],
    });
    return new CommonDatabase(database, logger);
  }

  public static async createInMemoryDatabase(
    logger: Logger,
  ): Promise<Database> {
    const knex = Knex({
      client: 'sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });
    knex.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
      resource.run('PRAGMA foreign_keys = ON', () => {});
    });
    return DatabaseManager.createDatabase(knex, logger);
  }
}
