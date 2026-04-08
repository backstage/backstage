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
import { createRefreshCatalogEntityAction } from './createRefreshCatalogEntityAction';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';

describe('createRefreshCatalogEntityAction', () => {
  it('should throw an error if the entity is not found', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:refresh-catalog-entity',
        input: { name: 'does-not-exist' },
      }),
    ).rejects.toThrow('No entity found with name "does-not-exist"');
  });

  it('should throw an error if multiple entities are found', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: [
        {
          kind: 'Component',
          apiVersion: 'backstage.io/v1alpha1',
          metadata: {
            name: 'my-service',
            namespace: 'default',
          },
        },
        {
          kind: 'API',
          apiVersion: 'backstage.io/v1alpha1',
          metadata: {
            name: 'my-service',
            namespace: 'default',
          },
        },
      ],
    });

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:refresh-catalog-entity',
        input: { name: 'my-service' },
      }),
    ).rejects.toThrow(
      'Multiple entities found with name "my-service", please provide more specific filters. Entities found: "component:default/my-service", "api:default/my-service"',
    );
  });

  it('should successfully refresh an existing entity', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: [
        {
          kind: 'Component',
          apiVersion: 'backstage.io/v1alpha1',
          metadata: {
            name: 'my-service',
            namespace: 'default',
          },
        },
      ],
    });

    mockCatalog.refreshEntity = jest.fn().mockResolvedValue(undefined);

    createRefreshCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:refresh-catalog-entity',
      input: { name: 'my-service' },
    });

    expect(result.output).toEqual({
      entityRef: 'component:default/my-service',
    });
    expect(mockCatalog.refreshEntity).toHaveBeenCalledWith(
      'component:default/my-service',
      expect.objectContaining({
        credentials: expect.any(Object),
      }),
    );
  });
});
