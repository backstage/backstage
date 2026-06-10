/*
 * Copyright 2025 The Backstage Authors
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

import {
  TestDatabaseId,
  TestDatabases,
  mockServices,
} from '@backstage/backend-test-utils';
import { z } from 'zod/v4';
import { DefaultKeyValueStoreService } from './DefaultKeyValueStoreService';

jest.setTimeout(60_000);

describe('DefaultKeyValueStoreService', () => {
  const databases = TestDatabases.create();

  async function createService(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    return DefaultKeyValueStoreService.create({
      database: mockServices.database({ knex }),
    });
  }

  describe('withSchema', () => {
    it('rejects invalid namespace names', () => {
      const service = DefaultKeyValueStoreService.create({
        database: mockServices.database.mock({ getClient: jest.fn() }),
      });

      expect(() =>
        service.withSchema({
          namespace: '',
          schema: z.object({}),
        }),
      ).toThrow(/must be a non-empty string/);

      expect(() =>
        service.withSchema({
          namespace: 'UPPER',
          schema: z.object({}),
        }),
      ).toThrow(/must be a non-empty string/);

      expect(() =>
        service.withSchema({
          namespace: 'has space',
          schema: z.object({}),
        }),
      ).toThrow(/must be a non-empty string/);

      expect(() =>
        service.withSchema({
          namespace: 'has_underscore',
          schema: z.object({}),
        }),
      ).toThrow(/must be a non-empty string/);

      expect(() =>
        service.withSchema({
          namespace: 'valid-name-0',
          schema: z.object({}),
        }),
      ).not.toThrow();
    });
  });

  describe.each(databases.eachSupportedId())('%p', databaseId => {
    it('returns undefined for a non-existent key', async () => {
      const service = await createService(databaseId);
      const ns = service.withSchema({
        namespace: 'test',
        schema: z.object({ count: z.number() }),
      });

      await expect(ns.get('missing')).resolves.toBeUndefined();
    });

    it('roundtrips a value through set and get', async () => {
      const service = await createService(databaseId);
      const ns = service.withSchema({
        namespace: 'test',
        schema: z.object({ count: z.number(), label: z.string() }),
      });

      await ns.set('item-1', { count: 5, label: 'hello' });
      const result = await ns.get('item-1');

      expect(result).toEqual({ count: 5, label: 'hello' });
    });

    it('fills in schema defaults on set', async () => {
      const service = await createService(databaseId);
      const ns = service.withSchema({
        namespace: 'test',
        schema: z.object({
          count: z.number(),
          label: z.string().default('untitled'),
        }),
      });

      await ns.set('item-1', { count: 5 });
      const result = await ns.get('item-1');

      expect(result).toEqual({ count: 5, label: 'untitled' });
    });

    it('upserts on repeated set for the same key', async () => {
      const service = await createService(databaseId);
      const ns = service.withSchema({
        namespace: 'test',
        schema: z.object({ value: z.string() }),
      });

      await ns.set('key', { value: 'first' });
      await ns.set('key', { value: 'second' });
      const result = await ns.get('key');

      expect(result).toEqual({ value: 'second' });
    });

    it('deletes a key', async () => {
      const service = await createService(databaseId);
      const ns = service.withSchema({
        namespace: 'test',
        schema: z.object({ value: z.string() }),
      });

      await ns.set('key', { value: 'hello' });
      await ns.delete('key');

      await expect(ns.get('key')).resolves.toBeUndefined();
    });

    it('does not throw when deleting a non-existent key', async () => {
      const service = await createService(databaseId);
      const ns = service.withSchema({
        namespace: 'test',
        schema: z.object({ value: z.string() }),
      });

      await expect(ns.delete('missing')).resolves.toBeUndefined();
    });

    it('lists keys in a namespace', async () => {
      const service = await createService(databaseId);
      const ns = service.withSchema({
        namespace: 'test',
        schema: z.object({ v: z.number() }),
      });

      await ns.set('a', { v: 1 });
      await ns.set('b', { v: 2 });
      await ns.set('c', { v: 3 });

      const keys = await ns.listKeys();
      expect(keys.sort()).toEqual(['a', 'b', 'c']);
    });

    it('lists entries in a namespace', async () => {
      const service = await createService(databaseId);
      const ns = service.withSchema({
        namespace: 'test',
        schema: z.object({ v: z.number() }),
      });

      await ns.set('a', { v: 1 });
      await ns.set('b', { v: 2 });

      const entries = await ns.list();
      entries.sort((x, y) => x.key.localeCompare(y.key));
      expect(entries).toEqual([
        { key: 'a', value: { v: 1 } },
        { key: 'b', value: { v: 2 } },
      ]);
    });

    it('isolates namespaces from each other', async () => {
      const service = await createService(databaseId);
      const schema = z.object({ v: z.number() });
      const ns1 = service.withSchema({ namespace: 'ns-1', schema });
      const ns2 = service.withSchema({ namespace: 'ns-2', schema });

      await ns1.set('key', { v: 1 });
      await ns2.set('key', { v: 2 });

      expect(await ns1.get('key')).toEqual({ v: 1 });
      expect(await ns2.get('key')).toEqual({ v: 2 });
      expect(await ns1.listKeys()).toEqual(['key']);
      expect(await ns2.listKeys()).toEqual(['key']);
    });

    it('applies schema defaults on read for migration', async () => {
      const service = await createService(databaseId);

      const v1 = service.withSchema({
        namespace: 'test',
        schema: z.object({ count: z.number() }),
      });
      await v1.set('item', { count: 10 });

      const v2 = service.withSchema({
        namespace: 'test',
        schema: z.object({
          count: z.number(),
          label: z.string().default('migrated'),
        }),
      });
      const result = await v2.get('item');

      expect(result).toEqual({ count: 10, label: 'migrated' });
    });

    it('throws on schema validation failure during set', async () => {
      const service = await createService(databaseId);
      const ns = service.withSchema({
        namespace: 'test',
        schema: z.object({ count: z.number() }),
      });

      await expect(
        ns.set('key', { count: 'not-a-number' } as any),
      ).rejects.toThrow();
    });

    it('returns empty arrays for listKeys and list on empty namespace', async () => {
      const service = await createService(databaseId);
      const ns = service.withSchema({
        namespace: 'empty',
        schema: z.object({ v: z.number() }),
      });

      expect(await ns.listKeys()).toEqual([]);
      expect(await ns.list()).toEqual([]);
    });
  });
});
