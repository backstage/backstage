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
import { createUnregisterCatalogEntitiesAction } from './createUnregisterCatalogEntitiesAction';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';
import { ForwardedError } from '@backstage/errors';

describe('createUnregisterCatalogEntitiesAction', () => {
  it('should successfully unregister a catalog location with a valid locationId', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    mockCatalog.removeLocationById = jest.fn().mockResolvedValue(undefined);

    createUnregisterCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:unregister-catalog-entities',
      input: { locationId: 'test-location-id-1234' },
    });

    expect(result.output).toEqual({});
    expect(mockCatalog.removeLocationById).toHaveBeenCalledWith(
      'test-location-id-1234',
      expect.objectContaining({
        credentials: expect.any(Object),
      }),
    );
  });

  it('should throw an error if locationId is not provided', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    createUnregisterCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:unregister-catalog-entities',
        input: { locationId: '' },
      }),
    ).rejects.toThrow('a locationID must be specified');
  });

  it('should throw a ForwardedError if catalog.removeLocationById throws an error', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    const errorMessage = 'Failed to remove location';
    mockCatalog.removeLocationById = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    createUnregisterCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    await expect(
      mockActionsRegistry.invoke({
        id: 'test:unregister-catalog-entities',
        input: { locationId: 'test-location-id-1234' },
      }),
    ).rejects.toThrow(ForwardedError);
  });
});
