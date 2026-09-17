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
  const componentEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: { name: 'orders-api', namespace: 'default' },
    spec: { type: 'service' },
  };

  const apiEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'API',
    metadata: { name: 'orders-api', namespace: 'default' },
  };

  const paymentsApiEntity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'API',
    metadata: { name: 'orders-api', namespace: 'payments' },
  };

  it('resolves an entity by name alone (single match) and refreshes it', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({ entities: [componentEntity] });
    const refreshSpy = jest.spyOn(mockCatalog, 'refreshEntity');

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:refresh-catalog-entity',
      input: { name: 'orders-api' },
    });

    expect(result.output).toEqual({
      entityRef: 'component:default/orders-api',
    });
    expect(refreshSpy).toHaveBeenCalledWith(
      'component:default/orders-api',
      expect.objectContaining({ credentials: expect.any(Object) }),
    );
  });

  it('disambiguates via kind when multiple entities share a name', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: [componentEntity, apiEntity],
    });
    const refreshSpy = jest.spyOn(mockCatalog, 'refreshEntity');

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:refresh-catalog-entity',
      input: { kind: 'API', name: 'orders-api' },
    });

    expect(result.output).toEqual({ entityRef: 'api:default/orders-api' });
    expect(refreshSpy).toHaveBeenCalledWith(
      'api:default/orders-api',
      expect.objectContaining({ credentials: expect.any(Object) }),
    );
  });

  it('disambiguates via kind + namespace when multiple entities share a name', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: [apiEntity, paymentsApiEntity],
    });
    const refreshSpy = jest.spyOn(mockCatalog, 'refreshEntity');

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:refresh-catalog-entity',
      input: { kind: 'API', namespace: 'payments', name: 'orders-api' },
    });

    expect(result.output).toEqual({ entityRef: 'api:payments/orders-api' });
    expect(refreshSpy).toHaveBeenCalledWith(
      'api:payments/orders-api',
      expect.objectContaining({ credentials: expect.any(Object) }),
    );
  });

  it('throws when no entity matches the name', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({ entities: [] });
    const refreshSpy = jest.spyOn(mockCatalog, 'refreshEntity');

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:refresh-catalog-entity',
        input: { name: 'missing-entity' },
      }),
    ).rejects.toThrow(`No entity found with name "missing-entity"`);

    expect(refreshSpy).not.toHaveBeenCalled();
  });

  it('throws when a name matches multiple entities, listing the candidates', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: [componentEntity, apiEntity],
    });
    const refreshSpy = jest.spyOn(mockCatalog, 'refreshEntity');

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:refresh-catalog-entity',
        input: { name: 'orders-api' },
      }),
    ).rejects.toThrow(
      `Multiple entities found with name "orders-api", please provide more specific filters. Entities found: "component:default/orders-api", "api:default/orders-api"`,
    );

    expect(refreshSpy).not.toHaveBeenCalled();
  });

  it('surfaces errors from catalog.refreshEntity to the caller', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({ entities: [componentEntity] });
    jest
      .spyOn(mockCatalog, 'refreshEntity')
      .mockRejectedValue(new Error('processor unavailable'));

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:refresh-catalog-entity',
        input: { name: 'orders-api' },
      }),
    ).rejects.toThrow('processor unavailable');
  });
});
