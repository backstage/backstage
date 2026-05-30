/*
 * Copyright 2026 The Backstage Authors
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
import { createRefreshCatalogEntityAction } from './createRefreshCatalogEntityAction';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';

describe('createRefreshCatalogEntityAction', () => {
  const mockEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'example-website', namespace: 'default' },
  };

  it('refreshes an entity using explicit kind, namespace, and name', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    mockCatalog.getEntityByRef = jest.fn().mockResolvedValue(mockEntity);
    mockCatalog.refreshEntity = jest.fn().mockResolvedValue(undefined);

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:refresh-catalog-entity',
      input: { kind: 'API', namespace: 'payments', name: 'orders-api' },
    });

    const expectedRef = 'api:payments/orders-api';
    expect(result.output).toEqual({ entityRef: expectedRef });
    expect(mockCatalog.refreshEntity).toHaveBeenCalledWith(
      expectedRef,
      expect.objectContaining({ credentials: expect.any(Object) }),
    );
  });

  it('defaults kind to "Component" and namespace to "default" when omitted', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    mockCatalog.getEntityByRef = jest.fn().mockResolvedValue(mockEntity);
    mockCatalog.refreshEntity = jest.fn().mockResolvedValue(undefined);

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:refresh-catalog-entity',
      input: { name: 'example-website' },
    });

    const expectedRef = 'component:default/example-website';
    expect(result.output).toEqual({ entityRef: expectedRef });
    expect(mockCatalog.refreshEntity).toHaveBeenCalledWith(
      expectedRef,
      expect.objectContaining({ credentials: expect.any(Object) }),
    );
  });

  it('throws NotFoundError when the entity does not exist', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    mockCatalog.getEntityByRef = jest.fn().mockResolvedValue(undefined);
    mockCatalog.refreshEntity = jest.fn();

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:refresh-catalog-entity',
        input: { name: 'missing-entity' },
      }),
    ).rejects.toMatchObject({
      name: 'NotFoundError',
      message: `Entity 'component:default/missing-entity' not found`,
    });

    expect(mockCatalog.refreshEntity).not.toHaveBeenCalled();
  });

  it('surfaces errors from catalog.refreshEntity to the caller', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    mockCatalog.getEntityByRef = jest.fn().mockResolvedValue(mockEntity);
    mockCatalog.refreshEntity = jest
      .fn()
      .mockRejectedValue(new Error('processor unavailable'));

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:refresh-catalog-entity',
        input: { name: 'example-website' },
      }),
    ).rejects.toThrow('processor unavailable');
  });
});
