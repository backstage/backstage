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

import knexFactory, { Knex } from 'knex';
import { Engine, TestDatabaseProperties } from './types';

export class SqliteEngine implements Engine {
  static async create(
    properties: TestDatabaseProperties,
  ): Promise<SqliteEngine> {
    return new SqliteEngine(properties);
  }

  readonly #properties: TestDatabaseProperties;
  readonly #instances: Knex[];

  constructor(properties: TestDatabaseProperties) {
    this.#properties = properties;
    this.#instances = [];
  }

  async createDatabaseInstance(): Promise<Knex> {
    const instance = knexFactory({
      client: this.#properties.driver,
      connection: ':memory:',
      useNullAsDefault: true,
    });

    instance.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
      resource.run('PRAGMA foreign_keys = ON', () => {});
    });

    this.#instances.push(instance);
    return instance;
  }

  async shutdown(): Promise<void> {
    for (const instance of this.#instances) {
      await instance.destroy();
    }
  }
}
