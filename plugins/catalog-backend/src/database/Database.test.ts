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

import {
  ConflictError,
  getVoidLogger,
  NotFoundError,
} from '@backstage/backend-common';
import Knex from 'knex';
import path from 'path';
import { Database } from './Database';
import {
  AddDatabaseLocation,
  DbEntityRequest,
  DbEntityResponse,
  DbLocationsRow,
  DbLocationsRowWithStatus,
  DatabaseLocationUpdateLogStatus,
} from './types';

describe('Database', () => {
  let database: Knex;
  let entityRequest: DbEntityRequest;
  let entityResponse: DbEntityResponse;

  beforeEach(async () => {
    database = Knex({
      client: 'sqlite3',
      connection: ':memory:',
      useNullAsDefault: true,
    });

    await database.raw('PRAGMA foreign_keys = ON');
    await database.migrate.latest({
      directory: path.resolve(__dirname, 'migrations'),
      loadExtensions: ['.ts'],
    });

    entityRequest = {
      entity: {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
          labels: { e: 'f' },
          annotations: { g: 'h' },
        },
        spec: { i: 'j' },
      },
    };

    entityResponse = {
      locationId: undefined,
      entity: {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          uid: expect.anything(),
          etag: expect.anything(),
          generation: expect.anything(),
          name: 'c',
          namespace: 'd',
          labels: { e: 'f' },
          annotations: {
            g: 'h',
            'backstage.io/managed-by-location': undefined,
          },
        },
        spec: { i: 'j' },
      },
    };
  });

  it('manages locations', async () => {
    const db = new Database(database, getVoidLogger());
    const input: AddDatabaseLocation = { type: 'a', target: 'b' };
    const output: DbLocationsRowWithStatus = {
      id: expect.anything(),
      type: 'a',
      target: 'b',
      message: null,
      status: null,
      timestamp: null,
    };

    await db.addLocation(input);

    const locations = await db.locations();
    expect(locations).toEqual([output]);
    const location = await db.location(locations[0].id);
    expect(location).toEqual(output);

    await db.removeLocation(locations[0].id);

    await expect(db.locations()).resolves.toEqual([]);
    await expect(db.location(locations[0].id)).rejects.toThrow(
      /Found no location/,
    );
  });

  it('instead of adding second location with the same target, returns existing one', async () => {
    // Prepare
    const catalog = new Database(database, getVoidLogger());
    const input: AddDatabaseLocation = { type: 'a', target: 'b' };
    const output1: DbLocationsRow = await catalog.addLocation(input);

    // Try to insert the same location
    const output2: DbLocationsRow = await catalog.addLocation(input);
    const locations = await catalog.locations();

    // Output is the same
    expect(output2).toEqual(output1);
    // Locations contain only one record
    expect(locations[0]).toMatchObject(output1);
  });

  describe('addEntity', () => {
    it('happy path: adds entity to empty database', async () => {
      const catalog = new Database(database, getVoidLogger());
      const added = await catalog.transaction(tx =>
        catalog.addEntity(tx, entityRequest),
      );
      expect(added).toStrictEqual(entityResponse);
      expect(added.entity.metadata!.generation).toBe(1);
    });

    it('rejects adding the same-named entity twice', async () => {
      const catalog = new Database(database, getVoidLogger());
      await catalog.transaction(tx => catalog.addEntity(tx, entityRequest));
      await expect(
        catalog.transaction(tx => catalog.addEntity(tx, entityRequest)),
      ).rejects.toThrow(ConflictError);
    });

    it('accepts adding the same-named entity twice if on different namespaces', async () => {
      const catalog = new Database(database, getVoidLogger());
      entityRequest.entity.metadata!.namespace = 'namespace1';
      await catalog.transaction(tx => catalog.addEntity(tx, entityRequest));
      entityRequest.entity.metadata!.namespace = 'namespace2';
      await expect(
        catalog.transaction(tx => catalog.addEntity(tx, entityRequest)),
      ).resolves.toBeDefined();
    });
  });

  describe('locationHistory', () => {
    it('outputs the history correctly', async () => {
      const catalog = new Database(database, getVoidLogger());
      const location: AddDatabaseLocation = { type: 'a', target: 'b' };
      const { id: locationId } = await catalog.addLocation(location);

      await catalog.addLocationUpdateLogEvent(
        locationId,
        DatabaseLocationUpdateLogStatus.SUCCESS,
      );
      await catalog.addLocationUpdateLogEvent(
        locationId,
        DatabaseLocationUpdateLogStatus.FAIL,
        undefined,
        'Something went wrong',
      );

      const result = await catalog.locationHistory(locationId);
      expect(result).toEqual([
        {
          created_at: expect.anything(),
          entity_name: null,
          id: expect.anything(),
          location_id: locationId,
          message: null,
          status: DatabaseLocationUpdateLogStatus.SUCCESS,
        },
        {
          created_at: expect.anything(),
          entity_name: null,
          id: expect.anything(),
          location_id: locationId,
          message: 'Something went wrong',
          status: DatabaseLocationUpdateLogStatus.FAIL,
        },
      ]);
    });
  });

  describe('updateEntity', () => {
    it('can read and no-op-update an entity', async () => {
      const catalog = new Database(database, getVoidLogger());
      const added = await catalog.transaction(tx =>
        catalog.addEntity(tx, entityRequest),
      );
      const updated = await catalog.transaction(tx =>
        catalog.updateEntity(tx, { entity: added.entity }),
      );
      expect(updated.entity.apiVersion).toEqual(added.entity.apiVersion);
      expect(updated.entity.kind).toEqual(added.entity.kind);
      expect(updated.entity.metadata!.etag).not.toEqual(
        added.entity.metadata!.etag,
      );
      expect(updated.entity.metadata!.generation).toEqual(
        added.entity.metadata!.generation,
      );
      expect(updated.entity.metadata!.name).toEqual(
        added.entity.metadata!.name,
      );
      expect(updated.entity.metadata!.namespace).toEqual(
        added.entity.metadata!.namespace,
      );
    });

    it('can update name if uid matches', async () => {
      const catalog = new Database(database, getVoidLogger());
      const added = await catalog.transaction(tx =>
        catalog.addEntity(tx, entityRequest),
      );
      added.entity.metadata!.name! = 'new!';
      const updated = await catalog.transaction(tx =>
        catalog.updateEntity(tx, { entity: added.entity }),
      );
      expect(updated.entity.metadata!.name).toEqual('new!');
    });

    it('can update fields if kind, name, and namespace match', async () => {
      const catalog = new Database(database, getVoidLogger());
      const added = await catalog.transaction(tx =>
        catalog.addEntity(tx, entityRequest),
      );
      added.entity.apiVersion = 'something.new';
      delete added.entity.metadata!.uid;
      delete added.entity.metadata!.generation;
      const updated = await catalog.transaction(tx =>
        catalog.updateEntity(tx, { entity: added.entity }),
      );
      expect(updated.entity.apiVersion).toEqual('something.new');
    });

    it('rejects if kind, name, but not namespace match', async () => {
      const catalog = new Database(database, getVoidLogger());
      const added = await catalog.transaction(tx =>
        catalog.addEntity(tx, entityRequest),
      );
      added.entity.apiVersion = 'something.new';
      delete added.entity.metadata!.uid;
      delete added.entity.metadata!.generation;
      added.entity.metadata!.namespace = 'something.wrong';
      await expect(
        catalog.transaction(tx =>
          catalog.updateEntity(tx, { entity: added.entity }),
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('fails to update an entity if etag does not match', async () => {
      const catalog = new Database(database, getVoidLogger());
      const added = await catalog.transaction(tx =>
        catalog.addEntity(tx, entityRequest),
      );
      added.entity.metadata!.etag = 'garbage';
      await expect(
        catalog.transaction(tx =>
          catalog.updateEntity(tx, { entity: added.entity }),
        ),
      ).rejects.toThrow(ConflictError);
    });

    it('fails to update an entity if generation does not match', async () => {
      const catalog = new Database(database, getVoidLogger());
      const added = await catalog.transaction(tx =>
        catalog.addEntity(tx, entityRequest),
      );
      added.entity.metadata!.generation! += 100;
      await expect(
        catalog.transaction(tx =>
          catalog.updateEntity(tx, { entity: added.entity }),
        ),
      ).rejects.toThrow(ConflictError);
    });
  });
});
