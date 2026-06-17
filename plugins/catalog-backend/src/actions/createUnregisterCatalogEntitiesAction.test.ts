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
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { PermissionsService, AuthService } from '@backstage/backend-plugin-api';

describe('createUnregisterCatalogEntitiesAction', () => {
  const mockPermissions = {
    authorize: jest.fn().mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
  } as unknown as PermissionsService;

  const mockAuth = {
    getOwnServiceCredentials: jest.fn().mockResolvedValue({
      token: 'mock-service-token',
    }),
  } as unknown as AuthService;

  describe('with locationId', () => {
    it('should successfully unregister a catalog location with a valid locationId', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockCatalog = catalogServiceMock();

      mockCatalog.removeLocationById = jest.fn().mockResolvedValue(undefined);
      mockCatalog.getLocationById = jest.fn().mockResolvedValue({
        id: 'test-location-id-1234',
        type: 'url',
        target:
          'https://github.com/backstage/demo/blob/master/catalog-info.yaml',
        entityRef: 'location:default/generated-loc',
      });
      mockCatalog.getEntities = jest.fn().mockResolvedValue({ items: [] });

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
        permissions: mockPermissions,
        auth: mockAuth,
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
      mockCatalog.getLocationById = jest.fn().mockResolvedValue({
        id: 'test-location-id-1234',
        type: 'url',
        target:
          'https://github.com/backstage/demo/blob/master/catalog-info.yaml',
        entityRef: 'location:default/generated-loc',
      });
      mockCatalog.getEntities = jest.fn().mockResolvedValue({ items: [] });

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
        permissions: mockPermissions,
        auth: mockAuth,
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
      mockCatalog.getEntities = jest.fn().mockResolvedValue({ items: [] });
      mockCatalog.removeLocationById = jest.fn().mockResolvedValue(undefined);

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
        permissions: mockPermissions,
        auth: mockAuth,
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
      mockCatalog.getEntities = jest.fn().mockResolvedValue({ items: [] });
      mockCatalog.removeLocationById = jest.fn().mockResolvedValue(undefined);

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
        permissions: mockPermissions,
        auth: mockAuth,
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
      mockCatalog.getEntities = jest.fn().mockResolvedValue({ items: [] });
      mockCatalog.removeLocationById = jest.fn().mockResolvedValue(undefined);

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
        permissions: mockPermissions,
        auth: mockAuth,
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

    it('should throw NotFoundError with the original message if no location matches the URL', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockCatalog = catalogServiceMock();

      const locationUrl =
        'https://github.com/backstage/demo/blob/master/catalog-info.yaml';

      mockCatalog.getLocations = jest.fn().mockResolvedValue({
        items: [
          { id: 'location-id-1', target: 'https://other-url.com/catalog.yaml' },
        ],
      });

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
        permissions: mockPermissions,
        auth: mockAuth,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:unregister-entity',
          input: { type: { locationUrl } },
        }),
      ).rejects.toMatchObject({
        name: 'NotFoundError',
        message: `Location with URL ${locationUrl} not found`,
      });
    });

    it('should throw the original error if catalog.getLocations fails', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockCatalog = catalogServiceMock();

      mockCatalog.getLocations = jest
        .fn()
        .mockRejectedValue(new Error('Failed to get locations'));

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
        permissions: mockPermissions,
        auth: mockAuth,
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
      ).rejects.toMatchObject({
        name: 'Error',
        message: 'Failed to get locations',
      });
    });
  });

  describe('with permission checks', () => {
    it('should successfully unregister a catalog location if delete permission is allowed', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockCatalog = catalogServiceMock();
      const allowedPermissions = {
        authorize: jest
          .fn()
          .mockResolvedValue([
            { result: AuthorizeResult.ALLOW },
            { result: AuthorizeResult.ALLOW },
          ]),
      } as unknown as PermissionsService;

      const locationUrl =
        'https://github.com/backstage/demo/blob/master/catalog-info.yaml';

      mockCatalog.getLocationById = jest.fn().mockResolvedValue({
        id: 'location-id-1',
        type: 'url',
        target: locationUrl,
        entityRef: 'location:default/generated-loc',
      });
      mockCatalog.getEntities = jest.fn().mockResolvedValue({
        items: [
          {
            kind: 'Component',
            metadata: { name: 'test-component', namespace: 'default' },
          },
        ],
      });
      mockCatalog.removeLocationById = jest.fn().mockResolvedValue(undefined);

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
        permissions: allowedPermissions,
        auth: mockAuth,
      });

      const result = await mockActionsRegistry.invoke({
        id: 'test:unregister-entity',
        input: { type: { locationId: 'location-id-1' } },
      });

      expect(result.output).toEqual({});
      expect(mockCatalog.getEntities).toHaveBeenCalledWith(
        {
          filter: {
            'metadata.annotations.backstage.io/managed-by-origin-location': `url:${locationUrl}`,
          },
          fields: ['kind', 'metadata.name', 'metadata.namespace'],
        },
        expect.any(Object),
      );
      expect(allowedPermissions.authorize).toHaveBeenCalledWith(
        [
          {
            permission: expect.objectContaining({
              name: 'catalog.entity.delete',
            }),
            resourceRef: 'location:default/generated-loc',
          },
          {
            permission: expect.objectContaining({
              name: 'catalog.entity.delete',
            }),
            resourceRef: 'component:default/test-component',
          },
        ],
        expect.any(Object),
      );
      expect(mockCatalog.removeLocationById).toHaveBeenCalledWith(
        'location-id-1',
        expect.any(Object),
      );
    });

    it('should throw NotAllowedError and not unregister if delete permission is denied', async () => {
      const mockActionsRegistry = actionsRegistryServiceMock();
      const mockCatalog = catalogServiceMock();
      const deniedPermissions = {
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.DENY }]),
      } as unknown as PermissionsService;

      const locationUrl =
        'https://github.com/backstage/demo/blob/master/catalog-info.yaml';

      mockCatalog.getLocationById = jest.fn().mockResolvedValue({
        id: 'location-id-1',
        type: 'url',
        target: locationUrl,
        entityRef: 'location:default/generated-loc',
      });
      mockCatalog.getEntities = jest.fn().mockResolvedValue({
        items: [],
      });
      mockCatalog.removeLocationById = jest.fn().mockResolvedValue(undefined);

      createUnregisterCatalogEntitiesAction({
        catalog: mockCatalog,
        actionsRegistry: mockActionsRegistry,
        permissions: deniedPermissions,
        auth: mockAuth,
      });

      await expect(
        mockActionsRegistry.invoke({
          id: 'test:unregister-entity',
          input: { type: { locationId: 'location-id-1' } },
        }),
      ).rejects.toMatchObject({
        name: 'NotAllowedError',
        message:
          'You are not authorized to delete some of the entities managed by this location.',
      });

      expect(mockCatalog.removeLocationById).not.toHaveBeenCalled();
    });
  });
});
