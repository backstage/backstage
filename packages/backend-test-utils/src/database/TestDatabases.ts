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
import { isDockerDisabledForTests } from '../util/isDockerDisabledForTests';
import { MysqlEngine } from './mysql';
import { PostgresEngine } from './postgres';
import { SqliteEngine } from './sqlite';
import {
  Engine,
  TestDatabaseId,
  TestDatabaseProperties,
  allDatabases,
} from './types';

/**
 * Encapsulates the creation of ephemeral test database instances for use
 * inside unit or integration tests.
 *
 * @public
 */
export class TestDatabases {
  private readonly engineFactoryByDriver: Record<
    string,
    (properties: TestDatabaseProperties) => Promise<Engine>
  > = {
    pg: PostgresEngine.create,
    mysql: MysqlEngine.create,
    mysql2: MysqlEngine.create,
    'better-sqlite3': SqliteEngine.create,
    sqlite3: SqliteEngine.create,
  };
  private readonly engineByTestDatabaseId: Map<string, Engine>;
  private readonly supportedIds: TestDatabaseId[];
  private static defaultIds?: TestDatabaseId[];

  /**
   * Creates an empty `TestDatabases` instance, and sets up Jest to clean up
   * all of its acquired resources after all tests finish.
   *
   * You typically want to create just a single instance like this at the top
   * of your test file or `describe` block, and then call `init` many times on
   * that instance inside the individual tests. Spinning up a "physical"
   * database instance takes a considerable amount of time, slowing down tests.
   * But initializing a new logical database inside that instance using `init`
   * is very fast.
   */
  static create(options?: {
    ids?: TestDatabaseId[];
    disableDocker?: boolean;
  }): TestDatabases {
    const ids = options?.ids;
    const disableDocker = options?.disableDocker ?? isDockerDisabledForTests();

    let testDatabaseIds: TestDatabaseId[];
    if (ids) {
      testDatabaseIds = ids;
    } else if (TestDatabases.defaultIds) {
      testDatabaseIds = TestDatabases.defaultIds;
    } else {
      testDatabaseIds = Object.keys(allDatabases) as TestDatabaseId[];
    }

    const supportedIds = testDatabaseIds.filter(id => {
      const properties = allDatabases[id];
      if (!properties) {
        return false;
      }
      // If the caller has set up the env with an explicit connection string,
      // we'll assume that this database will work
      if (
        properties.connectionStringEnvironmentVariableName &&
        process.env[properties.connectionStringEnvironmentVariableName]
      ) {
        return true;
      }
      // If the database doesn't require docker at all, there's nothing to worry
      // about
      if (!properties.dockerImageName) {
        return true;
      }
      // If the database requires docker, but docker is disabled, we will fail.
      if (disableDocker) {
        return false;
      }
      return true;
    });

    const databases = new TestDatabases(supportedIds);

    if (supportedIds.length > 0) {
      afterAll(async () => {
        await databases.shutdown();
      });
    }

    return databases;
  }

  static setDefaults(options: { ids?: TestDatabaseId[] }) {
    TestDatabases.defaultIds = options.ids;
  }

  private constructor(supportedIds: TestDatabaseId[]) {
    this.engineByTestDatabaseId = new Map();
    this.supportedIds = supportedIds;
  }

  supports(id: TestDatabaseId): boolean {
    return this.supportedIds.includes(id);
  }

  eachSupportedId(): [TestDatabaseId][] {
    return this.supportedIds.map(id => [id]);
  }

  /**
   * Returns a fresh, unique, empty logical database on an instance of the
   * given database ID platform.
   *
   * @param id - The ID of the database platform to use, e.g. 'POSTGRES_13'
   * @returns A `Knex` connection object
   */
  async init(id: TestDatabaseId): Promise<Knex> {
    const properties = allDatabases[id];
    if (!properties) {
      const candidates = Object.keys(allDatabases).join(', ');
      throw new Error(
        `Unknown test database ${id}, possible values are ${candidates}`,
      );
    }
    if (!this.supportedIds.includes(id)) {
      const candidates = this.supportedIds.join(', ');
      throw new Error(
        `Unsupported test database ${id} for this environment, possible values are ${candidates}`,
      );
    }

    let engine = this.engineByTestDatabaseId.get(id);
    if (!engine) {
      const factory = this.engineFactoryByDriver[properties.driver];
      if (!factory) {
        throw new Error(`Unknown database driver ${properties.driver}`);
      }
      engine = await factory(properties);
      this.engineByTestDatabaseId.set(id, engine);
    }

    return await engine.createDatabaseInstance();
  }

  private async shutdown() {
    const engines = [...this.engineByTestDatabaseId.values()];
    this.engineByTestDatabaseId.clear();

    for (const engine of engines) {
      try {
        await engine.shutdown();
      } catch (error) {
        console.warn(`TestDatabases: Failed to shutdown engine`, {
          engine,
          error,
        });
      }
    }
  }
}
