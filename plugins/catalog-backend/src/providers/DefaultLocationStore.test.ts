/*
 * Copyright 2021 The Backstage Authors
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
import { ANNOTATION_ORIGIN_LOCATION } from '@backstage/catalog-model';
import { v4 as uuid } from 'uuid';
import { applyDatabaseMigrations } from '../database/migrations';
import {
  DbFinalEntitiesRow,
  DbLocationsRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';
import { DefaultLocationStore } from './DefaultLocationStore';

jest.setTimeout(60_000);

describe('DefaultLocationStore', () => {
  const databases = TestDatabases.create();

  async function createLocationStore(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    const connection = { applyMutation: jest.fn(), refresh: jest.fn() };
    const store = new DefaultLocationStore(knex);
    await store.connect(connection);
    return { store, connection, knex };
  }

  it.each(databases.eachSupportedId())(
    'should do a full sync with the locations on connect, %p',
    async databaseId => {
      const { connection } = await createLocationStore(databaseId);

      expect(connection.applyMutation).toHaveBeenCalledWith({
        type: 'full',
        entities: [],
      });
    },
  );

  describe('listLocations', () => {
    it.each(databases.eachSupportedId())(
      'lists empty locations when there is no locations, %p',
      async databaseId => {
        const { store } = await createLocationStore(databaseId);
        expect(await store.listLocations()).toEqual([]);
      },
    );

    it.each(databases.eachSupportedId())(
      'lists locations that are added to the db, %p',
      async databaseId => {
        const { store } = await createLocationStore(databaseId);
        await store.createLocation({
          target:
            'https://github.com/backstage/demo/blob/master/catalog-info.yml',
          type: 'url',
        });

        const listLocations = await store.listLocations();
        expect(listLocations).toHaveLength(1);
        expect(listLocations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              target:
                'https://github.com/backstage/demo/blob/master/catalog-info.yml',
              type: 'url',
            }),
          ]),
        );
      },
    );
  });

  describe('createLocation', () => {
    it.each(databases.eachSupportedId())(
      'throws when the location already exists, %p',
      async databaseId => {
        const { store } = await createLocationStore(databaseId);
        const spec = {
          target:
            'https://github.com/backstage/demo/blob/master/catalog-info.yml',
          type: 'url',
        };
        await store.createLocation(spec);
        await expect(() => store.createLocation(spec)).rejects.toThrow(
          new RegExp(`Location ${spec.type}:${spec.target} already exists`),
        );
      },
    );

    it.each(databases.eachSupportedId())(
      'calls apply mutation when adding a new location, %p',
      async databaseId => {
        const { store, connection } = await createLocationStore(databaseId);
        await store.createLocation({
          target:
            'https://github.com/backstage/demo/blob/master/catalog-info.yml',
          type: 'url',
        });

        expect(connection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          removed: [],
          added: expect.arrayContaining([
            {
              entity: expect.objectContaining({
                spec: {
                  target:
                    'https://github.com/backstage/demo/blob/master/catalog-info.yml',
                  type: 'url',
                },
              }),
              locationKey:
                'url:https://github.com/backstage/demo/blob/master/catalog-info.yml',
            },
          ]),
        });
      },
    );
  });

  describe('deleteLocation', () => {
    it.each(databases.eachSupportedId())(
      'throws if the location does not exist, %p',
      async databaseId => {
        const { store } = await createLocationStore(databaseId);
        const id = uuid();
        await expect(() => store.deleteLocation(id)).rejects.toThrow(
          new RegExp(`Found no location with ID ${id}`),
        );
      },
    );

    it.each(databases.eachSupportedId())(
      'calls apply mutation when adding a new location, %p',
      async databaseId => {
        const { store, connection } = await createLocationStore(databaseId);

        const location = await store.createLocation({
          target:
            'https://github.com/backstage/demo/blob/master/catalog-info.yml',
          type: 'url',
        });

        await store.deleteLocation(location.id);

        expect(connection.applyMutation).toHaveBeenCalledWith({
          type: 'delta',
          added: [],
          removed: [
            {
              entity: expect.objectContaining({
                spec: {
                  target:
                    'https://github.com/backstage/demo/blob/master/catalog-info.yml',
                  type: 'url',
                },
              }),
              locationKey:
                'url:https://github.com/backstage/demo/blob/master/catalog-info.yml',
            },
          ],
        });
      },
    );
  });

  describe('getLocationByEntity', () => {
    it.each(databases.eachSupportedId())(
      'loads correctly, %p',
      async databaseId => {
        const { store, knex } = await createLocationStore(databaseId);

        const entityId = uuid();
        const locationId = uuid();

        await knex<DbRefreshStateRow>('refresh_state').insert({
          entity_id: entityId,
          entity_ref: 'k:ns/n',
          unprocessed_entity: '{}',
          errors: '[]',
          last_discovery_at: new Date(),
        });

        await knex<DbFinalEntitiesRow>('final_entities').insert({
          entity_id: entityId,
          final_entity: '{}',
          hash: 'hash',
          last_updated_at: new Date(),
          stitch_ticket: '',
          entity_ref: 'k:ns/n',
        });

        await knex<DbSearchRow>('search').insert({
          entity_id: entityId,
          key: `metadata.annotations.${ANNOTATION_ORIGIN_LOCATION}`,
          value: `url:https://example.com`,
        });

        await knex<DbLocationsRow>('locations').insert({
          id: locationId,
          type: 'url',
          target: 'https://example.com',
        });

        await expect(
          store.getLocationByEntity({ kind: 'k', namespace: 'ns', name: 'n' }),
        ).resolves.toEqual({
          id: locationId,
          type: 'url',
          target: 'https://example.com',
        });

        await expect(
          store.getLocationByEntity({ kind: 'k', namespace: 'ns', name: 'n2' }),
        ).rejects.toMatchInlineSnapshot(
          `[NotFoundError: found no entity for ref k:ns/n2]`,
        );
      },
    );
  });
});
