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
import { createQueryCatalogEntitiesAction } from './createQueryCatalogEntitiesAction';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';

const testEntities = [
  {
    kind: 'Component',
    apiVersion: 'backstage.io/v1alpha1',
    metadata: {
      name: 'service-a',
      namespace: 'default',
      annotations: { 'backstage.io/techdocs-ref': 'dir:.' },
    },
    spec: {
      type: 'service',
      dependsOn: ['component:default/shared-lib', 'api:default/user-api'],
    },
  },
  {
    kind: 'Component',
    apiVersion: 'backstage.io/v1alpha1',
    metadata: { name: 'website-b', namespace: 'default' },
    spec: { type: 'website' },
  },
  {
    kind: 'API',
    apiVersion: 'backstage.io/v1alpha1',
    metadata: { name: 'user-api', namespace: 'default' },
    spec: { type: 'openapi' },
  },
  {
    kind: 'Group',
    apiVersion: 'backstage.io/v1alpha1',
    metadata: { name: 'team-alpha', namespace: 'default' },
  },
];

function createCatalogQueryAction(options?: {
  entities?: typeof testEntities;
}) {
  const mockActionsRegistry = actionsRegistryServiceMock();
  const mockCatalog = catalogServiceMock({
    entities: options?.entities ?? testEntities,
  });
  createQueryCatalogEntitiesAction({
    catalog: mockCatalog,
    actionsRegistry: mockActionsRegistry,
  });
  return { invoke: mockActionsRegistry.invoke.bind(mockActionsRegistry) };
}

describe('createQueryCatalogEntitiesAction', () => {
  it('should return all entities when no filter is provided', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: {},
    });

    expect(result.output).toEqual({
      items: testEntities,
      totalItems: 4,
      hasMoreEntities: false,
      nextPageCursor: undefined,
    });
  });

  it('should return empty results when no entities match', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: { query: { kind: 'NonExistent' } },
    });

    expect(result.output).toEqual({
      items: [],
      totalItems: 0,
      hasMoreEntities: false,
      nextPageCursor: undefined,
    });
  });

  it('should filter by kind', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: { query: { kind: 'Component' } },
    });

    expect(result.output).toMatchObject({
      totalItems: 2,
      items: expect.arrayContaining([
        expect.objectContaining({
          metadata: {
            name: 'service-a',
            namespace: 'default',
            annotations: { 'backstage.io/techdocs-ref': 'dir:.' },
          },
        }),
        expect.objectContaining({
          metadata: { name: 'website-b', namespace: 'default' },
        }),
      ]),
    });
  });

  it('should filter with multiple conditions', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: {
        query: { kind: 'Component', 'spec.type': 'service' },
      },
    });

    expect(result.output).toMatchObject({
      totalItems: 1,
      items: [
        expect.objectContaining({
          metadata: expect.objectContaining({ name: 'service-a' }),
        }),
      ],
    });
  });

  it('should support $not operator', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: { query: { $not: { kind: 'Group' } } },
    });

    expect(result.output).toMatchObject({ totalItems: 3 });
    const items = (result.output as any).items;
    expect(items.every((e: any) => e.kind !== 'Group')).toBe(true);
  });

  it('should support $all operator', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: {
        query: {
          $all: [{ kind: 'Component' }, { 'spec.type': 'service' }],
        },
      },
    });

    expect(result.output).toMatchObject({
      totalItems: 1,
      items: [
        expect.objectContaining({
          metadata: expect.objectContaining({ name: 'service-a' }),
        }),
      ],
    });
  });

  it('should support $any operator', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: {
        query: {
          $any: [{ kind: 'API' }, { kind: 'Group' }],
        },
      },
    });

    expect(result.output).toMatchObject({ totalItems: 2 });
    const items = (result.output as any).items;
    expect(
      items.every((e: any) => e.kind === 'API' || e.kind === 'Group'),
    ).toBe(true);
  });

  it('should support $exists: true', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: {
        query: {
          'metadata.annotations.backstage.io/techdocs-ref': { $exists: true },
        },
      },
    });

    expect(result.output).toMatchObject({
      totalItems: 1,
      items: [
        expect.objectContaining({
          metadata: expect.objectContaining({ name: 'service-a' }),
        }),
      ],
    });
  });

  it('should support $exists: false', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: {
        query: {
          'metadata.annotations.backstage.io/techdocs-ref': { $exists: false },
        },
      },
    });

    expect(result.output).toMatchObject({ totalItems: 3 });
    const items = (result.output as any).items;
    expect(items.every((e: any) => e.metadata.name !== 'service-a')).toBe(true);
  });

  it('should support $in operator', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: {
        query: { 'spec.type': { $in: ['service', 'openapi'] } },
      },
    });

    expect(result.output).toMatchObject({ totalItems: 2 });
    const names = (result.output as any).items.map((e: any) => e.metadata.name);
    expect(names).toEqual(expect.arrayContaining(['service-a', 'user-api']));
  });

  it('should support $contains operator', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: {
        query: {
          'spec.dependsOn': { $contains: 'component:default/shared-lib' },
        },
      },
    });

    expect(result.output).toMatchObject({
      totalItems: 1,
      items: [
        expect.objectContaining({
          metadata: expect.objectContaining({ name: 'service-a' }),
        }),
      ],
    });
  });

  it('should support pagination with limit', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: { limit: 2 },
    });

    const output = result.output as any;
    expect(output.items).toHaveLength(2);
    expect(output.totalItems).toBe(4);
    expect(output.hasMoreEntities).toBe(true);
    expect(output.nextPageCursor).toBeDefined();
  });

  it('should support cursor-based pagination', async () => {
    const { invoke } = createCatalogQueryAction();

    const firstPage = await invoke({
      id: 'test:query-catalog-entities',
      input: { limit: 2 },
    });
    const firstOutput = firstPage.output as any;

    const secondPage = await invoke({
      id: 'test:query-catalog-entities',
      input: { cursor: firstOutput.nextPageCursor, limit: 2 },
    });
    const secondOutput = secondPage.output as any;

    expect(secondOutput.items).toHaveLength(2);
    expect(secondOutput.hasMoreEntities).toBe(false);
  });

  it('should support orderFields', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: {
        query: { kind: 'Component' },
        orderFields: { field: 'metadata.name', order: 'desc' },
      },
    });

    const names = (result.output as any).items.map((e: any) => e.metadata.name);
    expect(names).toEqual(['website-b', 'service-a']);
  });

  it('should support array orderFields for multi-field sorting', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: {
        orderFields: [
          { field: 'kind', order: 'asc' },
          { field: 'metadata.name', order: 'asc' },
        ],
      },
    });

    const kinds = (result.output as any).items.map((e: any) => e.kind);
    expect(kinds).toEqual(['API', 'Component', 'Component', 'Group']);
  });

  it('should support fields projection', async () => {
    const { invoke } = createCatalogQueryAction();
    const result = await invoke({
      id: 'test:query-catalog-entities',
      input: {
        query: { kind: 'Component', 'spec.type': 'service' },
        fields: ['kind', 'metadata.name'],
      },
    });

    const items = (result.output as any).items;
    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({
      kind: 'Component',
      metadata: { name: 'service-a' },
    });
  });
});
