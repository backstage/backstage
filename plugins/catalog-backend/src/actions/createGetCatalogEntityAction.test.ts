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
import { createGetCatalogEntityAction } from './createGetCatalogEntityAction';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';

describe('createGetCatalogEntityAction', () => {
  it('should throw an error if the entity is not found', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    createGetCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:get-catalog-entity',
        input: { name: 'test' },
      }),
    ).rejects.toThrow(`No entity found with name "test"`);
  });

  it('should throw an error if theres multiple entities found', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock({
      entities: [
        {
          kind: 'Component',
          apiVersion: 'backstage.io/v1alpha1',
          metadata: {
            name: 'test',
            namespace: 'default',
          },
          spec: {
            type: 'component',
          },
        },
        {
          kind: 'API',
          apiVersion: 'backstage.io/v1alpha1',
          metadata: {
            name: 'test',
            namespace: 'default',
          },
        },
      ],
    });

    createGetCatalogEntityAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:get-catalog-entity',
        input: { name: 'test' },
      }),
    ).rejects.toThrow(
      `Multiple entities found with name "test", please provide more specific filters. Entities found: "component:default/test", "api:default/test"`,
    );
  });
});
