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

describe('createQueryCatalogEntitiesAction', () => {
  it('should return empty results when no entities match the filter', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: [],
    });

    createQueryCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:query-catalog-entities',
      input: { filter: { kind: 'NonExistentKind' } },
    });

    expect(result.output).toEqual({
      items: [],
      totalItems: 0,
      hasMoreEntities: false,
      nextPageCursor: undefined,
    });
  });

  it('should return all entities when no filter is provided', async () => {
    const testEntities = [
      {
        kind: 'Component',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          name: 'test-component',
          namespace: 'default',
        },
        spec: {
          type: 'service',
        },
      },
      {
        kind: 'API',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          name: 'test-api',
          namespace: 'default',
        },
      },
    ];

    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: testEntities,
    });

    createQueryCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:query-catalog-entities',
      input: {},
    });

    expect(result.output).toEqual({
      items: testEntities,
      totalItems: 2,
      hasMoreEntities: false,
      nextPageCursor: undefined,
    });
  });

  it('should filter entities by kind', async () => {
    const testEntities = [
      {
        kind: 'Component',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          name: 'test-component',
          namespace: 'default',
        },
        spec: {
          type: 'service',
        },
      },
      {
        kind: 'API',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          name: 'test-api',
          namespace: 'default',
        },
      },
    ];

    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: testEntities,
    });

    createQueryCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:query-catalog-entities',
      input: { filter: { kind: 'Component' } },
    });

    expect(result.output).toEqual({
      items: [testEntities[0]],
      totalItems: 1,
      hasMoreEntities: false,
      nextPageCursor: undefined,
    });
  });

  it('should filter entities by metadata name', async () => {
    const testEntities = [
      {
        kind: 'Component',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          name: 'test-component',
          namespace: 'default',
        },
        spec: {
          type: 'service',
        },
      },
      {
        kind: 'Component',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          name: 'another-component',
          namespace: 'default',
        },
        spec: {
          type: 'library',
        },
      },
    ];

    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: testEntities,
    });

    createQueryCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:query-catalog-entities',
      input: { filter: { 'metadata.name': 'test-component' } },
    });

    expect(result.output).toEqual({
      items: [testEntities[0]],
      totalItems: 1,
      hasMoreEntities: false,
      nextPageCursor: undefined,
    });
  });

  it('should handle multiple filter criteria', async () => {
    const testEntities = [
      {
        kind: 'Component',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          name: 'test-component',
          namespace: 'default',
        },
        spec: {
          type: 'service',
        },
      },
      {
        kind: 'Component',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          name: 'test-component',
          namespace: 'production',
        },
        spec: {
          type: 'library',
        },
      },
      {
        kind: 'API',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          name: 'test-api',
          namespace: 'default',
        },
      },
    ];

    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: testEntities,
    });

    createQueryCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:query-catalog-entities',
      input: {
        filter: {
          kind: 'Component',
          'metadata.namespace': 'default',
        },
      },
    });

    expect(result.output).toEqual({
      items: [testEntities[0]],
      totalItems: 1,
      hasMoreEntities: false,
      nextPageCursor: undefined,
    });
  });

  it('should pass through pagination and ordering options', async () => {
    const testEntities = [
      {
        kind: 'Component',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          name: 'component-a',
          namespace: 'default',
        },
      },
      {
        kind: 'Component',
        apiVersion: 'backstage.io/v1alpha1',
        metadata: {
          name: 'component-b',
          namespace: 'default',
        },
      },
    ];

    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: testEntities,
    });

    // Spy on the queryEntities method to verify it's called with correct parameters
    const queryEntitiesSpy = jest.spyOn(mockCatalog, 'queryEntities');

    createQueryCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:query-catalog-entities',
      input: {
        filter: { kind: 'Component' },
        limit: 10,
        offset: 0,
        orderFields: { field: 'metadata.name', order: 'asc' },
        fields: ['metadata.name', 'kind'],
      },
    });

    expect(result.output).toEqual({
      items: testEntities,
      totalItems: 2,
      hasMoreEntities: false,
      nextPageCursor: undefined,
    });
    expect(queryEntitiesSpy).toHaveBeenCalledWith(
      {
        filter: { kind: 'Component' },
        limit: 10,
        offset: 0,
        orderFields: { field: 'metadata.name', order: 'asc' },
        fields: ['metadata.name', 'kind'],
      },
      expect.any(Object),
    );
  });
});
