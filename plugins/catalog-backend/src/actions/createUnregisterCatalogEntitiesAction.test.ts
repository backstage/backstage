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

describe('createUnregisterCatalogEntitiesAction', () => {
  describe('with locationId', () => {
    it('should successfully unregister a catalog location with a valid locationId', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockCatalog = catalogServiceMock();

      mockCatalog.removeLocationById = jest.fn().mockResolvedValue(undefined);

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
      });

      const result = await mockActionsRegistry.invoke({
        id: 'test:unregister-entity',
        input: { type: { locationId: 'test-location-id-1234' } },
      });

      expect(result.output).toEqual({});
      expect(mockCatalog.removeLocationById).toHaveBeenCalledWith(
        'test-location-id-1234',
        expect.objectContaining({
          credentials: expect.any(Object),
        }),
      );
    });

    it('should throw an error if catalog.removeLocationById throws an error', async () => {
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
          id: 'test:unregister-entity',
          input: { type: { locationId: 'test-location-id-1234' } },
        }),
      ).rejects.toThrow(errorMessage);
    });
  });

  describe('with locationUrl', () => {
    it('should successfully unregister a catalog location with a valid locationUrl', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockCatalog = catalogServiceMock();

      const locationUrl =
        'https://github.com/backstage/demo/blob/master/catalog-info.yaml';

      mockCatalog.getLocations = jest.fn().mockResolvedValue({
        items: [
          { id: 'location-id-1', target: locationUrl },
          { id: 'location-id-2', target: 'https://other-url.com/catalog.yaml' },
        ],
      });
      mockCatalog.removeLocationById = jest.fn().mockResolvedValue(undefined);

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
      });

      const result = await mockActionsRegistry.invoke({
        id: 'test:unregister-entity',
        input: { type: { locationUrl } },
      });

      expect(result.output).toEqual({});
      expect(mockCatalog.getLocations).toHaveBeenCalledWith(
        {},
        expect.objectContaining({
          credentials: expect.any(Object),
        }),
      );
      expect(mockCatalog.removeLocationById).toHaveBeenCalledTimes(1);
      expect(mockCatalog.removeLocationById).toHaveBeenCalledWith(
        'location-id-1',
        expect.objectContaining({
          credentials: expect.any(Object),
        }),
      );
    });

    it('should match locationUrl case-insensitively', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockCatalog = catalogServiceMock();

      mockCatalog.getLocations = jest.fn().mockResolvedValue({
        items: [
          {
            id: 'location-id-1',
            target:
              'https://github.com/Backstage/Demo/blob/master/catalog-info.yaml',
          },
        ],
      });
      mockCatalog.removeLocationById = jest.fn().mockResolvedValue(undefined);

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
      });

      const result = await mockActionsRegistry.invoke({
        id: 'test:unregister-entity',
        input: {
          type: {
            locationUrl:
              'https://github.com/backstage/demo/blob/master/catalog-info.yaml',
          },
        },
      });

      expect(result.output).toEqual({});
      expect(mockCatalog.removeLocationById).toHaveBeenCalledTimes(1);
      expect(mockCatalog.removeLocationById).toHaveBeenCalledWith(
        'location-id-1',
        expect.objectContaining({
          credentials: expect.any(Object),
        }),
      );
    });

    it('should unregister multiple locations with the same URL', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockCatalog = catalogServiceMock();

      const locationUrl =
        'https://github.com/backstage/demo/blob/master/catalog-info.yaml';

      mockCatalog.getLocations = jest.fn().mockResolvedValue({
        items: [
          { id: 'location-id-1', target: locationUrl },
          { id: 'location-id-2', target: locationUrl },
        ],
      });
      mockCatalog.removeLocationById = jest.fn().mockResolvedValue(undefined);

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
      });

      const result = await mockActionsRegistry.invoke({
        id: 'test:unregister-entity',
        input: { type: { locationUrl } },
      });

      expect(result.output).toEqual({});
      expect(mockCatalog.removeLocationById).toHaveBeenCalledTimes(2);
      expect(mockCatalog.removeLocationById).toHaveBeenNthCalledWith(
        1,
        'location-id-1',
        expect.objectContaining({
          credentials: expect.any(Object),
        }),
      );
      expect(mockCatalog.removeLocationById).toHaveBeenNthCalledWith(
        2,
        'location-id-2',
        expect.objectContaining({
          credentials: expect.any(Object),
        }),
      );
    });

    it('should throw NotFoundError if no location matches the URL', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockCatalog = catalogServiceMock();

      mockCatalog.getLocations = jest.fn().mockResolvedValue({
        items: [
          { id: 'location-id-1', target: 'https://other-url.com/catalog.yaml' },
        ],
      });

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:unregister-entity',
          input: {
            type: {
              locationUrl:
                'https://github.com/backstage/demo/blob/master/catalog-info.yaml',
            },
          },
        }),
      ).rejects.toThrow(/NotFoundError/);
    });

    it('should throw NotFoundError with descriptive message when location not found', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockCatalog = catalogServiceMock();

      const locationUrl =
        'https://github.com/backstage/demo/blob/master/catalog-info.yaml';

      mockCatalog.getLocations = jest.fn().mockResolvedValue({
        items: [],
      });

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:unregister-entity',
          input: { type: { locationUrl } },
        }),
      ).rejects.toThrow(`Location with URL ${locationUrl} not found`);
    });

    it('should throw an error if catalog.getLocations throws an error', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockCatalog = catalogServiceMock();

      const errorMessage = 'Failed to get locations';
      mockCatalog.getLocations = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:unregister-entity',
          input: {
            type: {
              locationUrl:
                'https://github.com/backstage/demo/blob/master/catalog-info.yaml',
            },
          },
        }),
      ).rejects.toThrow(errorMessage);
    });
  });
});
