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

import { CATALOG_FILTER_EXISTS } from '../types';
import { InMemoryCatalogClient } from './InMemoryCatalogClient';
import { Entity } from '@backstage/catalog-model';

const entity1: Entity = {
  apiVersion: 'v1',
  kind: 'CustomKind',
  metadata: {
    namespace: 'default',
    name: 'e1',
    uid: 'u1',
    annotations: { 'backstage.io/orphan': 'true' },
    tags: ['java', 'spring'],
  },
  spec: {
    type: 'service',
    lifecycle: 'production',
  },
  relations: [{ type: 'relatedTo', targetRef: 'secondcustomkind:default/e2' }],
};

const entity2: Entity = {
  apiVersion: 'v1',
  kind: 'SecondCustomKind',
  metadata: {
    namespace: 'default',
    name: 'e2',
    uid: 'u2',
    tags: ['python'],
  },
  spec: {
    type: 'library',
    lifecycle: 'experimental',
  },
};

const entity3: Entity = {
  apiVersion: 'v1',
  kind: 'CustomKind',
  metadata: {
    namespace: 'other',
    name: 'e3',
    uid: 'u3',
    tags: ['java', 'quarkus'],
  },
  spec: {
    type: 'service',
    lifecycle: 'production',
  },
};

const entity4: Entity = {
  apiVersion: 'v1',
  kind: 'SecondCustomKind',
  metadata: {
    namespace: 'default',
    name: 'e4',
    uid: 'u4',
  },
  spec: {
    type: 'website',
  },
};

const entities = [entity1, entity2, entity3, entity4];

