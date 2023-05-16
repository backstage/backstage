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

import { DatabaseBadgesStore } from './badgesStore';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import { Entity } from '@backstage/catalog-model';

describe('DatabaseBadgesStore', () => {
  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'test',
    },
  };

  const databases = TestDatabases.create();

  async function createDatabaseBadgesStore(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    return {
      knex,
      badgeStore: await DatabaseBadgesStore.create({
        database: { getClient: async () => knex },
      }),
    };
  }

  describe.each(databases.eachSupportedId())('%p', databaseId => {
    let knex: Knex;
    let badgeStore: DatabaseBadgesStore;

    beforeEach(async () => {
      ({ knex, badgeStore } = await createDatabaseBadgesStore(databaseId));
    });

    it('createABadge if not existing in DB', async () => {
      const uuid = await badgeStore.getBadgeUuid(
        entity.metadata.name,
        entity.metadata.namespace || 'default',
        entity.kind,
      );

      expect(uuid.uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );

      const storedBadge = await badgeStore.getBadgeFromUuid(uuid.uuid);
      expect(storedBadge?.kind).toEqual(entity.kind);
      expect(storedBadge?.name).toEqual(entity.metadata.name);
      expect(storedBadge?.namespace).toEqual(
        entity.metadata.namespace || 'default',
      );
    });

    it('getBadge if badge already exist in DB', async () => {
      await knex('badges').truncate();
      await knex('badges').insert([
        {
          uuid: 'uuid1',
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
      ]);

      const storedEntity = await badgeStore.getBadgeFromUuid('uuid1');

      expect(storedEntity).toEqual({
        name: 'test',
        namespace: 'default',
        kind: 'component',
      });
    });

    it('getBadgeUuid if badge exist in DB', async () => {
      await knex('badges').truncate();
      await knex('badges').insert([
        {
          uuid: 'uuid1',
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
      ]);

      const storedUuid = await badgeStore.getBadgeUuid(
        'test',
        'default',
        'component',
      );

      expect(storedUuid).toEqual({ uuid: 'uuid1' });
    });
  });
});
