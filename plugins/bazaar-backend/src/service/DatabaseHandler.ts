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

import { resolvePackagePath } from '@backstage/backend-common';
import knexFactory, { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-bazaar-backend',
  'migrations',
);

type Options = {
  database: Knex;
};

export class DatabaseHandler {
  static async create(options: Options): Promise<DatabaseHandler> {
    const { database } = options;

    await database.migrate.latest({
      directory: migrationsDir,
    });

    return new DatabaseHandler(options);
  }

  private readonly database: Knex;

  private constructor(options: Options) {
    this.database = options.database;
  }

  public static async createTestDatabase(): Promise<DatabaseHandler> {
    const knex = await this.createTestDatabaseConnection();
    return await this.create({ database: knex });
  }

  public static async createTestDatabaseConnection(): Promise<Knex> {
    const config: Knex.Config<any> = {
      client: 'pg',
      connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
      },
      /*
      client: 'sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
      */
    };

    let knex = knexFactory(config);
    if (typeof config.connection !== 'string') {
      const tempDbName = `d${uuidv4().replace(/-/g, '')}`;
      await knex.raw(`CREATE DATABASE ${tempDbName};`);
      knex = knexFactory({
        ...config,
        connection: {
          ...config.connection,
          database: tempDbName,
        },
      });
    }

    knex.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
      resource.run('PRAGMA foreign_keys = ON', () => {});
    });

    return knex;
  }

  async getMembers(entityRef: any) {
    return await this.database
      .select('*')
      .from('public.members')
      .where({ entity_ref: entityRef });
  }

  async addMember(userId: any, entityRef: any) {
    await this.database
      .insert({
        entity_ref: entityRef,
        user_id: userId,
      })
      .into('public.members');
  }
}
