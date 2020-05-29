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
import { Entity, EntityPolicy } from '@backstage/catalog-model';
import Knex from 'knex';
import { IngestionModel } from '../ingestion/types';
import { Database } from './Database';
import { DatabaseManager } from './DatabaseManager';
import {
  DatabaseLocationUpdateLogStatus,
  DbLocationsRow,
  DbLocationsRowWithStatus,
} from './types';

describe('DatabaseManager', () => {
  describe('refreshLocations', () => {
    it('works with no locations added', async () => {
      const db = ({
        locations: jest.fn().mockResolvedValue([]),
      } as unknown) as Database;
      const reader: IngestionModel = {
        readLocation: jest.fn(),
      };
      const policy: EntityPolicy = {
        enforce: jest.fn(),
      };

      await expect(
        DatabaseManager.refreshLocations(db, reader, policy, getVoidLogger()),
      ).resolves.toBeUndefined();
      expect(reader.readLocation).not.toHaveBeenCalled();
      expect(policy.enforce).not.toHaveBeenCalled();
    });

    it('can update a single location', async () => {
      const location: DbLocationsRowWithStatus = {
        id: '123',
        type: 'some',
        target: 'thing',
        message: '',
        status: DatabaseLocationUpdateLogStatus.SUCCESS,
        timestamp: new Date(314159265).toISOString(),
      };
      const desc: Entity = {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: { name: 'c1' },
        spec: { type: 'service' },
      };

      const tx = (undefined as unknown) as Knex.Transaction<any, any>;

      const db = ({
        transaction: jest.fn(f => f(tx)),
        entity: jest.fn(() => Promise.resolve(undefined)),
        addEntity: jest.fn(),
        locations: jest.fn(() => Promise.resolve([location])),
        addLocationUpdateLogEvent: jest.fn(),
      } as Partial<Database>) as Database;

      const reader: IngestionModel = {
        readLocation: jest.fn(() =>
          Promise.resolve([{ type: 'data', data: desc }]),
        ),
      };
      const policy: EntityPolicy = {
        enforce: jest.fn(() => Promise.resolve(desc)),
      };

      await expect(
        DatabaseManager.refreshLocations(db, reader, policy, getVoidLogger()),
      ).resolves.toBeUndefined();
      expect(reader.readLocation).toHaveBeenCalledTimes(1);
      expect(reader.readLocation).toHaveBeenNthCalledWith(1, 'some', 'thing');
      expect(db.addEntity).toHaveBeenCalledTimes(1);
      expect(db.addEntity).toHaveBeenNthCalledWith(1, undefined, {
        locationId: '123',
        entity: expect.objectContaining({
          metadata: expect.objectContaining({ name: 'c1' }),
        }),
      });
    });

    it('logs successful updates', async () => {
      const tx = (undefined as unknown) as Knex.Transaction<any, any>;

      const db = ({
        transaction: jest.fn(f => f(tx)),
        addEntity: jest.fn(),
        entity: jest.fn(() => Promise.resolve(undefined)),
        locations: jest.fn(() =>
          Promise.resolve([
            {
              id: '123',
              type: 'some',
              target: 'thing',
            } as DbLocationsRow,
          ]),
        ),
        addLocationUpdateLogEvent: jest.fn(),
      } as unknown) as Database;

      const desc: Entity = {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: { name: 'c1' },
        spec: { type: 'service' },
      };
      const reader: IngestionModel = {
        readLocation: jest.fn(() =>
          Promise.resolve([{ type: 'data', data: desc }]),
        ),
      };
      const policy: EntityPolicy = {
        enforce: jest.fn(() => Promise.resolve(desc)),
      };

      await expect(
        DatabaseManager.refreshLocations(db, reader, policy, getVoidLogger()),
      ).resolves.toBeUndefined();

      expect(db.addLocationUpdateLogEvent).toHaveBeenNthCalledWith(
        1,
        '123',
        DatabaseLocationUpdateLogStatus.SUCCESS,
        'c1',
      );

      expect(db.addLocationUpdateLogEvent).toHaveBeenNthCalledWith(
        2,
        '123',
        DatabaseLocationUpdateLogStatus.SUCCESS,
        undefined,
      );
    });

    it('logs unsuccessful updates when parser fails', async () => {
      const tx = (undefined as unknown) as Knex.Transaction<any, any>;

      const db = ({
        transaction: jest.fn(f => f(tx)),
        addEntity: jest.fn(),
        locations: jest.fn(() =>
          Promise.resolve([
            {
              id: '123',
              type: 'some',
              target: 'thing',
            } as DbLocationsRow,
          ]),
        ),
        addLocationUpdateLogEvent: jest.fn(),
      } as unknown) as Database;

      const desc: Entity = {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: { name: 'c1' },
        spec: { type: 'service' },
      };
      const reader: IngestionModel = {
        readLocation: jest.fn(() =>
          Promise.resolve([{ type: 'data', data: desc }]),
        ),
      };
      const policy: EntityPolicy = {
        enforce: jest.fn(() =>
          Promise.reject(new Error('parser error message')),
        ),
      };

      await expect(
        DatabaseManager.refreshLocations(db, reader, policy, getVoidLogger()),
      ).resolves.toBeUndefined();

      expect(db.addLocationUpdateLogEvent).toHaveBeenNthCalledWith(
        1,
        '123',
        DatabaseLocationUpdateLogStatus.FAIL,
        'c1',
        'parser error message',
      );

      expect(db.addLocationUpdateLogEvent).toHaveBeenNthCalledWith(
        2,
        '123',
        DatabaseLocationUpdateLogStatus.SUCCESS,
        undefined,
      );
    });

    it('logs unsuccessful updates when reader fails', async () => {
      const tx = (undefined as unknown) as Knex.Transaction<any, any>;

      const db = ({
        transaction: jest.fn(f => f(tx)),
        addEntity: jest.fn(),
        locations: jest.fn(() =>
          Promise.resolve([
            {
              id: '123',
              type: 'some',
              target: 'thing',
            } as DbLocationsRow,
          ]),
        ),
        addLocationUpdateLogEvent: jest.fn(),
      } as unknown) as Database;

      const reader: IngestionModel = {
        readLocation: jest.fn(() =>
          Promise.reject([{ type: 'error', error: new Error('test message') }]),
        ),
      };
      const policy: EntityPolicy = {
        enforce: jest.fn(() =>
          Promise.reject(new Error('parser error message')),
        ),
      };

      await expect(
        DatabaseManager.refreshLocations(db, reader, policy, getVoidLogger()),
      ).resolves.toBeUndefined();

      expect(db.addLocationUpdateLogEvent).toHaveBeenNthCalledWith(
        1,
        '123',
        DatabaseLocationUpdateLogStatus.FAIL,
        undefined,
        undefined,
      );
    });
  });
});
