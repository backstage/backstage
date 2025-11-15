/*
 * Copyright 2023 The Backstage Authors
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

import { TestDatabases } from '@backstage/backend-test-utils';
import { IncrementalIngestionDatabaseManager } from './IncrementalIngestionDatabaseManager';
import { v4 as uuid } from 'uuid';
import { DeferredEntity } from '@backstage/plugin-catalog-node';

const migrationsDir = `${__dirname}/../../migrations`;

jest.setTimeout(60_000);

describe('IncrementalIngestionDatabaseManager', () => {
  const databases = TestDatabases.create({
    ids: ['POSTGRES_18', 'POSTGRES_14', 'SQLITE_3'],
  });

  it.each(databases.eachSupportedId())(
    'stores and retrieves marks, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await knex.migrate.latest({ directory: migrationsDir });

      const manager = new IncrementalIngestionDatabaseManager({ client: knex });
      const { ingestionId } = (await manager.createProviderIngestionRecord(
        'myProvider',
      ))!;

      const cursorId = uuid();

      await manager.createMark({
        record: {
          id: cursorId,
          ingestion_id: ingestionId,
          sequence: 1,
          cursor: { data: 1 },
        },
      });

      await expect(manager.getFirstMark(ingestionId)).resolves.toEqual({
        created_at: expect.anything(),
        cursor: { data: 1 },
        id: cursorId,
        ingestion_id: ingestionId,
        sequence: 1,
      });

      await expect(manager.getLastMark(ingestionId)).resolves.toEqual({
        created_at: expect.anything(),
        cursor: { data: 1 },
        id: cursorId,
        ingestion_id: ingestionId,
        sequence: 1,
      });

      await expect(manager.getAllMarks(ingestionId)).resolves.toEqual([
        {
          created_at: expect.anything(),
          cursor: { data: 1 },
          id: cursorId,
          ingestion_id: ingestionId,
          sequence: 1,
        },
      ]);
    },
  );

  it.each(databases.eachSupportedId())(
    'computeRemoved correctly sums total count from count query, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await knex.migrate.latest({ directory: migrationsDir });

      const manager = new IncrementalIngestionDatabaseManager({ client: knex });
      const { ingestionId } = (await manager.createProviderIngestionRecord(
        'testProvider',
      ))!;

      const markId = uuid();
      await manager.createMark({
        record: {
          id: markId,
          ingestion_id: ingestionId,
          sequence: 1,
          cursor: { data: 1 },
        },
      });

      const makeEntity = (name: string): DeferredEntity => ({
        entity: {
          apiVersion: 'backstage.io/v1alpha1',
          kind: 'Component',
          metadata: { namespace: 'default', name },
        },
      });

      // Create multiple mark entities
      await manager.createMarkEntities(markId, [
        makeEntity('comp1'),
        makeEntity('comp2'),
        makeEntity('comp3'),
      ]);

      const result = await manager.computeRemoved('testProvider', ingestionId);

      // On PostgreSQL, count queries return strings, so total should be 3 not NaN or string concatenation
      expect(result.total).toBe(3);
      expect(typeof result.total).toBe('number');
    },
  );
});
