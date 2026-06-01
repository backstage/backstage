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
import { DeferredEntity } from '@backstage/plugin-catalog-node';
import { randomUUID as uuid } from 'node:crypto';
import { IncrementalIngestionDatabaseManager } from './IncrementalIngestionDatabaseManager';

const migrationsDir = `${__dirname}/../../migrations`;

jest.setTimeout(60_000);

const databases = TestDatabases.create({
  ids: ['POSTGRES_18', 'POSTGRES_14', 'SQLITE_3'],
});

describe.each(databases.eachSupportedId())(
  'IncrementalIngestionDatabaseManager, %p',
  databaseId => {
    it('stores and retrieves marks', async () => {
      const knex = await databases.init(databaseId);
      await knex.migrate.latest({ directory: migrationsDir });

      const manager = new IncrementalIngestionDatabaseManager({
        client: knex,
      });
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
    });

    it('computeRemoved correctly sums total count from count query', async () => {
      const knex = await databases.init(databaseId);
      await knex.migrate.latest({ directory: migrationsDir });

      const manager = new IncrementalIngestionDatabaseManager({
        client: knex,
      });
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
    });

    it('createMarkEntities handles existing and new refs correctly', async () => {
      const knex = await databases.init(databaseId);
      await knex.migrate.latest({ directory: migrationsDir });

      const manager = new IncrementalIngestionDatabaseManager({ client: knex });
      const { ingestionId } = (await manager.createProviderIngestionRecord(
        'testProvider',
      ))!;

      const markId1 = uuid();
      await manager.createMark({
        record: {
          id: markId1,
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

      // First batch: create 3 entities
      await manager.createMarkEntities(markId1, [
        makeEntity('a'),
        makeEntity('b'),
        makeEntity('c'),
      ]);

      const rows1 = await knex('ingestion_mark_entities').select('ref');
      expect(rows1).toHaveLength(3);

      // Second batch with overlap: b and c already exist, d is new.
      // Existing refs should be updated to the new mark, new refs inserted.
      const markId2 = uuid();
      await manager.createMark({
        record: {
          id: markId2,
          ingestion_id: ingestionId,
          sequence: 2,
          cursor: { data: 2 },
        },
      });

      await manager.createMarkEntities(markId2, [
        makeEntity('b'),
        makeEntity('c'),
        makeEntity('d'),
      ]);

      const rows2 = await knex('ingestion_mark_entities')
        .select('ref', 'ingestion_mark_id')
        .orderBy('ref');
      expect(rows2).toHaveLength(4);

      // a stays on markId1, b and c moved to markId2, d is new on markId2
      expect(
        rows2.find(r => r.ref === 'component:default/a')?.ingestion_mark_id,
      ).toBe(markId1);
      expect(
        rows2.find(r => r.ref === 'component:default/b')?.ingestion_mark_id,
      ).toBe(markId2);
      expect(
        rows2.find(r => r.ref === 'component:default/c')?.ingestion_mark_id,
      ).toBe(markId2);
      expect(
        rows2.find(r => r.ref === 'component:default/d')?.ingestion_mark_id,
      ).toBe(markId2);
    });

    it('deleteEntityRecordsByRef removes matching refs', async () => {
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

      await manager.createMarkEntities(markId, [
        makeEntity('x'),
        makeEntity('y'),
        makeEntity('z'),
      ]);

      // Delete two of the three
      await manager.deleteEntityRecordsByRef([
        { entityRef: 'component:default/x' },
        { entityRef: 'component:default/z' },
      ]);

      const remaining = await knex('ingestion_mark_entities').select('ref');
      expect(remaining).toHaveLength(1);
      expect(remaining[0].ref).toBe('component:default/y');
    });

    it('updateIngestionRecordById with long last_error value', async () => {
      const knex = await databases.init(databaseId);
      await knex.migrate.latest({ directory: migrationsDir });

      const manager = new IncrementalIngestionDatabaseManager({ client: knex });
      const { ingestionId } = (await manager.createProviderIngestionRecord(
        'testLastErrorProvider',
      ))!;
      const expectedLastError = 'a'.repeat(256);

      await manager.updateIngestionRecordById({
        ingestionId,
        update: {
          last_error: expectedLastError,
        },
      });
      const { last_error } = (await manager.getCurrentIngestionRecord(
        'testLastErrorProvider',
      ))!;

      expect(last_error).toEqual(expectedLastError);
    });
  },
);
