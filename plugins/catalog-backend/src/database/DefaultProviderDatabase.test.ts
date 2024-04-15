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
import { Entity } from '@backstage/catalog-model';
import { Knex } from 'knex';
import * as uuid from 'uuid';
import { DefaultProviderDatabase } from './DefaultProviderDatabase';
import { applyDatabaseMigrations } from './migrations';
import { DbRefreshStateReferencesRow, DbRefreshStateRow } from './tables';
import { LoggerService } from '@backstage/backend-plugin-api';

jest.setTimeout(60_000);

describe('DefaultProviderDatabase', () => {
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
      db: new DefaultProviderDatabase({
        database: knex,
        logger,
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

  describe('replaceUnprocessedEntities', () => {
    const createLocations = async (db: Knex, entityRefs: string[]) => {
      for (const ref of entityRefs) {
        await insertRefreshStateRow(db, {
          entity_id: uuid.v4(),
          entity_ref: ref,
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: '2021-04-01 13:37:00',
          last_discovery_at: '2021-04-01 13:37:00',
        });
      }
    };

    it.each(databases.eachSupportedId())(
      'replaces all existing state correctly for simple dependency chains, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        /*
        config -> location:default/root -> location:default/root-1 -> location:default/root-2
        database -> location:default/second -> location:default/root-2
        */
        await createLocations(knex, [
          'location:default/root',
          'location:default/root-1',
          'location:default/root-2',
          'location:default/second',
        ]);

        await insertRefRow(knex, {
          source_key: 'config',
          target_entity_ref: 'location:default/root',
        });

        await insertRefRow(knex, {
          source_key: 'database',
          target_entity_ref: 'location:default/second',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root',
          target_entity_ref: 'location:default/root-1',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root-1',
          target_entity_ref: 'location:default/root-2',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/second',
          target_entity_ref: 'location:default/root-2',
        });

        await db.transaction(tx =>
          db.replaceUnprocessedEntities(tx, {
            type: 'full',
            sourceKey: 'config',
            items: [
              {
                entity: {
                  apiVersion: '1.0.0',
                  metadata: {
                    name: 'new-root',
                  },
                  kind: 'Location',
                } as Entity,
                locationKey: 'file:///tmp/foobar',
              },
            ],
          }),
        );

        const currentRefreshState =
          await knex<DbRefreshStateRow>('refresh_state').select();

        const currentRefRowState = await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).select();

        for (const ref of [
          'location:default/root',
          'location:default/root-1',
        ]) {
          expect(
            currentRefreshState.some(t => t.entity_ref === ref),
          ).toBeFalsy();
        }

        expect(
          currentRefreshState.some(
            t => t.entity_ref === 'location:default/new-root',
          ),
        ).toBeTruthy();

        expect(
          currentRefRowState.some(
            t =>
              t.source_entity_ref === 'location:default/root' &&
              t.target_entity_ref === 'location:default/root-1',
          ),
        ).toBeFalsy();

        expect(
          currentRefRowState.some(
            t =>
              t.source_entity_ref === 'location:default/root-1' &&
              t.target_entity_ref === 'location:default/root-2',
          ),
        ).toBeFalsy();

        expect(
          currentRefRowState.some(
            t =>
              t.target_entity_ref === 'location:default/root-1' &&
              t.source_key === 'config',
          ),
        ).toBeFalsy();

        expect(
          currentRefRowState.some(
            t =>
              t.target_entity_ref === 'location:default/new-root' &&
              t.source_key === 'config',
          ),
        ).toBeTruthy();
      },
    );

    it.each(databases.eachSupportedId())(
      'should work for more complex chains, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        /*
        config -> location:default/root -> location:default/root-1 -> location:default/root-2
        config -> location:default/root -> location:default/root-1a -> location:default/root-2
        */
        await createLocations(knex, [
          'location:default/root',
          'location:default/root-1',
          'location:default/root-2',
          'location:default/root-1a',
        ]);

        await insertRefRow(knex, {
          source_key: 'config',
          target_entity_ref: 'location:default/root',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root',
          target_entity_ref: 'location:default/root-1',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root',
          target_entity_ref: 'location:default/root-1a',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root-1',
          target_entity_ref: 'location:default/root-2',
        });

        await insertRefRow(knex, {
          source_entity_ref: 'location:default/root-1a',
          target_entity_ref: 'location:default/root-2',
        });

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'full',
            sourceKey: 'config',
            items: [
              {
                entity: {
                  apiVersion: '1.0.0',
                  metadata: {
                    name: 'new-root',
                  },
                  kind: 'Location',
                } as Entity,
                locationKey: 'file:/tmp/foobar',
              },
            ],
          });
        });

        const currentRefreshState =
          await knex<DbRefreshStateRow>('refresh_state').select();

        const currentRefRowState = await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).select();

        const deletedRefs = [
          'location:default/root',
          'location:default/root-1',
          'location:default/root-1a',
          'location:default/root-2',
        ];

        for (const ref of deletedRefs) {
          expect(
            currentRefreshState.some(t => t.entity_ref === ref),
          ).toBeFalsy();
        }

        expect(
          currentRefreshState.some(
            t => t.entity_ref === 'location:default/new-root',
          ),
        ).toBeTruthy();

        expect(
          currentRefRowState.some(
            t =>
              t.source_key === 'config' &&
              t.target_entity_ref === 'location:default/new-root',
          ),
        ).toBeTruthy();

        expect(
          currentRefRowState.some(
            t =>
              t.source_key === 'config' &&
              t.target_entity_ref === 'location:default/root',
          ),
        ).toBeFalsy();

        expect(
          currentRefRowState.some(
            t =>
              t.source_entity_ref === 'location:default/root' &&
              t.target_entity_ref === 'location:default/root-1',
          ),
        ).toBeFalsy();

        expect(
          currentRefRowState.some(
            t =>
              t.source_entity_ref === 'location:default/root' &&
              t.target_entity_ref === 'location:default/root-1a',
          ),
        ).toBeFalsy();

        expect(
          currentRefRowState.some(
            t =>
              t.source_entity_ref === 'location:default/root-1' &&
              t.target_entity_ref === 'location:default/root-2',
          ),
        ).toBeFalsy();

        expect(
          currentRefRowState.some(
            t =>
              t.source_entity_ref === 'location:default/root-1a' &&
              t.target_entity_ref === 'location:default/root-2',
          ),
        ).toBeFalsy();
      },
    );

    it.each(databases.eachSupportedId())(
      'should add new locations using the delta options, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);

        // Existing state and references should stay
        await createLocations(knex, ['location:default/existing']);
        await insertRefRow(knex, {
          source_key: 'lols',
          target_entity_ref: 'location:default/existing',
        });

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'delta',
            sourceKey: 'lols',
            removed: [],
            added: [
              {
                entity: {
                  apiVersion: '1.0.0',
                  metadata: {
                    name: 'new-root',
                  },
                  kind: 'Location',
                } as Entity,
                locationKey: 'file:///tmp/foobar',
              },
            ],
          });
        });

        const currentRefreshState =
          await knex<DbRefreshStateRow>('refresh_state').select();

        const currentRefRowState = await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).select();

        expect(
          currentRefreshState.some(
            t => t.entity_ref === 'location:default/new-root',
          ),
        ).toBeTruthy();

        expect(
          currentRefRowState.some(
            t =>
              t.source_key === 'lols' &&
              t.target_entity_ref === 'location:default/new-root',
          ),
        ).toBeTruthy();

        expect(
          currentRefreshState.some(
            t => t.entity_ref === 'location:default/existing',
          ),
        ).toBeTruthy();

        expect(
          currentRefRowState.some(
            t =>
              t.source_key === 'lols' &&
              t.target_entity_ref === 'location:default/existing',
          ),
        ).toBeTruthy();
      },
    );

    it.each(databases.eachSupportedId())(
      'should not remove locations that are referenced elsewhere, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        /*
        config-1 -> location:default/root
        config-2 -> location:default/root
        */
        await createLocations(knex, ['location:default/root']);

        await insertRefRow(knex, {
          source_key: 'config-1',
          target_entity_ref: 'location:default/root',
        });
        await insertRefRow(knex, {
          source_key: 'config-2',
          target_entity_ref: 'location:default/root',
        });

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'full',
            sourceKey: 'config-1',
            items: [],
          });
        });

        const currentRefreshState =
          await knex<DbRefreshStateRow>('refresh_state').select();

        const currentRefRowState = await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).select();

        expect(currentRefRowState).toEqual([
          expect.objectContaining({
            source_key: 'config-2',
            target_entity_ref: 'location:default/root',
          }),
        ]);

        expect(currentRefreshState).toEqual([
          expect.objectContaining({
            entity_ref: 'location:default/root',
          }),
        ]);
      },
    );

    it.each(databases.eachSupportedId())(
      'should remove old locations using the delta options, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        await createLocations(knex, ['location:default/new-root']);

        await insertRefRow(knex, {
          source_key: 'lols',
          target_entity_ref: 'location:default/new-root',
        });

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'delta',
            sourceKey: 'lols',
            added: [],
            removed: [
              {
                entityRef: 'location:default/new-root',
                locationKey: 'file:/tmp/foobar',
              },
            ],
          });
        });

        const currentRefreshState =
          await knex<DbRefreshStateRow>('refresh_state').select();

        const currentRefRowState = await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).select();

        expect(
          currentRefreshState.some(
            t => t.entity_ref === 'location:default/new-root',
          ),
        ).toBeFalsy();

        expect(
          currentRefRowState.some(
            t =>
              t.source_key === 'lols' &&
              t.target_entity_ref === 'location:default/new-root',
          ),
        ).toBeFalsy();
      },
    );

    it.each(databases.eachSupportedId())(
      'should update the location key during full replace, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);
        await createLocations(knex, ['location:default/removed']);
        await insertRefreshStateRow(knex, {
          entity_id: uuid.v4(),
          entity_ref: 'location:default/replaced',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: '2021-04-01 13:37:00',
          last_discovery_at: '2021-04-01 13:37:00',
          location_key: 'file:///tmp/old',
        });

        await insertRefRow(knex, {
          source_key: 'lols',
          target_entity_ref: 'location:default/removed',
        });
        await insertRefRow(knex, {
          source_key: 'lols',
          target_entity_ref: 'location:default/replaced',
        });

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'full',
            sourceKey: 'lols',
            items: [
              {
                entity: {
                  apiVersion: '1.0.0',
                  metadata: {
                    name: 'replaced',
                  },
                  kind: 'Location',
                } as Entity,
                locationKey: 'file:///tmp/foobar',
              },
            ],
          });
        });

        const currentRefreshState =
          await knex<DbRefreshStateRow>('refresh_state').select();
        expect(currentRefreshState).toEqual([
          expect.objectContaining({
            entity_ref: 'location:default/replaced',
            location_key: 'file:///tmp/foobar',
          }),
        ]);

        const currentRefRowState = await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).select();
        expect(currentRefRowState).toEqual([
          expect.objectContaining({
            source_key: 'lols',
            target_entity_ref: 'location:default/replaced',
          }),
        ]);
      },
    );

    it.each(databases.eachSupportedId())(
      'should support replacing modified entities during a full update, %p',
      async databaseId => {
        const { knex, db } = await createDatabase(databaseId);

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'full',
            sourceKey: 'lols',
            items: [
              {
                entity: {
                  apiVersion: '1',
                  kind: 'Component',
                  metadata: { name: 'a' },
                  spec: { marker: 'WILL_CHANGE' },
                } as Entity,
                locationKey: 'file:///tmp/a',
              },
              {
                entity: {
                  apiVersion: '1',
                  kind: 'Component',
                  metadata: { name: 'b' },
                  spec: { marker: 'NEVER_CHANGES' },
                } as Entity,
                locationKey: 'file:///tmp/b',
              },
            ],
          });
        });

        let state = await knex<DbRefreshStateRow>('refresh_state').select();
        expect(state).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              entity_ref: 'component:default/a',
              location_key: 'file:///tmp/a',
              unprocessed_entity: expect.stringContaining('WILL_CHANGE'),
            }),
            expect.objectContaining({
              entity_ref: 'component:default/b',
              location_key: 'file:///tmp/b',
              unprocessed_entity: expect.stringContaining('NEVER_CHANGES'),
            }),
          ]),
        );
        let references = await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).select();
        expect(references).toEqual([
          {
            id: 1,
            source_key: 'lols',
            source_entity_ref: null,
            target_entity_ref: 'component:default/a',
          },
          {
            id: 2,
            source_key: 'lols',
            source_entity_ref: null,
            target_entity_ref: 'component:default/b',
          },
        ]);

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'full',
            sourceKey: 'lols',
            items: [
              {
                entity: {
                  apiVersion: '1',
                  kind: 'Component',
                  metadata: { name: 'a' },
                  spec: { marker: 'HAS_CHANGED' },
                } as Entity,
                locationKey: 'file:///tmp/a',
              },
              {
                entity: {
                  apiVersion: '1',
                  kind: 'Component',
                  metadata: { name: 'b' },
                  spec: { marker: 'NEVER_CHANGES' },
                } as Entity,
                locationKey: 'file:///tmp/b',
              },
            ],
          });
        });

        state = await knex<DbRefreshStateRow>('refresh_state').select();
        expect(state).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              entity_ref: 'component:default/a',
              location_key: 'file:///tmp/a',
              unprocessed_entity: expect.stringContaining('HAS_CHANGED'),
            }),
            expect.objectContaining({
              entity_ref: 'component:default/b',
              location_key: 'file:///tmp/b',
              unprocessed_entity: expect.stringContaining('NEVER_CHANGES'),
            }),
          ]),
        );
        references = await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).select();
        expect(references).toEqual([
          {
            id: 2,
            source_key: 'lols',
            source_entity_ref: null,
            target_entity_ref: 'component:default/b',
          },
          {
            id: 3,
            source_key: 'lols',
            source_entity_ref: null,
            target_entity_ref: 'component:default/a',
          },
        ]);
      },
    );

    it.each(databases.eachSupportedId())(
      'should successfully fall back from batch to individual mode on conflicts, %p',
      async databaseId => {
        const fakeLogger = {
          debug: jest.fn(),
        };
        const { knex, db } = await createDatabase(
          databaseId,
          fakeLogger as any,
        );

        await createLocations(knex, ['component:default/a']);

        await insertRefRow(knex, {
          source_key: undefined,
          target_entity_ref: 'component:default/a',
        });

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'full',
            sourceKey: 'lols',
            items: [
              {
                entity: {
                  apiVersion: '1',
                  kind: 'Component',
                  metadata: { name: 'a' },
                  spec: { marker: 'WILL_CHANGE' },
                } as Entity,
                locationKey: 'file:///tmp/a',
              },
            ],
          });
        });
        expect(fakeLogger.debug).toHaveBeenCalledWith(
          expect.stringMatching(
            /Fast insert path failed, falling back to slow path/,
          ),
        );

        const state = await knex<DbRefreshStateRow>('refresh_state').select();
        expect(state).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              entity_ref: 'component:default/a',
              location_key: 'file:///tmp/a',
              unprocessed_entity: expect.stringContaining('WILL_CHANGE'),
            }),
          ]),
        );
      },
    );

    it.each(databases.eachSupportedId())(
      'should gracefully handle accidental duplicate refresh state references when deletion happens during a full sync, %p',
      async databaseId => {
        const fakeLogger = { debug: jest.fn() };
        const { knex, db } = await createDatabase(
          databaseId,
          fakeLogger as any,
        );

        await createLocations(knex, ['component:default/a']);

        await insertRefRow(knex, {
          source_key: 'a',
          target_entity_ref: 'component:default/a',
        });
        await insertRefRow(knex, {
          source_key: 'a',
          target_entity_ref: 'component:default/a',
        });

        await db.transaction(async tx => {
          await db.replaceUnprocessedEntities(tx, {
            type: 'full',
            sourceKey: 'a',
            items: [],
          });
        });

        const state = await knex<DbRefreshStateRow>('refresh_state').select();
        expect(state).toEqual([]);
      },
    );
  });
});
