/*
 * Copyright 2020 Spotify AB
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

import { getVoidLogger } from '@backstage/backend-common';
import { Entity, Location } from '@backstage/catalog-model';
import { EntitiesCatalog, LocationsCatalog } from '../catalog';
import { LocationUpdateStatus } from '../catalog/types';
import { DatabaseLocationUpdateLogStatus } from '../database/types';
import { HigherOrderOperations } from './HigherOrderOperations';
import { IngestionModel } from './types';

describe('HigherOrderOperations', () => {
  let entitiesCatalog: jest.Mocked<EntitiesCatalog>;
  let locationsCatalog: jest.Mocked<LocationsCatalog>;
  let ingestionModel: jest.Mocked<IngestionModel>;
  let higherOrderOperation: HigherOrderOperations;

  beforeAll(() => {
    entitiesCatalog = {
      entities: jest.fn(),
      entityByUid: jest.fn(),
      entityByName: jest.fn(),
      addOrUpdateEntity: jest.fn(),
      removeEntityByUid: jest.fn(),
    };
    locationsCatalog = {
      addLocation: jest.fn(),
      removeLocation: jest.fn(),
      locations: jest.fn(),
      location: jest.fn(),
      locationHistory: jest.fn(),
      logUpdateSuccess: jest.fn(),
      logUpdateFailure: jest.fn(),
    };
    ingestionModel = {
      readLocation: jest.fn(),
    };
    higherOrderOperation = new HigherOrderOperations(
      entitiesCatalog,
      locationsCatalog,
      ingestionModel,
      getVoidLogger(),
    );
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('addLocation', () => {
    it('just inserts the location when there are no entities to read', async () => {
      const spec = {
        type: 'a',
        target: 'b',
      };
      locationsCatalog.addLocation.mockImplementation(x => Promise.resolve(x));
      locationsCatalog.locations.mockResolvedValue([]);
      ingestionModel.readLocation.mockResolvedValue([]);

      const result = await higherOrderOperation.addLocation(spec);

      expect(result.location).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          ...spec,
        }),
      );
      expect(result.entities).toEqual([]);
      expect(locationsCatalog.locations).toBeCalledTimes(1);
      expect(ingestionModel.readLocation).toBeCalledTimes(1);
      expect(ingestionModel.readLocation).toBeCalledWith('a', 'b');
      expect(entitiesCatalog.addOrUpdateEntity).not.toBeCalled();
      expect(locationsCatalog.addLocation).toBeCalledTimes(1);
      expect(locationsCatalog.addLocation).toBeCalledWith(
        expect.objectContaining({
          id: expect.anything(),
          ...spec,
        }),
      );
    });

    it('reuses the location if a match already existed', async () => {
      const spec = {
        type: 'a',
        target: 'b',
      };
      const location = {
        id: 'dd12620d-0436-422f-93bd-929aa0788123',
        ...spec,
      };

      locationsCatalog.locations.mockResolvedValue([
        {
          currentStatus: { timestamp: '', status: '', message: '' },
          data: location,
        },
      ]);
      ingestionModel.readLocation.mockResolvedValue([]);

      const result = await higherOrderOperation.addLocation(spec);

      expect(result.location).toEqual(location);
      expect(result.entities).toEqual([]);
      expect(locationsCatalog.locations).toBeCalledTimes(1);
      expect(ingestionModel.readLocation).toBeCalledTimes(1);
      expect(ingestionModel.readLocation).toBeCalledWith('a', 'b');
      expect(entitiesCatalog.addOrUpdateEntity).not.toBeCalled();
      expect(locationsCatalog.addLocation).not.toBeCalled();
    });

    it('rejects the whole operation if any entity could not be read', async () => {
      const spec = {
        type: 'a',
        target: 'b',
      };
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: { name: 'n' },
      };

      locationsCatalog.locations.mockResolvedValue([]);
      ingestionModel.readLocation.mockResolvedValue([
        { type: 'data', data: entity },
        { type: 'error', error: new Error('abcd') },
      ]);

      await expect(higherOrderOperation.addLocation(spec)).rejects.toThrow(
        /abcd/,
      );
      expect(locationsCatalog.locations).toBeCalledTimes(1);
      expect(entitiesCatalog.addOrUpdateEntity).not.toBeCalled();
      expect(locationsCatalog.addLocation).not.toBeCalled();
    });
  });

  describe('refreshLocations', () => {
    it('works with no locations added', async () => {
      locationsCatalog.locations.mockResolvedValue([]);

      await expect(
        higherOrderOperation.refreshAllLocations(),
      ).resolves.toBeUndefined();

      expect(locationsCatalog.locations).toHaveBeenCalledTimes(1);
      expect(ingestionModel.readLocation).not.toHaveBeenCalled();
      expect(entitiesCatalog.addOrUpdateEntity).not.toHaveBeenCalled();
    });

    it('can update a single location where a matching entity did not exist', async () => {
      const locationStatus: LocationUpdateStatus = {
        message: '',
        status: DatabaseLocationUpdateLogStatus.SUCCESS,
        timestamp: new Date(314159265).toISOString(),
      };
      const location: Location = {
        id: '123',
        type: 'some',
        target: 'thing',
      };
      const desc: Entity = {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: { name: 'c1' },
        spec: { type: 'service' },
      };

      locationsCatalog.locations.mockResolvedValue([
        { currentStatus: locationStatus, data: location },
      ]);
      ingestionModel.readLocation.mockResolvedValue([
        { type: 'data', data: desc },
      ]);
      entitiesCatalog.entityByName.mockResolvedValue(undefined);
      entitiesCatalog.addOrUpdateEntity.mockResolvedValue(desc);

      await expect(
        higherOrderOperation.refreshAllLocations(),
      ).resolves.toBeUndefined();

      expect(locationsCatalog.locations).toHaveBeenCalledTimes(1);
      expect(ingestionModel.readLocation).toHaveBeenCalledTimes(1);
      expect(ingestionModel.readLocation).toHaveBeenNthCalledWith(
        1,
        'some',
        'thing',
      );
      expect(entitiesCatalog.entityByName).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.entityByName).toHaveBeenNthCalledWith(
        1,
        'Component',
        undefined,
        'c1',
      );
      expect(entitiesCatalog.addOrUpdateEntity).toHaveBeenCalledTimes(1);
      expect(entitiesCatalog.addOrUpdateEntity).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          metadata: expect.objectContaining({ name: 'c1' }),
        }),
        '123',
      );
    });

    it('logs successful updates', async () => {
      const locationStatus: LocationUpdateStatus = {
        message: '',
        status: DatabaseLocationUpdateLogStatus.SUCCESS,
        timestamp: new Date(314159265).toISOString(),
      };
      const location: Location = {
        id: '123',
        type: 'some',
        target: 'thing',
      };
      const desc: Entity = {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: { name: 'c1' },
        spec: { type: 'service' },
      };

      locationsCatalog.locations.mockResolvedValue([
        { currentStatus: locationStatus, data: location },
      ]);
      ingestionModel.readLocation.mockResolvedValue([
        { type: 'data', data: desc },
      ]);
      entitiesCatalog.entityByName.mockResolvedValue(undefined);
      entitiesCatalog.addOrUpdateEntity.mockResolvedValue(desc);

      await expect(
        higherOrderOperation.refreshAllLocations(),
      ).resolves.toBeUndefined();

      expect(locationsCatalog.logUpdateSuccess).toHaveBeenCalledTimes(2);
      expect(locationsCatalog.logUpdateSuccess).toHaveBeenCalledWith(
        '123',
        undefined,
      );
      expect(locationsCatalog.logUpdateSuccess).toHaveBeenCalledWith(
        '123',
        'c1',
      );
    });

    it('logs unsuccessful updates when reader fails', async () => {
      const locationStatus: LocationUpdateStatus = {
        message: '',
        status: DatabaseLocationUpdateLogStatus.SUCCESS,
        timestamp: new Date(314159265).toISOString(),
      };
      const location: Location = {
        id: '123',
        type: 'some',
        target: 'thing',
      };

      locationsCatalog.locations.mockResolvedValue([
        { currentStatus: locationStatus, data: location },
      ]);
      ingestionModel.readLocation.mockRejectedValue(
        new Error('reader error message'),
      );

      await expect(
        higherOrderOperation.refreshAllLocations(),
      ).resolves.toBeUndefined();

      expect(ingestionModel.readLocation).toHaveBeenCalledTimes(1);
      expect(locationsCatalog.logUpdateFailure).toHaveBeenCalledTimes(1);
      expect(locationsCatalog.logUpdateSuccess).not.toHaveBeenCalled();
      expect(locationsCatalog.logUpdateFailure).toHaveBeenCalledWith(
        '123',
        expect.objectContaining({ message: 'reader error message' }),
      );
    });
  });
});
