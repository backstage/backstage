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
import type {
  DbEntityRequest,
  DbEntityResponse,
  DbLocationsRowWithStatus,
} from './types';
import { Database, DatabaseLocationUpdateLogStatus } from './types';

const bootstrapLocation = {
  id: expect.any(String),
  type: 'bootstrap',
  target: 'bootstrap',
  message: null,
  status: null,
  timestamp: null,
};

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
    expect(locations).toEqual(
      expect.arrayContaining([output, bootstrapLocation]),
    );
    const location = await db.location(
      locations.find(l => l.type !== 'bootstrap')!.id,
    );
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

    await expect(db.locations()).resolves.toEqual(
      expect.arrayContaining([
        bootstrapLocation,
        {
          ...output,
          status: DatabaseLocationUpdateLogStatus.FAIL,
          timestamp: expect.anything(),
        },
      ]),
    );

    await db.transaction(tx => db.removeLocation(tx, location.id));

    await expect(db.locations()).resolves.toEqual([bootstrapLocation]);
    await expect(db.location(location.id)).rejects.toThrow(/Found no location/);
  });

  describe('addEntities', () => {
    it('happy path: adds entities to empty database', async () => {
      const result = await db.transaction(tx =>
        db.addEntities(tx, [entityRequest]),
      );
      expect(result).toEqual([entityResponse]);
    });

    it('rejects adding the same-named entity twice', async () => {
      const req: DbEntityRequest[] = [
        {
          entity: {
            apiVersion: 'av1',
            kind: 'k1',
            metadata: { name: 'n1', namespace: 'ns1' },
          },
        },
        {
          entity: {
            apiVersion: 'av1',
            kind: 'k1',
            metadata: { name: 'n1', namespace: 'ns1' },
          },
        },
      ];
      await expect(
        db.transaction(tx => db.addEntities(tx, req)),
      ).rejects.toThrow(ConflictError);
    });

    it('rejects adding the almost-same-namespace entity twice', async () => {
      const req: DbEntityRequest[] = [
        {
          entity: {
            apiVersion: 'av1',
            kind: 'k1',
            metadata: { name: 'n1', namespace: 'ns1' },
          },
        },
        {
          entity: {
            apiVersion: 'av1',
            kind: 'k1',
            metadata: { name: 'n1', namespace: 'nS1' },
          },
        },
      ];
      await expect(
        db.transaction(tx => db.addEntities(tx, req)),
      ).rejects.toThrow(ConflictError);
    });

    it('accepts adding the same-named entity twice if on different namespaces', async () => {
      const req: DbEntityRequest[] = [
        {
          entity: {
            apiVersion: 'av1',
            kind: 'k1',
            metadata: { name: 'n1', namespace: 'ns1' },
          },
        },
        {
          entity: {
            apiVersion: 'av1',
            kind: 'k1',
            metadata: { name: 'n1', namespace: 'ns2' },
          },
        },
      ];
      await expect(
        db.transaction(tx => db.addEntities(tx, req)),
      ).resolves.toEqual([
        {
          entity: expect.objectContaining({
            metadata: expect.objectContaining({
              namespace: 'ns1',
              uid: expect.any(String),
              etag: expect.any(String),
              generation: expect.any(Number),
            }),
          }),
        },
        {
          entity: expect.objectContaining({
            metadata: expect.objectContaining({
              namespace: 'ns2',
              uid: expect.any(String),
              etag: expect.any(String),
              generation: expect.any(Number),
            }),
          }),
        },
      ]);
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
      expect(result).toEqual(
        expect.arrayContaining([
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
        ]),
      );
    });
  });

  describe('updateEntity', () => {
    it('can read and no-op-update an entity', async () => {
      const [added] = await db.transaction(tx =>
        db.addEntities(tx, [entityRequest]),
      );
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
      const [added] = await db.transaction(tx =>
        db.addEntities(tx, [entityRequest]),
      );
      added.entity.metadata.name! = 'new!';
      const updated = await db.transaction(tx =>
        db.updateEntity(tx, { entity: added.entity }),
      );
      expect(updated.entity.metadata.name).toEqual('new!');
    });

    it('fails to update an entity if etag does not match', async () => {
      const [added] = await db.transaction(tx =>
        db.addEntities(tx, [entityRequest]),
      );
      await expect(
        db.transaction(tx =>
          db.updateEntity(tx, { entity: added.entity }, 'garbage'),
        ),
      ).rejects.toThrow(ConflictError);
    });

    it('fails to update an entity if generation does not match', async () => {
      const [added] = await db.transaction(tx =>
        db.addEntities(tx, [entityRequest]),
      );
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
        await db.addEntities(tx, [{ entity: e1 }, { entity: e2 }]);
      });
      const result = await db.transaction(async tx => db.entities(tx, {}));
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
        await db.addEntities(
          tx,
          entities.map(entity => ({ entity })),
        );
      });

      await expect(
        db.transaction(async tx =>
          db.entities(tx, { kind: 'k2', 'spec.c': 'some' }),
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
        await db.addEntities(
          tx,
          entities.map(entity => ({ entity })),
        );
      });

      const rows = await db.transaction(async tx =>
        db.entities(tx, { apiVersion: 'a', 'spec.c': [null, 'some'] }),
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

    it('can get all specific entities for matching filters case insensitively)', async () => {
      const entities: Entity[] = [
        { apiVersion: 'A', kind: 'K1', metadata: { name: 'N' } },
        {
          apiVersion: 'a',
          kind: 'k2',
          metadata: { name: 'n' },
          spec: { c: 'Some' },
        },
        {
          apiVersion: 'a',
          kind: 'k3',
          metadata: { name: 'n' },
          spec: { c: null },
        },
      ];

      await db.transaction(async tx => {
        await db.addEntities(
          tx,
          entities.map(entity => ({ entity })),
        );
      });

      const rows = await db.transaction(async tx =>
        db.entities(tx, { ApiVersioN: 'A', 'spEc.C': [null, 'some'] }),
      );

      expect(rows.length).toEqual(3);
      expect(rows).toEqual(
        expect.arrayContaining([
          {
            locationId: undefined,
            entity: expect.objectContaining({ kind: 'K1' }),
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

  describe('entityByName', () => {
    it('can get entities case insensitively', async () => {
      const entities: Entity[] = [
        {
          apiVersion: 'a',
          kind: 'k1',
          metadata: { name: 'n' },
        },
        {
          apiVersion: 'B',
          kind: 'K2',
          metadata: { name: 'N', namespace: 'NS' },
        },
      ];

      await db.transaction(async tx => {
        await db.addEntities(
          tx,
          entities.map(entity => ({ entity })),
        );
      });

      const e1 = await db.transaction(async tx =>
        db.entityByName(tx, { kind: 'k1', namespace: 'default', name: 'n' }),
      );
      expect(e1!.entity.metadata.name).toEqual('n');
      const e2 = await db.transaction(async tx =>
        db.entityByName(tx, { kind: 'k2', namespace: 'nS', name: 'n' }),
      );
      expect(e2!.entity.metadata.name).toEqual('N');
      const e3 = await db.transaction(async tx =>
        db.entityByName(tx, { kind: 'unknown', namespace: 'nS', name: 'n' }),
      );
      expect(e3).toBeUndefined();
    });
  });
});
