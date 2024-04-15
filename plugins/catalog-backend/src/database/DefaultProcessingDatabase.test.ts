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

import {
  mockServices,
  TestDatabaseId,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { Knex } from 'knex';
import * as uuid from 'uuid';
import { Logger } from 'winston';
import { DateTime } from 'luxon';
import { applyDatabaseMigrations } from './migrations';
import { DefaultProcessingDatabase } from './DefaultProcessingDatabase';
import {
  DbRefreshKeysRow,
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
  DbRelationsRow,
} from './tables';
import { createRandomProcessingInterval } from '../processing';
import { timestampToDateTime } from './conversion';
import { generateStableHash } from './util';
import { LoggerService } from '@backstage/backend-plugin-api';

jest.setTimeout(60_000);

describe('DefaultProcessingDatabase', () => {
  const defaultLogger = mockServices.logger.mock();
  const databases = TestDatabases.create();

  async function createDatabase(
    databaseId: TestDatabaseId,
    logger: LoggerService = defaultLogger,
  ) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return {
      knex,
      db: new DefaultProcessingDatabase({
        database: knex,
        logger,
        refreshInterval: createRandomProcessingInterval({
          minSeconds: 100,
          maxSeconds: 150,
        }),
      }),
    };
  }

  const insertRefRow = async (db: Knex, ref: DbRefreshStateReferencesRow) => {
    return db<DbRefreshStateReferencesRow>('refresh_state_references').insert(
      ref,
    );
  };

  const insertRefreshStateRow = async (db: Knex, ref: DbRefreshStateRow) => {
    await db<DbRefreshStateRow>('refresh_state').insert(ref);
  };

  describe('updateProcessedEntity', () => {
    let id: string;
    let processedEntity: Entity;

    beforeEach(() => {
      id = uuid.v4();
      processedEntity = {
        apiVersion: '1',
        kind: 'Location',
        metadata: {
          name: 'fakelocation',
        },
        spec: {
          type: 'url',
          target: 'somethingelse',
        },
      };
    });

    it.each(databases.eachSupportedId())(
      'fails when an entity is processed with a different locationKey, %p',
      async databaseId => {
        const { db } = await createDatabase(databaseId);
        await db.transaction(async tx => {
          await expect(() =>
            db.updateProcessedEntity(tx, {
              id,
              processedEntity,
              resultHash: '',
              relations: [],
              deferredEntities: [],
              refreshKeys: [],
            }),
          ).rejects.toThrow(
            `Conflicting write of processing result for ${id} with location key 'undefined'`,
          );
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'fails when the locationKey is different, %p',
      async databaseId => {
        const options = {
          id,
          processedEntity,
          resultHash: '',
          relations: [],
          deferredEntities: [],
          locationKey: 'key',
          refreshKeys: [],
          errors: "['something broke']",
        };
        const { knex, db } = await createDatabase(databaseId);
        await insertRefreshStateRow(knex, {
          entity_id: id,
          entity_ref: 'location:default/fakelocation',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          location_key: 'key',
          errors: '[]',
          next_update_at: '2021-04-01 13:37:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });
        await db.transaction(tx => db.updateProcessedEntity(tx, options));

        const entities =
          await knex<DbRefreshStateRow>('refresh_state').select();
        expect(entities.length).toBe(1);

        await db.transaction(tx =>
          expect(
            db.updateProcessedEntity(tx, {
              ...options,
              resultHash: '',
              locationKey: 'fail',
              refreshKeys: [],
            }),
          ).rejects.toThrow(
            `Conflicting write of processing result for ${id} with location key 'fail'`,
          ),
        );
      },
    );

    it.each(databases.eachSupportedId())(
      'updates the refresh state entry with the cache, processed entity and errors, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        await insertRefreshStateRow(knex, {
          entity_id: id,
          entity_ref: 'location:default/fakelocation',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: '2021-04-01 13:37:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });

        await db.transaction(tx =>
          db.updateProcessedEntity(tx, {
            id,
            processedEntity,
            resultHash: '',
            relations: [],
            deferredEntities: [],
            locationKey: 'key',
            refreshKeys: [],
            errors: "['something broke']",
          }),
        );

        const entities =
          await knex<DbRefreshStateRow>('refresh_state').select();
        expect(entities.length).toBe(1);
        expect(entities[0].processed_entity).toEqual(
          JSON.stringify(processedEntity),
        );
        expect(entities[0].errors).toEqual("['something broke']");
        expect(entities[0].location_key).toEqual('key');
      },
    );

    it.each(databases.eachSupportedId())(
      'removes old relations and stores the new relationships, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        await insertRefreshStateRow(knex, {
          entity_id: id,
          entity_ref: 'location:default/fakelocation',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: '2021-04-01 13:37:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });

        const relations = [
          {
            source: {
              kind: 'Component',
              namespace: 'Default',
              name: 'foo',
            },
            target: {
              kind: 'Component',
              namespace: 'Default',
              name: 'foo',
            },
            type: 'memberOf',
          },
        ];

        let updateResult = await db.transaction(tx =>
          db.updateProcessedEntity(tx, {
            id,
            processedEntity,
            resultHash: '',
            relations: relations,
            deferredEntities: [],
            refreshKeys: [],
          }),
        );

        let savedRelations = await knex<DbRelationsRow>('relations')
          .where({ originating_entity_id: id })
          .select();
        expect(savedRelations.length).toBe(1);
        expect(savedRelations[0]).toEqual({
          originating_entity_id: id,
          source_entity_ref: 'component:default/foo',
          type: 'memberOf',
          target_entity_ref: 'component:default/foo',
        });
        expect(updateResult.previous.relations).toEqual([]);

        updateResult = await db.transaction(tx =>
          db.updateProcessedEntity(tx, {
            id,
            processedEntity,
            resultHash: '',
            relations: relations,
            deferredEntities: [],
            refreshKeys: [],
          }),
        );

        savedRelations = await knex<DbRelationsRow>('relations')
          .where({ originating_entity_id: id })
          .select();
        expect(savedRelations.length).toBe(1);
        expect(savedRelations[0]).toEqual({
          originating_entity_id: id,
          source_entity_ref: 'component:default/foo',
          type: 'memberOf',
          target_entity_ref: 'component:default/foo',
        });
        expect(updateResult.previous.relations).toEqual([
          {
            originating_entity_id: expect.any(String),
            source_entity_ref: 'component:default/foo',
            type: 'memberOf',
            target_entity_ref: 'component:default/foo',
          },
        ]);
      },
    );

    it.each(databases.eachSupportedId())(
      'adds deferred entities to the the refresh_state table to be picked up later, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        await insertRefreshStateRow(knex, {
          entity_id: id,
          entity_ref: 'location:default/fakelocation',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: '2021-04-01 13:37:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });

        const deferredEntities = [
          {
            entity: {
              apiVersion: '1',
              kind: 'Location',
              metadata: {
                name: 'next',
              },
            },
            locationKey: 'mock',
          },
        ];

        await db.transaction(tx =>
          db.updateProcessedEntity(tx, {
            id,
            processedEntity,
            resultHash: '',
            relations: [],
            deferredEntities,
            refreshKeys: [],
          }),
        );

        const refreshStateEntries = await knex<DbRefreshStateRow>(
          'refresh_state',
        )
          .where({ entity_ref: stringifyEntityRef(deferredEntities[0].entity) })
          .select();

        expect(refreshStateEntries).toHaveLength(1);
      },
    );

    it.each(databases.eachSupportedId())(
      'updates unprocessed entities with varying location keys, %p',
      async databaseId => {
        const mockLogger = {
          debug: jest.fn(),
          error: jest.fn(),
          warn: jest.fn(),
        };
        const { knex, db } = await createDatabase(
          databaseId,
          mockLogger as unknown as Logger,
        );

        await insertRefreshStateRow(knex, {
          entity_id: id,
          entity_ref: 'location:default/fakelocation',
          unprocessed_entity: '{}',
          unprocessed_hash: generateStableHash({} as any),
          processed_entity: '{}',
          errors: '[]',
          next_update_at: '2021-04-01 13:37:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });

        await db.transaction(async tx => {
          const knexTx = tx as Knex.Transaction;

          const steps = [
            {
              locationKey: undefined,
              expectedLocationKey: null,
              testKey: 'a',
              expectedTestKey: 'a',
            },
            {
              locationKey: undefined,
              expectedLocationKey: null,
              testKey: 'b',
              expectedTestKey: 'b',
            },
            {
              locationKey: 'x',
              expectedLocationKey: 'x',
              testKey: 'c',
              expectedTestKey: 'c',
            },
            {
              locationKey: 'y',
              expectedLocationKey: 'x',
              testKey: 'd',
              expectedTestKey: 'c',
              expectConflict: true,
            },
            {
              locationKey: undefined,
              expectedLocationKey: 'x',
              testKey: 'e',
              expectedTestKey: 'c',
              expectConflict: true,
            },
            {
              locationKey: 'x',
              expectedLocationKey: 'x',
              testKey: 'f',
              expectedTestKey: 'f',
            },
          ];
          for (const step of steps) {
            mockLogger.debug.mockClear();
            mockLogger.warn.mockClear();
            mockLogger.error.mockClear();

            await db.updateProcessedEntity(tx, {
              id,
              processedEntity,
              resultHash: '',
              relations: [],
              refreshKeys: [],
              deferredEntities: [
                {
                  entity: {
                    apiVersion: '1',
                    kind: 'Component',
                    metadata: {
                      name: '1',
                    },
                    spec: {
                      type: step.testKey,
                    },
                  },
                  locationKey: step.locationKey,
                },
              ],
            });

            if (step.expectConflict) {
              // eslint-disable-next-line jest/no-conditional-expect
              expect(mockLogger.warn).toHaveBeenCalledWith(
                // eslint-disable-next-line jest/no-conditional-expect
                expect.stringMatching(/^Detected conflicting entityRef/),
              );
            } else {
              // eslint-disable-next-line jest/no-conditional-expect
              expect(mockLogger.warn).not.toHaveBeenCalled();
            }

            const states =
              await knexTx<DbRefreshStateRow>('refresh_state').select();
            expect(states).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  entity_ref: 'component:default/1',
                  location_key: step.expectedLocationKey,
                }),
                expect.objectContaining({
                  entity_ref: 'location:default/fakelocation',
                  location_key: null,
                }),
              ]),
            );
            const unprocessed = states.find(
              state => state.entity_ref === 'component:default/1',
            )!;
            const entity = JSON.parse(unprocessed.unprocessed_entity) as Entity;
            expect(entity.spec?.type).toEqual(step.expectedTestKey);

            await expect(
              knexTx<DbRefreshStateReferencesRow>(
                'refresh_state_references',
              ).select(),
            ).resolves.toEqual(
              step.expectConflict
                ? []
                : [
                    // eslint-disable-next-line jest/no-conditional-expect
                    expect.objectContaining({
                      source_entity_ref: 'location:default/fakelocation',
                      target_entity_ref: 'component:default/1',
                    }),
                  ],
            );

            expect(mockLogger.error).not.toHaveBeenCalled();
          }
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'stores the refresh keys for the entity',
      async databaseId => {
        const mockLogger = {
          debug: jest.fn(),
          error: jest.fn(),
          warn: jest.fn(),
        };
        const { knex, db } = await createDatabase(
          databaseId,
          mockLogger as unknown as Logger,
        );
        await insertRefreshStateRow(knex, {
          entity_id: id,
          entity_ref: 'location:default/fakelocation',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: '2021-04-01 13:37:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });

        const deferredEntities = [
          {
            entity: {
              apiVersion: '1',
              kind: 'Location',
              metadata: {
                name: 'next',
              },
            },
            locationKey: 'mock',
          },
        ];

        await db.transaction(tx =>
          db.updateProcessedEntity(tx, {
            id,
            processedEntity,
            resultHash: '',
            relations: [],
            deferredEntities,
            refreshKeys: [{ key: 'protocol:foo-bar.com' }],
          }),
        );

        const refreshKeys = await knex<DbRefreshKeysRow>('refresh_keys')
          .where({ entity_id: id })
          .select();

        expect(refreshKeys[0]).toEqual({
          entity_id: id,
          key: 'protocol:foo-bar.com',
        });
      },
    );
  });

  describe('updateEntityCache', () => {
    it.each(databases.eachSupportedId())(
      'updates the entityCache, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        const id = '123';
        await insertRefreshStateRow(knex, {
          entity_id: id,
          entity_ref: 'location:default/fakelocation',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: '2021-04-01 13:37:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });

        const state = { hello: { t: 'something' } };

        await db.transaction(tx =>
          db.updateEntityCache(tx, {
            id,
            state,
          }),
        );

        const entities =
          await knex<DbRefreshStateRow>('refresh_state').select();
        expect(entities.length).toBe(1);
        expect(entities[0].cache).toEqual(JSON.stringify(state));

        await db.transaction(tx =>
          db.updateEntityCache(tx, {
            id,
            state: undefined,
          }),
        );

        const entities2 =
          await knex<DbRefreshStateRow>('refresh_state').select();
        expect(entities2.length).toBe(1);
        expect(entities2[0].cache).toEqual('{}');
      },
    );
  });

  describe('getProcessableEntities', () => {
    it.each(databases.eachSupportedId())(
      'should return entities to process, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        const entity = JSON.stringify({
          kind: 'Location',
          apiVersion: '1.0.0',
          metadata: {
            name: 'xyz',
          },
        } as Entity);

        await knex<DbRefreshStateRow>('refresh_state').insert({
          entity_id: '2',
          entity_ref: 'location:default/new-root',
          unprocessed_entity: entity,
          errors: '[]',
          next_update_at: '2019-01-01 23:00:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });

        await knex<DbRefreshStateRow>('refresh_state').insert({
          entity_id: '1',
          entity_ref: 'location:default/foobar',
          unprocessed_entity: entity,
          errors: '[]',
          next_update_at: '2042-01-01 23:00:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });

        await db.transaction(async tx => {
          // request two items but only one can be processed.
          const result = await db.getProcessableEntities(tx, {
            processBatchSize: 2,
          });
          expect(result.items.length).toEqual(1);
          expect(result.items[0].entityRef).toEqual(
            'location:default/new-root',
          );

          // should not return the same item as there's nothing left to process.
          await expect(
            db.getProcessableEntities(tx, {
              processBatchSize: 2,
            }),
          ).resolves.toEqual({ items: [] });
        });
      },
    );

    it.each(databases.eachSupportedId())(
      'should update the next_refresh interval with a timestamp that includes refresh spread, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        const entity = JSON.stringify({
          kind: 'Location',
          apiVersion: '1.0.0',
          metadata: {
            name: 'xyz',
          },
        } as Entity);
        await knex<DbRefreshStateRow>('refresh_state').insert({
          entity_id: '2',
          entity_ref: 'location:default/new-root',
          unprocessed_entity: entity,
          errors: '[]',
          next_update_at: '2019-01-01 23:00:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });
        await db.transaction(async tx => {
          // Result does not include the updated timestamp
          await db.getProcessableEntities(tx, {
            processBatchSize: 1,
          });
        });
        const now = DateTime.local();
        const result = await knex<DbRefreshStateRow>('refresh_state')
          .where('entity_ref', 'location:default/new-root')
          .select();
        const nextUpdate = timestampToDateTime(result[0].next_update_at);
        const nextUpdateDiff = nextUpdate.diff(now, 'seconds');
        expect(nextUpdateDiff.seconds).toBeGreaterThanOrEqual(90);
      },
    );
  });

  describe('listParents', () => {
    let nextId = 1;
    function makeEntity(ref: string) {
      return {
        entity_id: String(nextId++),
        entity_ref: ref,
        unprocessed_entity: JSON.stringify({
          kind: 'Location',
          apiVersion: '1.0.0',
          metadata: {
            name: 'xyz',
          },
        }),
        errors: '[]',
        next_update_at: '2019-01-01 23:00:00',
        last_discovery_at: '2021-04-01 13:37:00',
      };
    }

    it.each(databases.eachSupportedId())(
      'should return parents, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);

        await knex<DbRefreshStateRow>('refresh_state').insert(
          makeEntity('location:default/root-1'),
        );
        await knex<DbRefreshStateRow>('refresh_state').insert(
          makeEntity('location:default/root-2'),
        );
        await knex<DbRefreshStateRow>('refresh_state').insert(
          makeEntity('component:default/foobar'),
        );

        await insertRefRow(knex, {
          source_key: 'source',
          target_entity_ref: 'location:default/root-2',
        });
        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root-2',
          target_entity_ref: 'location:default/root-1',
        });
        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root-1',
          target_entity_ref: 'component:default/foobar',
        });
        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root-2',
          target_entity_ref: 'component:default/foobar',
        });

        const result1 = await db.transaction(async tx =>
          db.listParents(tx, { entityRef: 'component:default/foobar' }),
        );
        expect(result1.entityRefs).toEqual([
          'location:default/root-1',
          'location:default/root-2',
        ]);

        const result2 = await db.transaction(async tx =>
          db.listParents(tx, { entityRef: 'location:default/root-1' }),
        );
        expect(result2.entityRefs).toEqual(['location:default/root-2']);

        const result3 = await db.transaction(async tx =>
          db.listParents(tx, { entityRef: 'location:default/root-2' }),
        );
        expect(result3.entityRefs).toEqual([]);
      },
    );
  });
});
