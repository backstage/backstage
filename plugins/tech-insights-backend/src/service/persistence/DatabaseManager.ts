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
import { getVoidLogger, resolvePackagePath } from '@backstage/backend-common';
import knexFactory, { Knex } from 'knex';
import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';
import { TechInsightsDatabase } from './TechInsightsDatabase';
import { TechInsightsStore } from '@backstage/plugin-tech-insights-common';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-tech-insights-backend',
  'migrations',
);

/**
 * A Container for persistence related components in TechInsights
 *
 * @public
 */
export type PersistenceContext = {
  techInsightsStore: TechInsightsStore;
};

export type CreateDatabaseOptions = {
  logger: Logger;
};

const defaultOptions: CreateDatabaseOptions = {
  logger: getVoidLogger(),
};

/**
 * A factory class to construct persistence context for both running implmentation and test cases.
 *
 * @public
 */
export class DatabaseManager {
  public static async initializePersistenceContext(
    knex: Knex,
    options: CreateDatabaseOptions = defaultOptions,
  ): Promise<PersistenceContext> {
    await knex.migrate.latest({
      directory: migrationsDir,
    });
    return {
      techInsightsStore: new TechInsightsDatabase(knex, options.logger),
    };
  }

  public static async createTestDatabase(
    knex: Knex,
  ): Promise<PersistenceContext> {
    const knexInstance = knex ?? (await this.createTestDatabaseConnection());
    return await this.initializePersistenceContext(knexInstance);
  }

  public static async createTestDatabaseConnection(): Promise<Knex> {
    const config: Knex.Config = {
      client: 'sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    };

    let knexInstance = knexFactory(config);
    if (typeof config.connection !== 'string') {
      const tempDbName = `d${uuidv4().replace(/-/g, '')}`;
      await knexInstance.raw(`CREATE DATABASE ${tempDbName};`);
      knexInstance = knexFactory({
        ...config,
        connection: {
          ...config.connection,
          database: tempDbName,
        },
      });
    }

    knexInstance.client.pool.on(
      'createSuccess',
      (_eventId: any, resource: any) => {
        resource.run('PRAGMA foreign_keys = ON', () => {});
      },
    );

    return knexInstance;
  }
}
