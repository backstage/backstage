/*
 * Copyright 2022 The Backstage Authors
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

import { NotAllowedError, NotFoundError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { AuthorizedLocationService } from './AuthorizedLocationService';
import { mockCredentials } from '@backstage/backend-test-utils';

describe('AuthorizedLocationService', () => {
  const fakeLocationService = {
    createLocation: jest.fn(),
    listLocations: jest.fn(),
    getLocation: jest.fn(),
    deleteLocation: jest.fn(),
    getLocationByEntity: jest.fn(),
  };
  const fakePermissionApi = {
    authorize: jest.fn(),
    authorizeConditional: jest.fn(),
  };

  const mockAllow = () => {
    fakePermissionApi.authorize.mockResolvedValueOnce([
      { result: AuthorizeResult.ALLOW },
    ]);
  };
  const mockDeny = () => {
    fakePermissionApi.authorize.mockResolvedValueOnce([
      { result: AuthorizeResult.DENY },
    ]);
  };

  const createService = () =>
    new AuthorizedLocationService(fakeLocationService, fakePermissionApi);

  const mockOptions = {
    credentials: mockCredentials.none(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createLocation', () => {
    it('calls underlying service to create location on ALLOW', async () => {
      mockAllow();
      const service = createService();

      const spec = { type: 'type', target: 'target' };
      await service.createLocation(spec, false, mockOptions);

      expect(fakeLocationService.createLocation).toHaveBeenCalledWith(
        spec,
        false,
        mockOptions,
      );
    });

    it('throws Error on DENY', async () => {
      mockDeny();
      const service = createService();

      const spec = { type: 'type', target: 'target' };
      await expect(() =>
        service.createLocation(spec, false, mockOptions),
      ).rejects.toThrow(NotAllowedError);
    });
  });

  describe('listLocations', () => {
    it('calls underlying service to list locations on ALLOW', async () => {
      mockAllow();
      const service = createService();

      await service.listLocations(mockOptions);

      expect(fakeLocationService.listLocations).toHaveBeenCalled();
    });

    it('returns empty array on DENY', async () => {
      mockDeny();
      const service = createService();

      const locations = await service.listLocations(mockOptions);

      expect(locations).toEqual([]);
    });
  });

  describe('getLocation', () => {
    it('calls underlying service to get location on ALLOW', async () => {
      mockAllow();
      const service = createService();

      await service.getLocation('id', mockOptions);

      expect(fakeLocationService.getLocation).toHaveBeenCalledWith(
        'id',
        mockOptions,
      );
    });

    it('throws error on DENY', async () => {
      mockDeny();
      const service = createService();

      await expect(() =>
        service.getLocation('id', mockOptions),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteLocation', () => {
    it('calls underlying service to delete location on ALLOW', async () => {
      mockAllow();
      const service = createService();

      await service.deleteLocation('id', mockOptions);

      expect(fakeLocationService.deleteLocation).toHaveBeenCalledWith(
        'id',
        mockOptions,
      );
    });

    it('throws error on DENY', async () => {
      mockDeny();
      const service = createService();

      await expect(() =>
        service.deleteLocation('id', mockOptions),
      ).rejects.toThrow(NotAllowedError);
    });
  });

  describe('getLocationByEntity', () => {
    it('calls underlying service to get location on ALLOW', async () => {
      mockAllow();
      const service = createService();

      await service.getLocationByEntity(
        { kind: 'c', namespace: 'ns', name: 'n' },
        mockOptions,
      );

      expect(fakeLocationService.getLocationByEntity).toHaveBeenCalledWith(
        {
          kind: 'c',
          namespace: 'ns',
          name: 'n',
        },
        mockOptions,
      );
    });

    it('throws error on DENY', async () => {
      mockDeny();
      const service = createService();

      await expect(() =>
        service.getLocationByEntity(
          { kind: 'c', namespace: 'ns', name: 'n' },
          mockOptions,
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
