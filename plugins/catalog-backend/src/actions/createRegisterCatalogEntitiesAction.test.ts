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
import { createRegisterCatalogEntitiesAction } from './createRegisterCatalogEntitiesAction';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';

describe('createRegisterCatalogEntitiesAction', () => {
  it('should successfully register a catalog location with a valid URL', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    const mockLocationId = 'test-location-id-1234';
    mockCatalog.addLocation = jest.fn().mockResolvedValue({
      location: {
        id: mockLocationId,
        type: 'url',
        target: 'https://github.com/example/repo/blob/main/catalog-info.yaml',
      },
      entities: [],
      exists: false,
    });

    createRegisterCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:register-catalog-entities',
      input: {
        locationURL:
          'https://github.com/example/repo/blob/main/catalog-info.yaml',
      },
    });

    expect(result.output).toEqual({
      locationID: mockLocationId,
      error: undefined,
    });
    expect(mockCatalog.addLocation).toHaveBeenCalledWith(
      {
        type: 'url',
        target: 'https://github.com/example/repo/blob/main/catalog-info.yaml',
      },
      expect.objectContaining({
        credentials: expect.any(Object),
      }),
    );
  });

  it('should return an error if locationURL is not provided', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    createRegisterCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:register-catalog-entities',
      input: { locationURL: '' },
    });

    expect(result.output).toEqual({
      error: 'a location URL must be specified',
    });
  });

  it('should return an error if locationURL is not a valid URL', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    createRegisterCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:register-catalog-entities',
      input: { locationURL: 'not-a-valid-url' },
    });

    expect(result.output).toEqual({
      error: 'location URL must be a valid URL string',
    });
  });

  it('should return an error if catalog.addLocation throws an error', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockCatalog = catalogServiceMock();

    const errorMessage = 'Failed to add location';
    mockCatalog.addLocation = jest
      .fn()
      .mockRejectedValue(new Error(errorMessage));

    createRegisterCatalogEntitiesAction({
      catalog: mockCatalog,
      actionsRegistry: mockActionsRegistry,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:register-catalog-entities',
      input: {
        locationURL:
          'https://github.com/example/repo/blob/main/catalog-info.yaml',
      },
    });

    expect(result.output).toEqual({
      error: errorMessage,
    });
  });
});
