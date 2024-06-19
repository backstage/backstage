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

import { SqliteEngine } from './sqlite';
import { TestDatabaseId, allDatabases } from './types';

const ourDatabaseIds = Object.entries(allDatabases)
  .filter(([, properties]) => properties.driver.includes('sqlite'))
  .map(([id]) => id as TestDatabaseId);

describe('SqliteEngine', () => {
  it.each(ourDatabaseIds)(
    'should create a database instance, %p',
    async testDatabaseId => {
      for (let i = 0; i < 100; ++i) {
        const properties = allDatabases[testDatabaseId];
        const engine = await SqliteEngine.create(properties);

        const instance1 = await engine.createDatabaseInstance();
        const instance2 = await engine.createDatabaseInstance();
        expect(instance1).toBeDefined();
        expect(instance2).toBeDefined();
        expect(instance1).not.toEqual(instance2);

        await instance1.schema.createTable('t', table => {
          table.string('value');
        });
        await instance2.schema.createTable('t', table => {
          table.string('value');
        });

        await instance1('t').insert({ value: 'value1' });
        await instance2('t').insert({ value: 'value2' });

        await expect(instance1('t')).resolves.toEqual([{ value: 'value1' }]);
        await expect(instance2('t')).resolves.toEqual([{ value: 'value2' }]);

        await engine.shutdown();
      }
    },
  );
});
