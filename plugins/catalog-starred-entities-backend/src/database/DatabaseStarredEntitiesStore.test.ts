/*
 * Copyright 2022 The Backstage Authors
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
import { Knex } from 'knex';

import {
  DatabaseStarredEntitiesStore,
  RawDbStarredEntitiesRow,
} from './DatabaseStarredEntitiesStore';

jest.setTimeout(60_000);

const databases = TestDatabases.create({
  ids: ['POSTGRES_13', 'SQLITE_3'],
});

async function createStore(databaseId: TestDatabaseId) {
  const knex = await databases.init(databaseId);
  return {
    knex,
    storage: await DatabaseStarredEntitiesStore.create(knex),
  };
}

describe.each(databases.eachSupportedId())(
  'DatabaseStarredEntitiesStore (%s)',
  databaseId => {
    let storage: DatabaseStarredEntitiesStore;
    let knex: Knex;

    beforeAll(async () => {
      ({ storage, knex } = await createStore(databaseId));
    });

    afterEach(async () => {
      jest.resetAllMocks();

      await knex('starred_entities').del();
    });

    const insert = (data: RawDbStarredEntitiesRow[]) =>
      knex<RawDbStarredEntitiesRow>('starred_entities').insert(data);
    const query = () =>
      knex<RawDbStarredEntitiesRow>('starred_entities')
        .orderBy('user_id')
        .orderBy('entity_ref')
        .select('*');

    describe('getStarredEntities', () => {
      it('should get empty starred entities', async () => {
        expect(
          await storage.transaction(tx =>
            storage.getStarredEntities(tx, { userId: 'user-1' }),
          ),
        ).toEqual([]);
      });

      it('should return starred entities', async () => {
        await insert([
          {
            user_id: 'user-1',
            entity_ref: 'component-b',
          },
          {
            user_id: 'user-1',
            entity_ref: 'component-a',
          },
          {
            user_id: 'user-2',
            entity_ref: 'component-c',
          },
        ]);

        expect(
          await storage.transaction(tx =>
            storage.getStarredEntities(tx, { userId: 'user-1' }),
          ),
        ).toEqual(['component-a', 'component-b']);
      });
    });

    describe('starEntity', () => {
      it('should star entity', async () => {
        await storage.transaction(tx =>
          storage.starEntity(tx, {
            userId: 'user-1',
            entity: {
              kind: 'component',
              namespace: 'default',
              name: 'component-a',
            },
          }),
        );

        expect(await query()).toEqual([
          {
            user_id: 'user-1',
            entity_ref: 'component:default/component-a',
          },
        ]);
      });

      it('should not fail if already starred', async () => {
        await insert([
          {
            user_id: 'user-1',
            entity_ref: 'component:default/component-a',
          },
        ]);

        await storage.transaction(tx =>
          storage.starEntity(tx, {
            userId: 'user-1',
            entity: {
              kind: 'component',
              namespace: 'default',
              name: 'component-a',
            },
          }),
        );

        expect(await query()).toEqual([
          {
            user_id: 'user-1',
            entity_ref: 'component:default/component-a',
          },
        ]);
      });
    });

    describe('toggleEntity', () => {
      it('should star entity', async () => {
        await storage.transaction(tx =>
          storage.toggleEntity(tx, {
            userId: 'user-1',
            entity: {
              kind: 'component',
              namespace: 'default',
              name: 'component-a',
            },
          }),
        );

        expect(await query()).toEqual([
          {
            user_id: 'user-1',
            entity_ref: 'component:default/component-a',
          },
        ]);
      });

      it('should unstar entity ref', async () => {
        await insert([
          {
            user_id: 'user-1',
            entity_ref: 'component:default/component-a',
          },
          {
            user_id: 'user-2',
            entity_ref: 'component:default/component-a',
          },
        ]);

        await storage.transaction(tx =>
          storage.toggleEntity(tx, {
            userId: 'user-1',
            entity: {
              kind: 'component',
              namespace: 'default',
              name: 'component-a',
            },
          }),
        );

        expect(await query()).toEqual([
          {
            user_id: 'user-2',
            entity_ref: 'component:default/component-a',
          },
        ]);
      });
    });
  },
);
