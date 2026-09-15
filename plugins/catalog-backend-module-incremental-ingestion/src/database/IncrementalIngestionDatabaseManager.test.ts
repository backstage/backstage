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

import { Knex } from 'knex';
import { TestDatabases } from '@backstage/backend-test-utils';
import { DeferredEntity } from '@backstage/plugin-catalog-node';
import { randomUUID as uuid } from 'node:crypto';
import fs from 'node:fs';
import { IncrementalIngestionDatabaseManager } from './IncrementalIngestionDatabaseManager';

const migrationsDir = `${__dirname}/../../migrations`;
const migrationsFiles = fs.readdirSync(migrationsDir).sort();

async function migrateUpOnce(knex: Knex): Promise<void> {
  await knex.migrate.up({ directory: migrationsDir });
}

async function migrateUntilBefore(knex: Knex, target: string): Promise<void> {
  const index = migrationsFiles.indexOf(target);
  if (index === -1) {
    throw new Error(`Migration ${target} not found`);
  }
  for (let i = 0; i < index; i++) {
    await migrateUpOnce(knex);
  }
}

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

    it('countMarkedEntities correctly sums total count from count query', async () => {
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
      await manager.createMarkEntities(
        'testProvider',
        [makeEntity('comp1'), makeEntity('comp2'), makeEntity('comp3')],
        markId,
      );

      const total = await manager.countMarkedEntities(ingestionId);

      // On PostgreSQL, count queries return strings, so total should be 3 not NaN or string concatenation
      expect(total).toBe(3);
      expect(typeof total).toBe('number');
    });

    it('findStaleEntities detects a stale entity even with no previous cycle bookkeeping', async () => {
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

      // Current cycle only marks comp1; `active_entities` still believes the
      // provider owns comp1 and comp2 (comp2 has no ingestion_marks/
      // ingestion_mark_entities row for any cycle at all, but is present in
      // the running tally from a prior cycle).
      await manager.createMarkEntities(
        'testProvider',
        [makeEntity('comp1')],
        markId,
      );

      await knex('active_entities').insert([
        {
          source_key: 'testProvider',
          entity_ref: 'component:default/comp2',
        },
      ]);

      const stale = await manager.findStaleEntities(
        'testProvider',
        ingestionId,
      );

      expect(stale).toEqual([{ entityRef: 'component:default/comp2' }]);
    });

    it('findStaleEntities does not flag entities that are present in both the tally and the current cycle, or new entities not yet in the tally', async () => {
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

      // comp1 is in the tally and marked this cycle (unchanged).
      // comp3 is marked this cycle, which also adds it to the tally.
      await manager.createMarkEntities(
        'testProvider',
        [makeEntity('comp1'), makeEntity('comp3')],
        markId,
      );

      const stale = await manager.findStaleEntities(
        'testProvider',
        ingestionId,
      );

      expect(stale).toEqual([]);
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
      await manager.createMarkEntities(
        'testProvider',
        [makeEntity('a'), makeEntity('b'), makeEntity('c')],
        markId1,
      );

      const rows1 = await knex('ingestion_mark_entities').select('entity_ref');
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

      await manager.createMarkEntities(
        'testProvider',
        [makeEntity('b'), makeEntity('c'), makeEntity('d')],
        markId2,
      );

      const rows2 = await knex('ingestion_mark_entities')
        .select('entity_ref', 'ingestion_mark_id')
        .orderBy('entity_ref');
      expect(rows2).toHaveLength(4);

      // a stays on markId1, b and c moved to markId2, d is new on markId2
      expect(
        rows2.find(r => r.entity_ref === 'component:default/a')
          ?.ingestion_mark_id,
      ).toBe(markId1);
      expect(
        rows2.find(r => r.entity_ref === 'component:default/b')
          ?.ingestion_mark_id,
      ).toBe(markId2);
      expect(
        rows2.find(r => r.entity_ref === 'component:default/c')
          ?.ingestion_mark_id,
      ).toBe(markId2);
      expect(
        rows2.find(r => r.entity_ref === 'component:default/d')
          ?.ingestion_mark_id,
      ).toBe(markId2);
    });

    it('deleteEntityRecordsByRef removes matching refs scoped to the given provider', async () => {
      const knex = await databases.init(databaseId);
      await knex.migrate.latest({ directory: migrationsDir });

      const manager = new IncrementalIngestionDatabaseManager({ client: knex });
      const { ingestionId } = (await manager.createProviderIngestionRecord(
        'testProvider',
      ))!;
      const { ingestionId: otherIngestionId } =
        (await manager.createProviderIngestionRecord('otherProvider'))!;

      const markId = uuid();
      await manager.createMark({
        record: {
          id: markId,
          ingestion_id: ingestionId,
          sequence: 1,
          cursor: { data: 1 },
        },
      });
      const otherMarkId = uuid();
      await manager.createMark({
        record: {
          id: otherMarkId,
          ingestion_id: otherIngestionId,
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

      await manager.createMarkEntities(
        'testProvider',
        [makeEntity('x'), makeEntity('y'), makeEntity('z')],
        markId,
      );
      // otherProvider owns the same entity ref as one of testProvider's.
      await manager.createMarkEntities(
        'otherProvider',
        [makeEntity('x')],
        otherMarkId,
      );

      // Delete two of testProvider's three; otherProvider's matching ref
      // must survive.
      await manager.deleteEntityRecordsByRef('testProvider', [
        { entityRef: 'component:default/x' },
        { entityRef: 'component:default/z' },
      ]);

      const remaining = await knex('ingestion_mark_entities')
        .select('source_key', 'entity_ref')
        .orderBy('source_key');
      expect(remaining).toEqual([
        { source_key: 'otherProvider', entity_ref: 'component:default/x' },
        { source_key: 'testProvider', entity_ref: 'component:default/y' },
      ]);
    });

    it('migration backfills source_key, dedupes, and renames ref to entity_ref', async () => {
      const knex = await databases.init(databaseId);

      // Migrate up to (but not including) the `source_key` migration under
      // test, so we can seed dirty data under the old schema shape.
      await migrateUntilBefore(
        knex,
        '20260811133818_ingestion_mark_entities_source_key.js',
      );

      const ingestionId = uuid();
      await knex('ingestions').insert({
        id: ingestionId,
        provider_name: 'dupProvider',
        status: 'bursting',
        next_action: 'ingest',
        completion_ticket: 'open',
      });

      const olderMarkId = uuid();
      const newerMarkId = uuid();
      await knex('ingestion_marks').insert([
        {
          id: olderMarkId,
          ingestion_id: ingestionId,
          sequence: 1,
          created_at: new Date('2026-01-01T00:00:00.000Z'),
        },
        {
          id: newerMarkId,
          ingestion_id: ingestionId,
          sequence: 2,
          created_at: new Date('2026-01-02T00:00:00.000Z'),
        },
      ]);

      // A duplicate pair (same eventual source_key + ref) tied to two
      // different marks, plus one unique row.
      await knex('ingestion_mark_entities').insert([
        {
          id: uuid(),
          ingestion_mark_id: olderMarkId,
          ref: 'component:default/dup',
        },
        {
          id: uuid(),
          ingestion_mark_id: newerMarkId,
          ref: 'component:default/dup',
        },
        {
          id: uuid(),
          ingestion_mark_id: newerMarkId,
          ref: 'component:default/unique',
        },
      ]);

      // Apply the migration under test.
      await migrateUpOnce(knex);

      const rows = await knex('ingestion_mark_entities')
        .select('source_key', 'entity_ref', 'ingestion_mark_id')
        .orderBy('entity_ref');

      expect(rows).toEqual([
        {
          source_key: 'dupProvider',
          entity_ref: 'component:default/dup',
          ingestion_mark_id: newerMarkId,
        },
        {
          source_key: 'dupProvider',
          entity_ref: 'component:default/unique',
          ingestion_mark_id: newerMarkId,
        },
      ]);
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

    it('active_entities migration backfills from refresh_state_references for existing installs', async () => {
      const knex = await databases.init(databaseId);

      // Migrate up to (but not including) the migration that creates
      // `active_entities`, then simulate the host catalog's table and an
      // existing incremental ingestion provider before continuing.
      await migrateUntilBefore(knex, '20260811140000_active_entities.js');

      await knex.schema.createTable('refresh_state_references', table => {
        table.increments('id');
        table.text('source_key').nullable();
        table.text('target_entity_ref').notNullable();
      });

      await knex('ingestions').insert({
        id: uuid(),
        provider_name: 'testProvider',
        status: 'resting',
        next_action: 'rest',
        completion_ticket: 'open',
      });

      await knex('refresh_state_references').insert([
        {
          source_key: 'testProvider',
          target_entity_ref: 'component:default/comp1',
        },
        {
          source_key: 'testProvider',
          target_entity_ref: 'component:default/comp2',
        },
        {
          source_key: 'unrelatedSource',
          target_entity_ref: 'component:default/comp3',
        },
      ]);

      await knex.migrate.latest({ directory: migrationsDir });

      const backfilled = await knex('active_entities')
        .select('source_key', 'entity_ref')
        .orderBy('entity_ref');
      expect(backfilled).toEqual([
        { source_key: 'testProvider', entity_ref: 'component:default/comp1' },
        { source_key: 'testProvider', entity_ref: 'component:default/comp2' },
      ]);
    });

    it('deleteEntityRecordsByRef removes matching active_entities refs for the named provider only', async () => {
      const knex = await databases.init(databaseId);
      await knex.migrate.latest({ directory: migrationsDir });

      const manager = new IncrementalIngestionDatabaseManager({ client: knex });

      await knex('active_entities').insert([
        { source_key: 'testProvider', entity_ref: 'component:default/a' },
        { source_key: 'testProvider', entity_ref: 'component:default/b' },
        { source_key: 'otherProvider', entity_ref: 'component:default/a' },
      ]);

      await manager.deleteEntityRecordsByRef('testProvider', [
        { entityRef: 'component:default/a' },
      ]);

      const remaining = await knex('active_entities')
        .select('source_key', 'entity_ref')
        .orderBy(['source_key', 'entity_ref']);
      expect(remaining).toEqual([
        { source_key: 'otherProvider', entity_ref: 'component:default/a' },
        { source_key: 'testProvider', entity_ref: 'component:default/b' },
      ]);
    });
  },
);
