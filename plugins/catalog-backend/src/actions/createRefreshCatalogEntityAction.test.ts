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
import { mockServices } from '@backstage/backend-test-utils';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { NotAllowedError, NotFoundError } from '@backstage/errors';

describe('createRefreshCatalogEntityAction', () => {
  let permissions: ReturnType<typeof mockServices.permissions.mock>;

  beforeEach(() => {
    permissions = mockServices.permissions.mock({
      authorizeConditional: async () => [
        { result: AuthorizeResult.ALLOW },
        { result: AuthorizeResult.ALLOW },
      ],
    });
  });
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
      permissions,
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
      permissions,
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
      permissions,
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

  it('throws NotFoundError when no entity matches the name', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({ entities: [] });
    const refreshSpy = jest.spyOn(mockCatalog, 'refreshEntity');

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
      permissions,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:refresh-catalog-entity',
        input: { name: 'missing-entity' },
      }),
    ).rejects.toMatchObject({
      name: 'NotFoundError',
      message: `No entity found with name "missing-entity"`,
    } satisfies Partial<NotFoundError>);

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
      permissions,
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
      permissions,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:refresh-catalog-entity',
        input: { name: 'orders-api' },
      }),
    ).rejects.toThrow('processor unavailable');
  });

  it('rejects denied refresh permission before looking up the entity', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({ entities: [componentEntity] });
    const querySpy = jest.spyOn(mockCatalog, 'queryEntities');
    const refreshSpy = jest.spyOn(mockCatalog, 'refreshEntity');
    permissions.authorizeConditional.mockResolvedValue([
      { result: AuthorizeResult.DENY },
      { result: AuthorizeResult.ALLOW },
    ]);

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
      permissions,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:refresh-catalog-entity',
        input: { name: 'orders-api' },
      }),
    ).rejects.toThrow(NotAllowedError);

    expect(permissions.authorizeConditional).toHaveBeenCalledWith(
      [
        {
          permission: expect.objectContaining({
            name: 'catalog.entity.refresh',
          }),
        },
        {
          permission: expect.objectContaining({ name: 'catalog.entity.read' }),
        },
      ],
      { credentials: expect.any(Object) },
    );
    expect(querySpy).not.toHaveBeenCalled();
    expect(refreshSpy).not.toHaveBeenCalled();
  });

  it('rejects denied read permission before looking up the entity', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({ entities: [componentEntity] });
    const querySpy = jest.spyOn(mockCatalog, 'queryEntities');
    const refreshSpy = jest.spyOn(mockCatalog, 'refreshEntity');
    permissions.authorizeConditional.mockResolvedValue([
      { result: AuthorizeResult.ALLOW },
      { result: AuthorizeResult.DENY },
    ]);

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
      permissions,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:refresh-catalog-entity',
        input: { name: 'orders-api' },
      }),
    ).rejects.toMatchObject({
      name: 'NotFoundError',
      message: 'No entity found with name "orders-api"',
    } satisfies Partial<NotFoundError>);

    expect(querySpy).not.toHaveBeenCalled();
    expect(refreshSpy).not.toHaveBeenCalled();
  });

  it('checks conditional refresh permission for the resolved entity', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({ entities: [componentEntity] });
    const refreshSpy = jest.spyOn(mockCatalog, 'refreshEntity');
    permissions.authorizeConditional.mockResolvedValue([
      {
        result: AuthorizeResult.CONDITIONAL,
        pluginId: 'catalog',
        resourceType: 'catalog-entity',
        conditions: {
          resourceType: 'catalog-entity',
          rule: 'IS_ENTITY_OWNER',
          params: { claims: ['group:default/team-a'] },
        },
      },
      { result: AuthorizeResult.ALLOW },
    ]);
    permissions.authorize.mockResolvedValue([{ result: AuthorizeResult.DENY }]);

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
      permissions,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:refresh-catalog-entity',
        input: { name: 'orders-api' },
      }),
    ).rejects.toThrow(NotAllowedError);

    expect(permissions.authorize).toHaveBeenCalledWith(
      [
        {
          permission: expect.objectContaining({
            name: 'catalog.entity.refresh',
          }),
          resourceRef: 'component:default/orders-api',
        },
      ],
      { credentials: expect.any(Object) },
    );
    expect(refreshSpy).not.toHaveBeenCalled();
  });
});
