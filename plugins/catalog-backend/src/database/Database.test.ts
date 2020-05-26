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
import { DescriptorEnvelope } from '../ingestion';
import { Database } from './Database';
import {
  AddDatabaseLocation,
  DbEntityRequest,
  DbEntityResponse,
  DbLocationsRow,
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
          annotations: { g: 'h' },
        },
        spec: { i: 'j' },
      },
    };
  });

  it('manages locations', async () => {
    const db = new Database(database, getVoidLogger());
    const input: AddDatabaseLocation = { type: 'a', target: 'b' };
    const output: DbLocationsRow = {
      id: expect.anything(),
      type: 'a',
      target: 'b',
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
    expect(locations).toEqual([output1]);
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

  describe('entities', () => {
    it('can get all entities with empty filters list', async () => {
      const catalog = new Database(database, getVoidLogger());
      const e1: DescriptorEnvelope = { apiVersion: 'a', kind: 'b' };
      const e2: DescriptorEnvelope = {
        apiVersion: 'a',
        kind: 'b',
        spec: { c: null },
      };
      await catalog.transaction(async tx => {
        await catalog.addEntity(tx, { entity: e1 });
        await catalog.addEntity(tx, { entity: e2 });
      });
      await expect(
        catalog.transaction(async tx => catalog.entities(tx, [])),
      ).resolves.toEqual([
        { locationId: undefined, entity: expect.objectContaining(e1) },
        { locationId: undefined, entity: expect.objectContaining(e2) },
      ]);
    });

    it('can get all specific entities for matching filters (naive case)', async () => {
      const catalog = new Database(database, getVoidLogger());
      const entities: DescriptorEnvelope[] = [
        { apiVersion: 'a', kind: 'b' },
        {
          apiVersion: 'a',
          kind: 'b',
          spec: { c: 'some' },
        },
        {
          apiVersion: 'a',
          kind: 'b',
          spec: { c: null },
        },
      ];

      await catalog.transaction(async tx => {
        for (const entity of entities) {
          await catalog.addEntity(tx, { entity });
        }
      });

      await expect(
        catalog.transaction(async tx =>
          catalog.entities(tx, [
            { key: 'kind', values: ['b'] },
            { key: 'spec.c', values: ['some'] },
          ]),
        ),
      ).resolves.toEqual([
        { locationId: undefined, entity: expect.objectContaining(entities[1]) },
      ]);
    });

    it('can get all specific entities for matching filters with nulls (both missing and literal null value)', async () => {
      const catalog = new Database(database, getVoidLogger());
      const entities: DescriptorEnvelope[] = [
        { apiVersion: 'a', kind: 'b' },
        {
          apiVersion: 'a',
          kind: 'b',
          spec: { c: 'some' },
        },
        {
          apiVersion: 'a',
          kind: 'b',
          spec: { c: null },
        },
      ];

      await catalog.transaction(async tx => {
        for (const entity of entities) {
          await catalog.addEntity(tx, { entity });
        }
      });

      const rows = await catalog.transaction(async tx =>
        catalog.entities(tx, [
          { key: 'kind', values: ['b'] },
          { key: 'spec.c', values: [null, 'some'] },
        ]),
      );

      expect(rows.length).toEqual(3);
      expect(rows).toEqual(
        expect.arrayContaining([
          {
            locationId: undefined,
            entity: expect.objectContaining(entities[0]),
          },
          {
            locationId: undefined,
            entity: expect.objectContaining(entities[1]),
          },
          {
            locationId: undefined,
            entity: expect.objectContaining(entities[2]),
          },
        ]),
      );
    });
  });
});
