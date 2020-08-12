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

import { ConflictError } from '@backstage/backend-common';
import type { Entity, Location } from '@backstage/catalog-model';
import { DatabaseManager } from './DatabaseManager';
import { Database, DatabaseLocationUpdateLogStatus } from './types';
import type {
  DbEntityRequest,
  DbEntityResponse,
  DbLocationsRowWithStatus,
} from './types';

describe('CommonDatabase', () => {
  let db: Database;
  let entityRequest: DbEntityRequest;
  let entityResponse: DbEntityResponse;

  beforeEach(async () => {
    db = await DatabaseManager.createTestDatabase();

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
          },
        },
        spec: { i: 'j' },
      },
    };
  });

  it('manages locations', async () => {
    const input: Location = {
      id: 'dd12620d-0436-422f-93bd-929aa0788123',
      type: 'a',
      target: 'b',
    };
    const output: DbLocationsRowWithStatus = {
      id: 'dd12620d-0436-422f-93bd-929aa0788123',
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

    // If we add 2 new update log events,
    // this should not result in location duplication
    // due to incorrect join in DB
    await db.addLocationUpdateLogEvent(
      'dd12620d-0436-422f-93bd-929aa0788123',
      DatabaseLocationUpdateLogStatus.SUCCESS,
    );

    // Have a second in-between
    // To avoid having same timestamp on event
    await new Promise(res => setTimeout(res, 1000));
    await db.addLocationUpdateLogEvent(
      'dd12620d-0436-422f-93bd-929aa0788123',
      DatabaseLocationUpdateLogStatus.FAIL,
    );

    expect(await db.locations()).toEqual([
      {
        ...output,
        status: DatabaseLocationUpdateLogStatus.FAIL,
        timestamp: expect.any(String),
      },
    ]);

    await db.transaction(tx => db.removeLocation(tx, locations[0].id));

    await expect(db.locations()).resolves.toEqual([]);
    await expect(db.location(locations[0].id)).rejects.toThrow(
      /Found no location/,
    );
  });

  describe('addEntity', () => {
    it('happy path: adds entity to empty database', async () => {
      const added = await db.transaction(tx => db.addEntity(tx, entityRequest));
      expect(added).toStrictEqual(entityResponse);
      expect(added.entity.metadata.generation).toBe(1);
    });

    it('rejects adding the same-named entity twice', async () => {
      await db.transaction(tx => db.addEntity(tx, entityRequest));
      await expect(
        db.transaction(tx => db.addEntity(tx, entityRequest)),
      ).rejects.toThrow(ConflictError);
    });

    it('rejects adding the almost-same-kind entity twice', async () => {
      entityRequest.entity.kind = 'some-kind';
      await db.transaction(tx => db.addEntity(tx, entityRequest));
      entityRequest.entity.kind = 'SomeKind';
      await expect(
        db.transaction(tx => db.addEntity(tx, entityRequest)),
      ).rejects.toThrow(ConflictError);
    });

    it('rejects adding the almost-same-named entity twice', async () => {
      entityRequest.entity.metadata.name = 'some-name';
      await db.transaction(tx => db.addEntity(tx, entityRequest));
      entityRequest.entity.metadata.name = 'SomeName';
      await expect(
        db.transaction(tx => db.addEntity(tx, entityRequest)),
      ).rejects.toThrow(ConflictError);
    });

    it('rejects adding the almost-same-namespace entity twice', async () => {
      entityRequest.entity.metadata.namespace = undefined;
      await db.transaction(tx => db.addEntity(tx, entityRequest));
      entityRequest.entity.metadata.namespace = '';
      await expect(
        db.transaction(tx => db.addEntity(tx, entityRequest)),
      ).rejects.toThrow(ConflictError);
    });

    it('accepts adding the same-named entity twice if on different namespaces', async () => {
      entityRequest.entity.metadata.namespace = 'namespace1';
      await db.transaction(tx => db.addEntity(tx, entityRequest));
      entityRequest.entity.metadata.namespace = 'namespace2';
      await expect(
        db.transaction(tx => db.addEntity(tx, entityRequest)),
      ).resolves.toBeDefined();
    });
  });

  describe('locationHistory', () => {
    it('outputs the history correctly', async () => {
      const location: Location = {
        id: 'dd12620d-0436-422f-93bd-929aa0788123',
        type: 'a',
        target: 'b',
      };
      await db.addLocation(location);

      await db.addLocationUpdateLogEvent(
        'dd12620d-0436-422f-93bd-929aa0788123',
        DatabaseLocationUpdateLogStatus.SUCCESS,
      );
      await db.addLocationUpdateLogEvent(
        'dd12620d-0436-422f-93bd-929aa0788123',
        DatabaseLocationUpdateLogStatus.FAIL,
        undefined,
        'Something went wrong',
      );

      const result = await db.locationHistory(
        'dd12620d-0436-422f-93bd-929aa0788123',
      );
      expect(result).toEqual([
        {
          created_at: expect.anything(),
          entity_name: null,
          id: expect.anything(),
          location_id: 'dd12620d-0436-422f-93bd-929aa0788123',
          message: null,
          status: DatabaseLocationUpdateLogStatus.SUCCESS,
        },
        {
          created_at: expect.anything(),
          entity_name: null,
          id: expect.anything(),
          location_id: 'dd12620d-0436-422f-93bd-929aa0788123',
          message: 'Something went wrong',
          status: DatabaseLocationUpdateLogStatus.FAIL,
        },
      ]);
    });
  });

  describe('updateEntity', () => {
    it('can read and no-op-update an entity', async () => {
      const added = await db.transaction(tx => db.addEntity(tx, entityRequest));
      const updated = await db.transaction(tx =>
        db.updateEntity(tx, { entity: added.entity }),
      );
      expect(updated.entity.apiVersion).toEqual(added.entity.apiVersion);
      expect(updated.entity.kind).toEqual(added.entity.kind);
      expect(updated.entity.metadata.etag).toEqual(added.entity.metadata.etag);
      expect(updated.entity.metadata.generation).toEqual(
        added.entity.metadata.generation,
      );
      expect(updated.entity.metadata.name).toEqual(added.entity.metadata.name);
      expect(updated.entity.metadata.namespace).toEqual(
        added.entity.metadata.namespace,
      );
    });

    it('can update name if uid matches', async () => {
      const added = await db.transaction(tx => db.addEntity(tx, entityRequest));
      added.entity.metadata.name! = 'new!';
      const updated = await db.transaction(tx =>
        db.updateEntity(tx, { entity: added.entity }),
      );
      expect(updated.entity.metadata.name).toEqual('new!');
    });

    it('fails to update an entity if etag does not match', async () => {
      const added = await db.transaction(tx => db.addEntity(tx, entityRequest));
      await expect(
        db.transaction(tx =>
          db.updateEntity(tx, { entity: added.entity }, 'garbage'),
        ),
      ).rejects.toThrow(ConflictError);
    });

    it('fails to update an entity if generation does not match', async () => {
      const added = await db.transaction(tx => db.addEntity(tx, entityRequest));
      await expect(
        db.transaction(tx =>
          db.updateEntity(tx, { entity: added.entity }, undefined, 1e20),
        ),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('entities', () => {
    it('can get all entities with empty filters list', async () => {
      const e1: Entity = {
        apiVersion: 'a',
        kind: 'k1',
        metadata: { name: 'n' },
      };
      const e2: Entity = {
        apiVersion: 'c',
        kind: 'k2',
        metadata: { name: 'n' },
        spec: { c: null },
      };
      await db.transaction(async tx => {
        await db.addEntity(tx, { entity: e1 });
        await db.addEntity(tx, { entity: e2 });
      });
      const result = await db.transaction(async tx => db.entities(tx, []));
      expect(result.length).toEqual(2);
      expect(result).toEqual(
        expect.arrayContaining([
          {
            locationId: undefined,
            entity: expect.objectContaining({ kind: 'k1' }),
          },
          {
            locationId: undefined,
            entity: expect.objectContaining({ kind: 'k2' }),
          },
        ]),
      );
    });

    it('can get all specific entities for matching filters (naive case)', async () => {
      const entities: Entity[] = [
        { apiVersion: 'a', kind: 'k1', metadata: { name: 'n' } },
        {
          apiVersion: 'a',
          kind: 'k2',
          metadata: { name: 'n' },
          spec: { c: 'some' },
        },
        {
          apiVersion: 'a',
          kind: 'k3',
          metadata: { name: 'n' },
          spec: { c: null },
        },
      ];

      await db.transaction(async tx => {
        for (const entity of entities) {
          await db.addEntity(tx, { entity });
        }
      });

      await expect(
        db.transaction(async tx =>
          db.entities(tx, [
            { key: 'kind', values: ['k2'] },
            { key: 'spec.c', values: ['some'] },
          ]),
        ),
      ).resolves.toEqual([
        {
          locationId: undefined,
          entity: expect.objectContaining({ kind: 'k2' }),
        },
      ]);
    });

    it('can get all specific entities for matching filters with nulls (both missing and literal null value)', async () => {
      const entities: Entity[] = [
        { apiVersion: 'a', kind: 'k1', metadata: { name: 'n' } },
        {
          apiVersion: 'a',
          kind: 'k2',
          metadata: { name: 'n' },
          spec: { c: 'some' },
        },
        {
          apiVersion: 'a',
          kind: 'k3',
          metadata: { name: 'n' },
          spec: { c: null },
        },
      ];

      await db.transaction(async tx => {
        for (const entity of entities) {
          await db.addEntity(tx, { entity });
        }
      });

      const rows = await db.transaction(async tx =>
        db.entities(tx, [
          { key: 'apiVersion', values: ['a'] },
          { key: 'spec.c', values: [null, 'some'] },
        ]),
      );

      expect(rows.length).toEqual(3);
      expect(rows).toEqual(
        expect.arrayContaining([
          {
            locationId: undefined,
            entity: expect.objectContaining({ kind: 'k1' }),
          },
          {
            locationId: undefined,
            entity: expect.objectContaining({ kind: 'k2' }),
          },
          {
            locationId: undefined,
            entity: expect.objectContaining({ kind: 'k3' }),
          },
        ]),
      );
    });
  });
});