describe('InMemoryCatalogClient', () => {
  describe('getEntities', () => {
    it('returns all entities without a filter', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(client.getEntities()).resolves.toEqual({ items: entities });
    });

    it('filters by metadata.name case-insensitively', async () => {
      const client = new InMemoryCatalogClient({ entities });

      await expect(
        client.getEntities({ filter: { 'metadata.name': 'E1' } }),
      ).resolves.toEqual({ items: [entity1] });

      await expect(
        client.getEntities({ filter: { 'metadata.uid': 'u2' } }),
      ).resolves.toEqual({ items: [entity2] });

      await expect(
        client.getEntities({ filter: { 'metadata.uid': 'U2' } }),
      ).resolves.toEqual({ items: [entity2] });
    });

    it('supports CATALOG_FILTER_EXISTS', async () => {
      const client = new InMemoryCatalogClient({ entities });

      await expect(
        client.getEntities({
          filter: { 'relations.relatedto': CATALOG_FILTER_EXISTS },
        }),
      ).resolves.toEqual({ items: [entity1] });
    });

    it('supports filtering by relation value', async () => {
      const client = new InMemoryCatalogClient({ entities });

      await expect(
        client.getEntities({
          filter: { 'relations.relatedTo': 'secondcustomkind:default/e2' },
        }),
      ).resolves.toEqual({ items: [entity1] });
    });

    it('supports array filter values as OR', async () => {
      const client = new InMemoryCatalogClient({ entities });

      await expect(
        client.getEntities({
          filter: { kind: ['not-existing', 'CustomKind'] },
        }),
      ).resolves.toEqual({ items: [entity1, entity3] });

      await expect(
        client.getEntities({
          filter: { kind: ['SecondCustomKind', 'also-not-existing'] },
        }),
      ).resolves.toEqual({ items: [entity2, entity4] });
    });

    it('supports multiple filter sets as OR', async () => {
      const client = new InMemoryCatalogClient({ entities });

      await expect(
        client.getEntities({
          filter: [{ 'metadata.name': 'e1' }, { 'metadata.name': 'e3' }],
        }),
      ).resolves.toEqual({ items: [entity1, entity3] });
    });

    it('orders results ascending', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntities({
        order: { field: 'metadata.name', order: 'asc' },
      });
      expect(result.items.map(e => e.metadata.name)).toEqual([
        'e1',
        'e2',
        'e3',
        'e4',
      ]);
    });

    it('orders results descending', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntities({
        order: { field: 'metadata.name', order: 'desc' },
      });
      expect(result.items.map(e => e.metadata.name)).toEqual([
        'e4',
        'e3',
        'e2',
        'e1',
      ]);
    });

    it('supports multi-level ordering', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntities({
        order: [
          { field: 'kind', order: 'asc' },
          { field: 'metadata.name', order: 'desc' },
        ],
      });
      expect(result.items.map(e => e.metadata.name)).toEqual([
        'e3',
        'e1',
        'e4',
        'e2',
      ]);
    });

    it('sorts entities with missing order fields last regardless of direction', async () => {
      const client = new InMemoryCatalogClient({ entities });

      // entity4 has no lifecycle field - should be last in ascending
      const asc = await client.getEntities({
        order: { field: 'spec.lifecycle', order: 'asc' },
      });
      expect(asc.items[asc.items.length - 1].metadata.name).toBe('e4');

      // entity4 should also be last in descending
      const desc = await client.getEntities({
        order: { field: 'spec.lifecycle', order: 'desc' },
      });
      expect(desc.items[desc.items.length - 1].metadata.name).toBe('e4');
    });

    it('uses entity ref as stable tie-breaker when sort values are equal', async () => {
      // entity1 (customkind:default/e1) and entity3 (customkind:other/e3) are both CustomKind
      // entity2 (secondcustomkind:default/e2) and entity4 (secondcustomkind:default/e4) are both SecondCustomKind
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntities({
        order: { field: 'kind', order: 'asc' },
      });
      // Within same kind, should be sorted by entity ref
      expect(result.items.map(e => e.metadata.name)).toEqual([
        'e1',
        'e3',
        'e2',
        'e4',
      ]);
    });

    it('applies offset and limit', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntities({
        order: { field: 'metadata.name', order: 'asc' },
        offset: 1,
        limit: 2,
      });
      expect(result.items.map(e => e.metadata.name)).toEqual(['e2', 'e3']);
    });

    it('applies limit only', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntities({
        order: { field: 'metadata.name', order: 'asc' },
        limit: 2,
      });
      expect(result.items.map(e => e.metadata.name)).toEqual(['e1', 'e2']);
    });

    it('applies offset only', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntities({
        order: { field: 'metadata.name', order: 'asc' },
        offset: 2,
      });
      expect(result.items.map(e => e.metadata.name)).toEqual(['e3', 'e4']);
    });

    it('supports the after cursor for pagination', async () => {
      const client = new InMemoryCatalogClient({ entities });

      const cursor = Buffer.from(
        JSON.stringify({ offset: 2, limit: 1 }),
      ).toString('base64');

      const result = await client.getEntities({
        order: { field: 'metadata.name', order: 'asc' },
        after: cursor,
      });
      expect(result.items.map(e => e.metadata.name)).toEqual(['e3']);
    });

    it('applies field projection', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntities({
        filter: { 'metadata.name': 'e1' },
        fields: ['kind', 'metadata.name'],
      });
      expect(result.items).toEqual([
        { kind: 'CustomKind', metadata: { name: 'e1' } },
      ]);
    });

    it('applies field projection for nested paths', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntities({
        filter: { 'metadata.name': 'e1' },
        fields: ['metadata'],
      });
      expect(result.items).toEqual([{ metadata: entity1.metadata }]);
    });

    it('handles dotted annotation keys in field projection', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntities({
        filter: { 'metadata.name': 'e1' },
        fields: ['metadata.annotations.backstage.io/orphan'],
      });
      expect(result.items).toEqual([
        {
          metadata: {
            annotations: { 'backstage.io/orphan': 'true' },
          },
        },
      ]);
    });

    it('silently skips fields that do not exist on entities', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntities({
        filter: { 'metadata.name': 'e1' },
        fields: ['kind', 'spec.nonexistent', 'metadata.name'],
      });
      expect(result.items).toEqual([
        { kind: 'CustomKind', metadata: { name: 'e1' } },
      ]);
    });

    it('applies field projection with ordering and pagination', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntities({
        order: { field: 'metadata.name', order: 'desc' },
        offset: 1,
        limit: 2,
        fields: ['metadata.name'],
      });
      expect(result.items).toEqual([
        { metadata: { name: 'e3' } },
        { metadata: { name: 'e2' } },
      ]);
    });
  });

  describe('getEntitiesByRefs', () => {
    it('returns entities in the same order as refs', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(
        client.getEntitiesByRefs({
          entityRefs: [
            'secondcustomkind:default/e2',
            'customkind:missing/missing',
            'customkind:default/e1',
          ],
        }),
      ).resolves.toEqual({ items: [entity2, undefined, entity1] });
    });

    it('supports additional filter on refs', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(
        client.getEntitiesByRefs({
          entityRefs: [
            'secondcustomkind:default/e2',
            'customkind:missing/missing',
            'customkind:default/e1',
          ],
          filter: { 'metadata.uid': 'u1' },
        }),
      ).resolves.toEqual({ items: [undefined, undefined, entity1] });
    });

    it('applies field projection', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntitiesByRefs({
        entityRefs: [
          'secondcustomkind:default/e2',
          'customkind:missing/missing',
          'customkind:default/e1',
        ],
        fields: ['kind', 'metadata.name'],
      });
      expect(result.items).toEqual([
        { kind: 'SecondCustomKind', metadata: { name: 'e2' } },
        undefined,
        { kind: 'CustomKind', metadata: { name: 'e1' } },
      ]);
    });
  });

  describe('queryEntities', () => {
    it('returns all entities without parameters', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(client.queryEntities()).resolves.toEqual({
        items: entities,
        totalItems: 4,
        pageInfo: {},
      });
    });

    it('filters by entity filter', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(
        client.queryEntities({ filter: { 'metadata.uid': 'u2' } }),
      ).resolves.toEqual({
        items: [entity2],
        totalItems: 1,
        pageInfo: {},
      });
    });

    it('supports full-text search on the sort field by default', async () => {
      const client = new InMemoryCatalogClient({ entities });
      // When no fullTextFilter.fields are given, the backend defaults to the
      // sort field. Here we sort by spec.type and search for 'service'.
      const result = await client.queryEntities({
        fullTextFilter: { term: 'service' },
        orderFields: { field: 'spec.type', order: 'asc' },
      });
      expect(result.items).toEqual([entity1, entity3]);
      expect(result.totalItems).toBe(2);
    });

    it('defaults full-text search to metadata.uid when no sort field', async () => {
      const client = new InMemoryCatalogClient({ entities });
      // Without orderFields, defaults to searching metadata.uid
      const result = await client.queryEntities({
        fullTextFilter: { term: 'u1' },
      });
      expect(result.items).toEqual([entity1]);
    });

    it('supports full-text search limited to specific fields', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.queryEntities({
        fullTextFilter: { term: 'e1', fields: ['metadata.name'] },
      });
      expect(result.items).toEqual([entity1]);
    });

    it('supports full-text search across multiple explicit fields', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.queryEntities({
        fullTextFilter: {
          term: 'e',
          fields: ['metadata.name', 'metadata.uid'],
        },
        orderFields: { field: 'metadata.name', order: 'asc' },
      });
      // All entities have 'e' in their name
      expect(result.items).toEqual(
        expect.arrayContaining([entity1, entity2, entity3, entity4]),
      );
    });

    it('supports case-insensitive full-text search', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.queryEntities({
        fullTextFilter: { term: 'SERVICE', fields: ['spec.type'] },
      });
      expect(result.items).toEqual([entity1, entity3]);
    });

    it('trims whitespace from full-text search term', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.queryEntities({
        fullTextFilter: { term: ' service ', fields: ['spec.type'] },
      });
      expect(result.items).toEqual([entity1, entity3]);
    });

    it('ignores empty full-text search term', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.queryEntities({
        fullTextFilter: { term: '  ' },
      });
      expect(result.items).toEqual(entities);
    });

    it('orders results by orderFields', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.queryEntities({
        orderFields: { field: 'metadata.name', order: 'desc' },
      });
      expect(result.items.map(e => e.metadata.name)).toEqual([
        'e4',
        'e3',
        'e2',
        'e1',
      ]);
    });

    it('supports multi-level ordering', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.queryEntities({
        orderFields: [
          { field: 'spec.type', order: 'asc' },
          { field: 'metadata.name', order: 'asc' },
        ],
      });
      expect(result.items.map(e => e.metadata.name)).toEqual([
        'e2',
        'e1',
        'e3',
        'e4',
      ]);
    });

    it('uses entity ref as stable tie-breaker for equal sort values', async () => {
      // entity1 and entity3 both have spec.type = 'service'
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.queryEntities({
        filter: { 'spec.type': 'service' },
        orderFields: { field: 'spec.type', order: 'asc' },
      });
      // customkind:default/e1 < customkind:other/e3 lexicographically
      expect(result.items.map(e => e.metadata.name)).toEqual(['e1', 'e3']);
    });

    it('sorts entities with missing order fields last for both directions', async () => {
      const client = new InMemoryCatalogClient({ entities });

      const asc = await client.queryEntities({
        orderFields: { field: 'spec.lifecycle', order: 'asc' },
      });
      expect(asc.items[asc.items.length - 1].metadata.name).toBe('e4');

      const desc = await client.queryEntities({
        orderFields: { field: 'spec.lifecycle', order: 'desc' },
      });
      expect(desc.items[desc.items.length - 1].metadata.name).toBe('e4');
    });

    it('returns paginated results with limit', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.queryEntities({
        orderFields: { field: 'metadata.name', order: 'asc' },
        limit: 2,
      });
      expect(result.items.map(e => e.metadata.name)).toEqual(['e1', 'e2']);
      expect(result.totalItems).toBe(4);
      expect(result.pageInfo.nextCursor).toBeDefined();
      expect(result.pageInfo.prevCursor).toBeUndefined();
    });

    it('returns paginated results with offset and limit', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.queryEntities({
        orderFields: { field: 'metadata.name', order: 'asc' },
        offset: 1,
        limit: 2,
      });
      expect(result.items.map(e => e.metadata.name)).toEqual(['e2', 'e3']);
      expect(result.totalItems).toBe(4);
      expect(result.pageInfo.nextCursor).toBeDefined();
      expect(result.pageInfo.prevCursor).toBeDefined();
    });

    it('paginates forward through all pages using cursors', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const allNames: string[] = [];

      const page1 = await client.queryEntities({
        orderFields: { field: 'metadata.name', order: 'asc' },
        limit: 2,
      });
      allNames.push(...page1.items.map(e => e.metadata.name));
      expect(page1.pageInfo.nextCursor).toBeDefined();
      expect(page1.pageInfo.prevCursor).toBeUndefined();

      const page2 = await client.queryEntities({
        cursor: page1.pageInfo.nextCursor!,
        limit: 2,
      });
      allNames.push(...page2.items.map(e => e.metadata.name));
      expect(page2.pageInfo.nextCursor).toBeUndefined();
      expect(page2.pageInfo.prevCursor).toBeDefined();

      expect(allNames).toEqual(['e1', 'e2', 'e3', 'e4']);
      expect(page1.totalItems).toBe(4);
      expect(page2.totalItems).toBe(4);
    });

    it('paginates backward using prevCursor', async () => {
      const client = new InMemoryCatalogClient({ entities });

      const page1 = await client.queryEntities({
        orderFields: { field: 'metadata.name', order: 'asc' },
        offset: 2,
        limit: 2,
      });
      expect(page1.items.map(e => e.metadata.name)).toEqual(['e3', 'e4']);
      expect(page1.pageInfo.prevCursor).toBeDefined();

      const page0 = await client.queryEntities({
        cursor: page1.pageInfo.prevCursor!,
        limit: 2,
      });
      expect(page0.items.map(e => e.metadata.name)).toEqual(['e1', 'e2']);
      expect(page0.pageInfo.prevCursor).toBeUndefined();
    });

    it('handles page size of 1 for fine-grained pagination', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const allNames: string[] = [];
      let cursor: string | undefined;

      const first = await client.queryEntities({
        orderFields: { field: 'metadata.name', order: 'asc' },
        limit: 1,
      });
      allNames.push(...first.items.map(e => e.metadata.name));
      cursor = first.pageInfo.nextCursor;

      while (cursor) {
        const page = await client.queryEntities({ cursor, limit: 1 });
        allNames.push(...page.items.map(e => e.metadata.name));
        cursor = page.pageInfo.nextCursor;
      }

      expect(allNames).toEqual(['e1', 'e2', 'e3', 'e4']);
    });

    it('produces stable pagination with clashing sort values', async () => {
      // entity1 and entity3 both have spec.type = 'service'
      // entity2 has spec.type = 'library', entity4 has spec.type = 'website'
      const client = new InMemoryCatalogClient({ entities });
      const allNames: string[] = [];
      let cursor: string | undefined;

      const first = await client.queryEntities({
        orderFields: { field: 'spec.type', order: 'asc' },
        limit: 1,
      });
      allNames.push(...first.items.map(e => e.metadata.name));
      cursor = first.pageInfo.nextCursor;

      while (cursor) {
        const page = await client.queryEntities({ cursor, limit: 1 });
        allNames.push(...page.items.map(e => e.metadata.name));
        cursor = page.pageInfo.nextCursor;
      }

      // library < service < website, with tie-break by entity ref
      expect(allNames).toEqual(['e2', 'e1', 'e3', 'e4']);
    });

    it('combines filter, full-text search, and ordering with pagination', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.queryEntities({
        filter: { kind: 'CustomKind' },
        fullTextFilter: { term: 'java', fields: ['metadata.tags'] },
        orderFields: { field: 'metadata.name', order: 'desc' },
        limit: 1,
      });
      expect(result.items.map(e => e.metadata.name)).toEqual(['e3']);
      expect(result.totalItems).toBe(2);
      expect(result.pageInfo.nextCursor).toBeDefined();

      const page2 = await client.queryEntities({
        cursor: result.pageInfo.nextCursor!,
        limit: 1,
      });
      expect(page2.items.map(e => e.metadata.name)).toEqual(['e1']);
      expect(page2.pageInfo.nextCursor).toBeUndefined();
    });

    it('applies field projection', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.queryEntities({
        filter: { 'metadata.name': 'e1' },
        fields: ['kind', 'metadata.name'],
      });
      expect(result.items).toEqual([
        { kind: 'CustomKind', metadata: { name: 'e1' } },
      ]);
    });

    it('applies field projection with cursor pagination', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const page1 = await client.queryEntities({
        orderFields: { field: 'metadata.name', order: 'asc' },
        limit: 2,
        fields: ['metadata.name'],
      });
      expect(page1.items).toEqual([
        { metadata: { name: 'e1' } },
        { metadata: { name: 'e2' } },
      ]);

      const page2 = await client.queryEntities({
        cursor: page1.pageInfo.nextCursor!,
        limit: 2,
        fields: ['metadata.name'],
      });
      expect(page2.items).toEqual([
        { metadata: { name: 'e3' } },
        { metadata: { name: 'e4' } },
      ]);
    });

    it('throws InputError for invalid cursor', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(
        client.queryEntities({ cursor: 'not-valid-base64!' }),
      ).rejects.toThrow('Invalid cursor');
    });
  });

  describe('streamEntities', () => {
    it('streams all entities', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const stream = client.streamEntities();
      const results: Entity[][] = [];
      for await (const page of stream) {
        results.push(page);
      }
      expect(results).toEqual([entities]);
    });

    it('streams with filtering and ordering', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const stream = client.streamEntities({
        filter: { kind: 'CustomKind' },
        orderFields: { field: 'metadata.name', order: 'desc' },
      });
      const results: Entity[][] = [];
      for await (const page of stream) {
        results.push(page);
      }
      expect(results.flat().map(e => e.metadata.name)).toEqual(['e3', 'e1']);
    });

    it('streams in pages based on pageSize', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const stream = client.streamEntities({ pageSize: 2 });
      const results: Entity[][] = [];
      for await (const page of stream) {
        results.push(page);
      }
      expect(results).toHaveLength(2);
      expect(results[0]).toHaveLength(2);
      expect(results[1]).toHaveLength(2);
      expect(results.flat()).toEqual(entities);
    });

    it('streams with full-text filter', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const stream = client.streamEntities({
        fullTextFilter: { term: 'library', fields: ['spec.type'] },
      });
      const results: Entity[][] = [];
      for await (const page of stream) {
        results.push(page);
      }
      expect(results.flat()).toEqual([entity2]);
    });
  });

  describe('getEntityAncestors', () => {
    it('returns the entity with empty parent refs', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(
        client.getEntityAncestors({
          entityRef: 'secondcustomkind:default/e2',
        }),
      ).resolves.toEqual({
        rootEntityRef: 'secondcustomkind:default/e2',
        items: [{ entity: entity2, parentEntityRefs: [] }],
      });
    });

    it('throws NotFoundError for missing entity', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(
        client.getEntityAncestors({ entityRef: 'customkind:default/missing' }),
      ).rejects.toThrow('not found');
    });
  });

  describe('getEntityByRef', () => {
    it('returns entity by ref string', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(
        client.getEntityByRef('secondcustomkind:default/e2'),
      ).resolves.toEqual(entity2);
    });

    it('returns undefined for missing entity', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(
        client.getEntityByRef('customkind:missing/missing'),
      ).resolves.toBeUndefined();
    });
  });

  describe('removeEntityByUid', () => {
    it('removes an entity by uid', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(client.getEntities()).resolves.toEqual({
        items: expect.arrayContaining([entity2]),
      });
      await expect(
        client.removeEntityByUid(entity2.metadata.uid!),
      ).resolves.toBeUndefined();
      await expect(client.getEntities()).resolves.not.toEqual({
        items: expect.arrayContaining([entity2]),
      });
    });

    it('is a no-op for non-existent uid', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(
        client.removeEntityByUid('nonexistent'),
      ).resolves.toBeUndefined();
      const result = await client.getEntities();
      expect(result.items).toHaveLength(4);
    });
  });

  describe('refreshEntity', () => {
    it('is a no-op', async () => {
      const client = new InMemoryCatalogClient({ entities });
      await expect(
        client.refreshEntity('secondcustomkind:default/e2'),
      ).resolves.toBeUndefined();
    });
  });

  describe('getEntityFacets', () => {
    it('returns facet counts for a simple field', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntityFacets({ facets: ['kind'] });
      expect(result.facets.kind).toEqual(
        expect.arrayContaining([
          { value: 'CustomKind', count: 2 },
          { value: 'SecondCustomKind', count: 2 },
        ]),
      );
    });

    it('returns facet counts with filter', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntityFacets({
        facets: ['spec.type'],
        filter: { kind: 'CustomKind' },
      });
      expect(result.facets['spec.type']).toEqual([
        { value: 'service', count: 2 },
      ]);
    });

    it('handles multi-valued fields correctly', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntityFacets({
        facets: ['metadata.tags'],
      });
      // entity1 has ['java', 'spring'], entity2 has ['python'], entity3 has ['java', 'quarkus']
      // entity4 has no tags
      expect(result.facets['metadata.tags']).toEqual(
        expect.arrayContaining([
          { value: 'java', count: 2 },
          { value: 'spring', count: 1 },
          { value: 'python', count: 1 },
          { value: 'quarkus', count: 1 },
        ]),
      );
    });

    it('counts each distinct value once per entity', async () => {
      // Entity with duplicate tag values in different forms - the search index
      // might produce duplicates due to traverse behavior. Using a Set ensures
      // each entity only contributes 1 to each facet value's count.
      const dupEntity: Entity = {
        apiVersion: 'v1',
        kind: 'Component',
        metadata: {
          namespace: 'default',
          name: 'dup',
          tags: ['java', 'java'],
        },
      };
      const client = new InMemoryCatalogClient({ entities: [dupEntity] });
      const result = await client.getEntityFacets({
        facets: ['metadata.tags'],
      });
      const javaFacet = result.facets['metadata.tags'].find(
        f => f.value === 'java',
      );
      // Should count as 1 per entity, not 2 for duplicate values
      expect(javaFacet?.count).toBe(1);
    });

    it('returns multiple facets at once', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntityFacets({
        facets: ['kind', 'spec.type'],
      });
      expect(Object.keys(result.facets)).toEqual(['kind', 'spec.type']);
      expect(result.facets.kind).toHaveLength(2);
      expect(result.facets['spec.type']).toEqual(
        expect.arrayContaining([
          { value: 'service', count: 2 },
          { value: 'library', count: 1 },
          { value: 'website', count: 1 },
        ]),
      );
    });

    it('returns empty array for facets with no matching values', async () => {
      const client = new InMemoryCatalogClient({ entities });
      const result = await client.getEntityFacets({
        facets: ['spec.nonexistent'],
      });
      expect(result.facets['spec.nonexistent']).toEqual([]);
    });
  });

  describe('not implemented methods', () => {
    it('throws NotImplementedError for location and validation methods', async () => {
      const client = new InMemoryCatalogClient();
      await expect(client.getLocations()).rejects.toThrow('not implemented');
      await expect(client.getLocationById('id')).rejects.toThrow(
        'not implemented',
      );
      await expect(client.getLocationByRef('ref')).rejects.toThrow(
        'not implemented',
      );
      await expect(client.addLocation({ target: 'test' })).rejects.toThrow(
        'not implemented',
      );
      await expect(client.removeLocationById('id')).rejects.toThrow(
        'not implemented',
      );
      await expect(client.getLocationByEntity('ref')).rejects.toThrow(
        'not implemented',
      );
      await expect(client.validateEntity(entity1, 'url:test')).rejects.toThrow(
        'not implemented',
      );
      await expect(
        client.analyzeLocation({ location: { type: 'url', target: 'test' } }),
      ).rejects.toThrow('not implemented');
    });
  });
});
