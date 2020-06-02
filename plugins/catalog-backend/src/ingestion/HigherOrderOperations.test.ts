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

import { EntitiesCatalog, LocationsCatalog } from '../catalog';
import { IngestionModel } from './types';
import { HigherOrderOperations } from './HigherOrderOperations';
import { Entity } from '@backstage/catalog-model';

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
    };
    ingestionModel = {
      readLocation: jest.fn(),
    };
    higherOrderOperation = new HigherOrderOperations(
      entitiesCatalog,
      locationsCatalog,
      ingestionModel,
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
});
