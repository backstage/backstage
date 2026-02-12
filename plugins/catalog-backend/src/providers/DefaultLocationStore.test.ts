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
import { CatalogScmEventsServiceSubscriber } from '@backstage/plugin-catalog-node/alpha';
import waitFor from 'wait-for-expect';

jest.setTimeout(60_000);

describe('DefaultLocationStore', () => {
  const databases = TestDatabases.create();
  const mockScmEvents = {
    subscribe: jest.fn(),
    publish: jest.fn(),
  };
  let subscriber: CatalogScmEventsServiceSubscriber | undefined;

  beforeEach(() => {
    jest.clearAllMocks();

    subscriber = undefined;
    mockScmEvents.subscribe.mockImplementation(sub => {
      subscriber = sub;
      return { unsubscribe: () => {} };
    });
  });

  async function createLocationStore(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    const connection = { applyMutation: jest.fn(), refresh: jest.fn() };
    const store = new DefaultLocationStore(knex, mockScmEvents, {
      refresh: true,
      unregister: true,
      move: true,
    });
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
          next_update_at: new Date(),
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
          original_value: `url:https://example.com`,
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

  describe('SCM event handling', () => {
    describe.each(databases.eachSupportedId())('%p', databaseId => {
      it('handles location.deleted', async () => {
        const { store, knex, connection } = await createLocationStore(
          databaseId,
        );
        expect(subscriber).not.toBeUndefined();

        // Prepare

        const matchTarget =
          'https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml';
        const otherTarget =
          'https://github.com/backstage/other/blob/master/folder/catalog-info.yaml';

        await store.createLocation({
          type: 'url',
          target: matchTarget,
        });
        await store.createLocation({
          type: 'url',
          target: otherTarget,
        });

        await waitFor(async () => {
          await expect(
            knex<DbLocationsRow>('locations')
              .where('type', 'url')
              .orderBy('target', 'asc'),
          ).resolves.toEqual([
            {
              id: expect.any(String),
              type: 'url',
              target: matchTarget,
            },
            {
              id: expect.any(String),
              type: 'url',
              target: otherTarget,
            },
          ]);
        });

        await waitFor(async () => {
          expect(connection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [
              {
                entity: expect.objectContaining({
                  spec: {
                    target: matchTarget,
                    type: 'url',
                  },
                }),
                locationKey: `url:${matchTarget}`,
              },
            ],
            removed: [],
          });
          expect(connection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [
              {
                entity: expect.objectContaining({
                  spec: {
                    target: otherTarget,
                    type: 'url',
                  },
                }),
                locationKey: `url:${otherTarget}`,
              },
            ],
            removed: [],
          });
        });

        // Act

        await subscriber!.onEvents([
          { type: 'location.deleted', url: matchTarget },
        ]);

        // Verify

        await waitFor(async () => {
          await expect(
            knex<DbLocationsRow>('locations')
              .where('type', 'url')
              .orderBy('target', 'asc'),
          ).resolves.toEqual([
            { id: expect.any(String), type: 'url', target: otherTarget },
          ]);

          expect(connection.applyMutation).toHaveBeenLastCalledWith({
            type: 'delta',
            added: [],
            removed: [
              {
                entity: expect.objectContaining({
                  spec: { target: matchTarget, type: 'url' },
                }),
              },
            ],
          });
        });
      });

      it('handles location.moved', async () => {
        const { store, knex, connection } = await createLocationStore(
          databaseId,
        );
        expect(subscriber).not.toBeUndefined();

        // Prepare

        const matchTarget =
          'https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml';
        const otherTarget =
          'https://github.com/backstage/other/blob/master/folder/catalog-info.yaml';

        await store.createLocation({
          type: 'url',
          target: matchTarget,
        });
        await store.createLocation({
          type: 'url',
          target: otherTarget,
        });

        await waitFor(async () => {
          await expect(
            knex<DbLocationsRow>('locations')
              .where('type', 'url')
              .orderBy('target', 'asc'),
          ).resolves.toEqual([
            {
              id: expect.any(String),
              type: 'url',
              target: matchTarget,
            },
            {
              id: expect.any(String),
              type: 'url',
              target: otherTarget,
            },
          ]);
        });

        await waitFor(async () => {
          expect(connection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [
              {
                entity: expect.objectContaining({
                  spec: {
                    target: matchTarget,
                    type: 'url',
                  },
                }),
                locationKey: `url:${matchTarget}`,
              },
            ],
            removed: [],
          });
          expect(connection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [
              {
                entity: expect.objectContaining({
                  spec: {
                    target: otherTarget,
                    type: 'url',
                  },
                }),
                locationKey: `url:${otherTarget}`,
              },
            ],
            removed: [],
          });
        });

        // Act

        await subscriber!.onEvents([
          {
            type: 'location.moved',
            fromUrl: matchTarget,
            toUrl:
              'https://github.com/backstage/freben/blob/master/catalog-info.yaml',
          },
        ]);

        // Verify

        await waitFor(async () => {
          await expect(
            knex<DbLocationsRow>('locations')
              .where('type', 'url')
              .orderBy('target', 'asc'),
          ).resolves.toEqual([
            {
              id: expect.any(String),
              type: 'url',
              target:
                'https://github.com/backstage/freben/blob/master/catalog-info.yaml',
            },
            { id: expect.any(String), type: 'url', target: otherTarget },
          ]);

          expect(connection.applyMutation).toHaveBeenLastCalledWith({
            type: 'delta',
            added: [
              {
                entity: expect.objectContaining({
                  spec: {
                    target:
                      'https://github.com/backstage/freben/blob/master/catalog-info.yaml',
                    type: 'url',
                  },
                }),
                locationKey: `url:https://github.com/backstage/freben/blob/master/catalog-info.yaml`,
              },
            ],
            removed: [],
          });
        });
      });

      it('handles repository.deleted', async () => {
        const { store, knex, connection } = await createLocationStore(
          databaseId,
        );
        expect(subscriber).not.toBeUndefined();

        // Prepare

        const matchPrefix = 'https://github.com/backstage/demo';
        const matchTarget =
          'https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml';
        const otherTarget =
          'https://github.com/backstage/other/blob/master/folder/catalog-info.yaml';

        await store.createLocation({
          type: 'url',
          target: matchTarget,
        });
        await store.createLocation({
          type: 'url',
          target: otherTarget,
        });

        await waitFor(async () => {
          await expect(
            knex<DbLocationsRow>('locations')
              .where('type', 'url')
              .orderBy('target', 'asc'),
          ).resolves.toEqual([
            {
              id: expect.any(String),
              type: 'url',
              target: matchTarget,
            },
            {
              id: expect.any(String),
              type: 'url',
              target: otherTarget,
            },
          ]);
        });

        await waitFor(async () => {
          expect(connection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [
              {
                entity: expect.objectContaining({
                  spec: {
                    target: matchTarget,
                    type: 'url',
                  },
                }),
                locationKey: `url:${matchTarget}`,
              },
            ],
            removed: [],
          });
          expect(connection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [
              {
                entity: expect.objectContaining({
                  spec: {
                    target: otherTarget,
                    type: 'url',
                  },
                }),
                locationKey: `url:${otherTarget}`,
              },
            ],
            removed: [],
          });
        });

        // Act

        await subscriber!.onEvents([
          { type: 'repository.deleted', url: matchPrefix },
        ]);

        // Verify

        await waitFor(async () => {
          await expect(
            knex<DbLocationsRow>('locations')
              .where('type', 'url')
              .orderBy('target', 'asc'),
          ).resolves.toEqual([
            { id: expect.any(String), type: 'url', target: otherTarget },
          ]);

          expect(connection.applyMutation).toHaveBeenLastCalledWith({
            type: 'delta',
            added: [],
            removed: [
              {
                entity: expect.objectContaining({
                  spec: { target: matchTarget, type: 'url' },
                }),
              },
            ],
          });
        });
      });

      it('handles repository.moved', async () => {
        const { store, knex, connection } = await createLocationStore(
          databaseId,
        );
        expect(subscriber).not.toBeUndefined();

        // Prepare

        const matchTarget =
          'https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml';
        const otherTarget =
          'https://github.com/backstage/other/blob/master/folder/catalog-info.yaml';

        await store.createLocation({
          type: 'url',
          target: matchTarget,
        });
        await store.createLocation({
          type: 'url',
          target: otherTarget,
        });

        await waitFor(async () => {
          await expect(
            knex<DbLocationsRow>('locations')
              .where('type', 'url')
              .orderBy('target', 'asc'),
          ).resolves.toEqual([
            {
              id: expect.any(String),
              type: 'url',
              target: matchTarget,
            },
            {
              id: expect.any(String),
              type: 'url',
              target: otherTarget,
            },
          ]);
        });

        await waitFor(async () => {
          expect(connection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [
              {
                entity: expect.objectContaining({
                  spec: {
                    target: matchTarget,
                    type: 'url',
                  },
                }),
                locationKey: `url:${matchTarget}`,
              },
            ],
            removed: [],
          });
          expect(connection.applyMutation).toHaveBeenCalledWith({
            type: 'delta',
            added: [
              {
                entity: expect.objectContaining({
                  spec: {
                    target: otherTarget,
                    type: 'url',
                  },
                }),
                locationKey: `url:${otherTarget}`,
              },
            ],
            removed: [],
          });
        });

        // Act

        await subscriber!.onEvents([
          {
            type: 'repository.moved',
            fromUrl: 'https://github.com/backstage/demo',
            toUrl: 'https://github.com/freben/demo-renamed',
          },
        ]);

        // Verify

        await waitFor(async () => {
          await expect(
            knex<DbLocationsRow>('locations')
              .where('type', 'url')
              .orderBy('target', 'asc'),
          ).resolves.toEqual([
            { id: expect.any(String), type: 'url', target: otherTarget },
            {
              id: expect.any(String),
              type: 'url',
              target:
                'https://github.com/freben/demo-renamed/blob/master/folder/catalog-info.yaml',
            },
          ]);

          expect(connection.applyMutation).toHaveBeenLastCalledWith({
            type: 'delta',
            added: [
              {
                entity: expect.objectContaining({
                  spec: {
                    target:
                      'https://github.com/freben/demo-renamed/blob/master/folder/catalog-info.yaml',
                    type: 'url',
                  },
                }),
                locationKey: `url:https://github.com/freben/demo-renamed/blob/master/folder/catalog-info.yaml`,
              },
            ],
            removed: [],
          });
        });
      });
    });
  });

  describe('queryLocations', () => {
    const l1 = {
      id: '00000000-0000-0000-0000-000000000001',
      type: 'url',
      target:
        'https://github.com/backstage/backstage/blob/master/packages/catalog-model/catalog-info.yaml',
    };
    const l2 = {
      id: '00000000-0000-0000-0000-000000000002',
      type: 'url',
      target:
        'https://github.com/backstage/backstage/blob/master/plugins/catalog/catalog-info.yaml',
    };
    const l3 = {
      id: '00000000-0000-0000-0000-000000000003',
      type: 'url',
      target:
        'https://github.com/backstage/backstage/blob/master/plugins/scaffolder/catalog-info.yaml',
    };
    const l4 = {
      id: '00000000-0000-0000-0000-000000000004',
      type: 'file',
      target: '/tmp/catalog-info.yaml',
    };

    it.each(databases.eachSupportedId())(
      'queries locations correctly, %p',
      async databaseId => {
        const { store, knex } = await createLocationStore(databaseId);

        // Insert locations in a random order to test the sorting
        const locations = [l1, l2, l3, l4];
        locations.sort(() => Math.random() - 0.5);
        await knex<DbLocationsRow>('locations').delete();
        for (const location of locations) {
          await knex<DbLocationsRow>('locations').insert(location);
        }

        await expect(
          store.queryLocations({
            limit: 10,
          }),
        ).resolves.toEqual({
          items: [l1, l2, l3, l4],
          totalItems: 4,
        });

        await expect(
          store.queryLocations({
            limit: 10,
            query: { type: 'url' },
          }),
        ).resolves.toEqual({
          items: [l1, l2, l3],
          totalItems: 3,
        });

        await expect(
          store.queryLocations({
            limit: 10,
            query: {
              type: 'url',
              target:
                'https://github.com/backstage/backstage/blob/master/plugins/catalog/catalog-info.yaml',
            },
          }),
        ).resolves.toEqual({
          items: [l2],
          totalItems: 1,
        });

        await expect(
          store.queryLocations({
            limit: 10,
            query: { Type: 'urL' },
          }),
        ).resolves.toEqual({
          items: [l1, l2, l3],
          totalItems: 3,
        });

        await expect(
          store.queryLocations({
            limit: 2,
            query: { type: 'url' },
          }),
        ).resolves.toEqual({
          items: [l1, l2],
          totalItems: 3,
        });

        await expect(
          store.queryLocations({
            limit: 10,
            query: { type: 'file' },
          }),
        ).resolves.toEqual({
          items: [l4],
          totalItems: 1,
        });

        await expect(
          store.queryLocations({
            limit: 10,
            query: {
              $all: [
                { type: 'url' },
                {
                  target: {
                    $hasPrefix:
                      'https://github.com/backstage/backstage/blob/master/pa',
                  },
                },
              ],
            },
          }),
        ).resolves.toEqual({
          items: [l1],
          totalItems: 1,
        });

        await expect(
          store.queryLocations({
            limit: 10,
            query: {
              $all: [
                { type: 'file' },
                {
                  target: {
                    $hasPrefix:
                      'https://github.com/backstage/backstage/blob/master/pa',
                  },
                },
              ],
            },
          }),
        ).resolves.toEqual({
          items: [],
          totalItems: 0,
        });

        await expect(
          store.queryLocations({
            limit: 10,
            query: {
              $any: [
                { type: 'file' },
                {
                  target: {
                    $hasPrefix:
                      'https://github.com/backstage/backstage/blob/master/pa',
                  },
                },
              ],
            },
          }),
        ).resolves.toEqual({
          items: [l1, l4],
          totalItems: 2,
        });

        await expect(
          store.queryLocations({
            limit: 10,
            query: {
              $not: { type: 'FILE' },
            },
          }),
        ).resolves.toEqual({
          items: [l1, l2, l3],
          totalItems: 3,
        });

        // Multiple fields in a single query object should be ANDed together
        await expect(
          store.queryLocations({
            limit: 10,
            query: {
              type: 'url',
              target: {
                $hasPrefix:
                  'https://github.com/backstage/backstage/blob/master/plugins/catalog',
              },
            },
          }),
        ).resolves.toEqual({
          items: [l2],
          totalItems: 1,
        });

        await expect(
          store.queryLocations({
            limit: 1,
            query: {
              $not: { type: 'FILE' },
            },
          }),
        ).resolves.toEqual({
          items: [l1],
          totalItems: 3,
        });

        await expect(
          store.queryLocations({
            limit: 10,
            query: {
              $not: { id: '00000000-0000-0000-0000-000000000004' },
            },
          }),
        ).resolves.toEqual({
          items: [l1, l2, l3],
          totalItems: 3,
        });

        await expect(
          store.queryLocations({
            limit: 10,
            query: {
              id: { $exists: false },
            },
          }),
        ).resolves.toEqual({
          items: [],
          totalItems: 0,
        });

        await expect(
          store.queryLocations({
            limit: 10,
            query: {
              $not: { id: { $exists: false } },
            },
          }),
        ).resolves.toEqual({
          items: [l1, l2, l3, l4],
          totalItems: 4,
        });
      },
    );
  });
});
