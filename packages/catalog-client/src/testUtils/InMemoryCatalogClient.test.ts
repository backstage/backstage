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
  },
  relations: [{ type: 'relatedTo', targetRef: 'customkind:default/e2' }],
};

const entity2: Entity = {
  apiVersion: 'v1',
  kind: 'CustomKind',
  metadata: {
    namespace: 'default',
    name: 'e2',
    uid: 'u2',
  },
};

const entities = [entity1, entity2];

describe('InMemoryCatalogClient', () => {
  it('getEntities', async () => {
    const client = new InMemoryCatalogClient({ entities });

    await expect(client.getEntities()).resolves.toEqual({ items: entities });

    await expect(
      client.getEntities({ filter: { 'metadata.name': 'E1' } }),
    ).resolves.toEqual({ items: [entity1] });

    await expect(
      client.getEntities({ filter: { 'metadata.uid': 'u2' } }),
    ).resolves.toEqual({ items: [entity2] });

    await expect(
      client.getEntities({ filter: { 'metadata.uid': 'U2' } }),
    ).resolves.toEqual({ items: [entity2] });

    await expect(
      client.getEntities({
        filter: { 'relations.relatedto': CATALOG_FILTER_EXISTS },
      }),
    ).resolves.toEqual({ items: [entity1] });

    await expect(
      client.getEntities({
        filter: { 'relations.relatedTo': 'customkind:default/e2' },
      }),
    ).resolves.toEqual({ items: [entity1] });
  });

  it('getEntitiesByRefs', async () => {
    const client = new InMemoryCatalogClient({ entities });
    await expect(
      client.getEntitiesByRefs({
        entityRefs: [
          'customkind:default/e2',
          'customkind:missing/missing',
          'customkind:default/e1',
        ],
      }),
    ).resolves.toEqual({ items: [entity2, undefined, entity1] });
    await expect(
      client.getEntitiesByRefs({
        entityRefs: [
          'customkind:default/e2',
          'customkind:missing/missing',
          'customkind:default/e1',
        ],
        filter: { 'metadata.uid': 'u1' },
      }),
    ).resolves.toEqual({ items: [undefined, undefined, entity1] });
  });

  it('queryEntities', async () => {
    const client = new InMemoryCatalogClient({ entities });
    await expect(client.queryEntities()).resolves.toEqual({
      items: entities,
      totalItems: 2,
      pageInfo: {},
    });
    await expect(
      client.queryEntities({ filter: { 'metadata.uid': 'u2' } }),
    ).resolves.toEqual({
      items: [entity2],
      totalItems: 1,
      pageInfo: {},
    });
  });

  it('getEntityAncestors', async () => {
    const client = new InMemoryCatalogClient({ entities });
    await expect(
      client.getEntityAncestors({ entityRef: 'customkind:default/e2' }),
    ).resolves.toEqual({
      rootEntityRef: 'customkind:default/e2',
      items: [{ entity: entity2, parentEntityRefs: [] }],
    });
  });

  it('getEntityByRef', async () => {
    const client = new InMemoryCatalogClient({ entities });
    await expect(
      client.getEntityByRef('customkind:default/e2'),
    ).resolves.toEqual(entity2);
    await expect(
      client.getEntityByRef('customkind:missing/missing'),
    ).resolves.toBeUndefined();
  });

  it('removeEntityByUid', async () => {
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

  it('refreshEntity', async () => {
    const client = new InMemoryCatalogClient({ entities });
    await expect(
      client.refreshEntity('customkind:default/e2'),
    ).resolves.toBeUndefined();
  });
});
