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

import { TestDatabases } from './TestDatabases';
import { Engine } from './types';

jest.setTimeout(120_000);

const dbs = TestDatabases.create();

describe.each(dbs.eachSupportedId())('TestDatabases, %p', databaseId => {
  it('creates distinct databases', async () => {
    const db1 = await dbs.init(databaseId);
    const db2 = await dbs.init(databaseId);
    await db1.schema.createTable('a', table => table.string('x').primary());
    await db2.schema.createTable('a', table => table.string('y').primary());
    await expect(db1.select({ a: db1.raw('1') })).resolves.toEqual([{ a: 1 }]);
  });
});

describe('shutdown', () => {
  it('shuts down independent database engines concurrently', async () => {
    const databases = TestDatabases.create({ ids: [] });
    const internal = databases as unknown as {
      engineByTestDatabaseId: Map<string, Engine>;
      shutdown(): Promise<void>;
    };
    const started: string[] = [];
    const resolvers: Array<() => void> = [];
    let blockShutdown = true;

    const createEngine = (name: string): Engine => ({
      createDatabaseInstance: jest.fn(),
      shutdown: async () => {
        started.push(name);
        if (blockShutdown) {
          await new Promise<void>(resolve => resolvers.push(resolve));
        }
      },
    });

    for (const name of ['first', 'second']) {
      internal.engineByTestDatabaseId.set(name, createEngine(name));
    }

    const shutdown = internal.shutdown();
    await Promise.resolve();

    try {
      expect(started).toEqual(['first', 'second']);
    } finally {
      blockShutdown = false;
      for (const resolve of resolvers) {
        resolve();
      }
      await shutdown;
    }
  });
});
