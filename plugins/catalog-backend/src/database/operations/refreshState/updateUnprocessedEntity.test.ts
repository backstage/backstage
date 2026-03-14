/*
 * Copyright 2026 The Backstage Authors
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

import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import * as uuid from 'uuid';
import { applyDatabaseMigrations } from '../../migrations';
import { DbRefreshStateRow } from '../../tables';
import { updateUnprocessedEntity } from './updateUnprocessedEntity';

jest.setTimeout(60_000);

describe('updateUnprocessedEntity', () => {
  const databases = TestDatabases.create();

  async function createDatabase(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return knex;
  }

  async function insertRefreshStateRow(
    db: Awaited<ReturnType<typeof createDatabase>>,
    row: DbRefreshStateRow,
  ) {
    await db<DbRefreshStateRow>('refresh_state').insert(row);
  }

  async function getRefreshStateRow(
    db: Awaited<ReturnType<typeof createDatabase>>,
    entityRef: string,
  ) {
    return db<DbRefreshStateRow>('refresh_state')
      .where({ entity_ref: entityRef })
      .first();
  }

  function normalizeTimestamp(value: string | Date | undefined): number {
    if (!value) {
      throw new Error('Expected timestamp value');
    }

    return typeof value === 'string'
      ? new Date(value).getTime()
      : value.getTime();
  }

  it.each(databases.eachSupportedId())(
    'updates an existing weakly owned row when no location key is provided, %p',
    async databaseId => {
      const knex = await createDatabase(databaseId);
      const entityBefore: Entity = {
        apiVersion: '1',
        kind: 'Component',
        metadata: { namespace: 'default', name: 'weak-entity' },
      };
      const entityAfter: Entity = {
        ...entityBefore,
        spec: { owner: 'team-a' },
      };
      const entityRef = stringifyEntityRef(entityBefore);
      const originalTimestamp = '2021-04-01 13:37:00';

      await insertRefreshStateRow(knex, {
        entity_id: uuid.v4(),
        entity_ref: entityRef,
        unprocessed_entity: JSON.stringify(entityBefore),
        unprocessed_hash: 'old-hash',
        errors: '[]',
        next_update_at: originalTimestamp,
        last_discovery_at: originalTimestamp,
      });

      await expect(
        updateUnprocessedEntity({
          tx: knex,
          entity: entityAfter,
          hash: 'new-hash',
        }),
      ).resolves.toEqual({
        updated: true,
        claimedFromNullLocationKey: false,
      });

      await expect(getRefreshStateRow(knex, entityRef)).resolves.toEqual(
        expect.objectContaining({
          entity_ref: entityRef,
          unprocessed_entity: JSON.stringify(entityAfter),
          unprocessed_hash: 'new-hash',
          location_key: null,
        }),
      );

      const row = await getRefreshStateRow(knex, entityRef);
      expect(normalizeTimestamp(row?.next_update_at)).toBeGreaterThan(
        normalizeTimestamp(originalTimestamp),
      );
      expect(normalizeTimestamp(row?.last_discovery_at)).toBeGreaterThan(
        normalizeTimestamp(originalTimestamp),
      );
    },
  );

  it.each(databases.eachSupportedId())(
    'updates an existing row with the same location key, %p',
    async databaseId => {
      const knex = await createDatabase(databaseId);
      const entityBefore: Entity = {
        apiVersion: '1',
        kind: 'Component',
        metadata: { namespace: 'default', name: 'same-key-entity' },
      };
      const entityAfter: Entity = {
        ...entityBefore,
        spec: { owner: 'team-b' },
      };
      const entityRef = stringifyEntityRef(entityBefore);

      await insertRefreshStateRow(knex, {
        entity_id: uuid.v4(),
        entity_ref: entityRef,
        unprocessed_entity: JSON.stringify(entityBefore),
        unprocessed_hash: 'old-hash',
        errors: '[]',
        next_update_at: '2021-04-01 13:37:00',
        last_discovery_at: '2021-04-01 13:37:00',
        location_key: 'provider-key',
      });

      await expect(
        updateUnprocessedEntity({
          tx: knex,
          entity: entityAfter,
          hash: 'new-hash',
          locationKey: 'provider-key',
        }),
      ).resolves.toEqual({
        updated: true,
        claimedFromNullLocationKey: false,
      });

      await expect(getRefreshStateRow(knex, entityRef)).resolves.toEqual(
        expect.objectContaining({
          entity_ref: entityRef,
          unprocessed_entity: JSON.stringify(entityAfter),
          unprocessed_hash: 'new-hash',
          location_key: 'provider-key',
        }),
      );
    },
  );

  it.each(databases.eachSupportedId())(
    'claims a weakly owned row when a location key is provided, %p',
    async databaseId => {
      const knex = await createDatabase(databaseId);
      const entityBefore: Entity = {
        apiVersion: '1',
        kind: 'Component',
        metadata: { namespace: 'default', name: 'claimed-entity' },
      };
      const entityAfter: Entity = {
        ...entityBefore,
        spec: { owner: 'team-c' },
      };
      const entityRef = stringifyEntityRef(entityBefore);

      await insertRefreshStateRow(knex, {
        entity_id: uuid.v4(),
        entity_ref: entityRef,
        unprocessed_entity: JSON.stringify(entityBefore),
        unprocessed_hash: 'old-hash',
        errors: '[]',
        next_update_at: '2021-04-01 13:37:00',
        last_discovery_at: '2021-04-01 13:37:00',
      });

      await expect(
        updateUnprocessedEntity({
          tx: knex,
          entity: entityAfter,
          hash: 'new-hash',
          locationKey: 'provider-key',
        }),
      ).resolves.toEqual({
        updated: true,
        claimedFromNullLocationKey: true,
      });

      await expect(getRefreshStateRow(knex, entityRef)).resolves.toEqual(
        expect.objectContaining({
          entity_ref: entityRef,
          unprocessed_entity: JSON.stringify(entityAfter),
          unprocessed_hash: 'new-hash',
          location_key: 'provider-key',
        }),
      );
    },
  );

  it.each(databases.eachSupportedId())(
    'refuses to update rows owned by a different location key, %p',
    async databaseId => {
      const knex = await createDatabase(databaseId);
      const entityBefore: Entity = {
        apiVersion: '1',
        kind: 'Component',
        metadata: { namespace: 'default', name: 'conflicting-entity' },
      };
      const entityAfter: Entity = {
        ...entityBefore,
        spec: { owner: 'team-d' },
      };
      const entityRef = stringifyEntityRef(entityBefore);

      await insertRefreshStateRow(knex, {
        entity_id: uuid.v4(),
        entity_ref: entityRef,
        unprocessed_entity: JSON.stringify(entityBefore),
        unprocessed_hash: 'old-hash',
        errors: '[]',
        next_update_at: '2021-04-01 13:37:00',
        last_discovery_at: '2021-04-01 13:37:00',
        location_key: 'other-provider-key',
      });

      await expect(
        updateUnprocessedEntity({
          tx: knex,
          entity: entityAfter,
          hash: 'new-hash',
          locationKey: 'provider-key',
        }),
      ).resolves.toEqual({
        updated: false,
        claimedFromNullLocationKey: false,
      });

      await expect(getRefreshStateRow(knex, entityRef)).resolves.toEqual(
        expect.objectContaining({
          entity_ref: entityRef,
          unprocessed_entity: JSON.stringify(entityBefore),
          unprocessed_hash: 'old-hash',
          location_key: 'other-provider-key',
        }),
      );
    },
  );

  it.each(databases.eachSupportedId())(
    'does not let a weak update replace a strongly owned row, %p',
    async databaseId => {
      const knex = await createDatabase(databaseId);
      const entityBefore: Entity = {
        apiVersion: '1',
        kind: 'Component',
        metadata: { namespace: 'default', name: 'strongly-owned-entity' },
      };
      const entityAfter: Entity = {
        ...entityBefore,
        spec: { owner: 'team-e' },
      };
      const entityRef = stringifyEntityRef(entityBefore);

      await insertRefreshStateRow(knex, {
        entity_id: uuid.v4(),
        entity_ref: entityRef,
        unprocessed_entity: JSON.stringify(entityBefore),
        unprocessed_hash: 'old-hash',
        errors: '[]',
        next_update_at: '2021-04-01 13:37:00',
        last_discovery_at: '2021-04-01 13:37:00',
        location_key: 'provider-key',
      });

      await expect(
        updateUnprocessedEntity({
          tx: knex,
          entity: entityAfter,
          hash: 'new-hash',
        }),
      ).resolves.toEqual({
        updated: false,
        claimedFromNullLocationKey: false,
      });

      await expect(getRefreshStateRow(knex, entityRef)).resolves.toEqual(
        expect.objectContaining({
          entity_ref: entityRef,
          unprocessed_entity: JSON.stringify(entityBefore),
          unprocessed_hash: 'old-hash',
          location_key: 'provider-key',
        }),
      );
    },
  );
});
