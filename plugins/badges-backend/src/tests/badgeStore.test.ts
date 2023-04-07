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

import { DatabaseBadgesStore } from '../database/badgesStore';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import { Entity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { GetEntitiesResponse } from '@backstage/catalog-client';
import crypto from 'crypto';

describe('DatabaseBadgesStore', () => {
  const config = new ConfigReader({
    backend: {
      baseUrl: 'http://127.0.0.1',
      listen: {
        port: 7007,
      },
    },
    app: {
      badges: {
        obfuscate: true,
      },
    },
    custom: {
      'badges-backend': {
        salt: 'random-string',
        cacheTimeToLive: '60',
      },
    },
  });

  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'test',
    },
  };

  const entities: Entity[] = [
    entity,
    {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'test-2',
      },
    },
    {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'test-3',
      },
    },
  ];

  const defaultEntityListResponse: GetEntitiesResponse = {
    items: entities,
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

    it('createAllBadges', async () => {
      await badgeStore.createAllBadges(
        defaultEntityListResponse,
        config.getString('custom.badges-backend.salt'),
      );

      const storedBadges = await badgeStore.getAllBadges();
      const testedEntities: {
        name: string;
        namespace: string;
        kind: string;
        hash: string;
      }[] = [];

      entities.forEach(entityInLoop => {
        const kind = entityInLoop.kind.toLowerCase();
        const namespace = entityInLoop.metadata.namespace || 'default';
        const name = entityInLoop.metadata.name.toLocaleLowerCase();
        const salt = config.getString('custom.badges-backend.salt');
        const entityHash = crypto
          .createHash('sha256')
          .update(`${kind}:${namespace}:${name}:${salt}`)
          .digest('hex');

        testedEntities.push({
          hash: entityHash,
          name: name,
          namespace: namespace,
          kind: kind,
        });
        expect(storedBadges).toEqual(expect.arrayContaining(testedEntities));
        expect(storedBadges.length).toEqual(3);
      });
    });

    it('getBadgeFromHash', async () => {
      await knex('badges').truncate();
      await knex('badges').insert([
        {
          hash: 'hash1',
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
      ]);

      const storedEntity = await badgeStore.getBadgeFromHash('hash1');

      expect(storedEntity).toEqual({
        name: 'test',
        namespace: 'default',
        kind: 'component',
      });
    });

    it('getHashFromEntityMetadata', async () => {
      await knex('badges').truncate();
      await knex('badges').insert([
        {
          hash: 'hash1',
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
      ]);

      const storedHash = await badgeStore.getHashFromEntityMetadata(
        'test',
        'default',
        'component',
      );

      expect(storedHash).toEqual({
        hash: 'hash1',
      });
    });

    it('deleteObsoleteHashes', async () => {
      const entityHash = crypto
        .createHash('sha256')
        .update(
          `component:default:test:${config.getString(
            'custom.badges-backend.salt',
          )}`,
        )
        .digest('hex');

      await knex('badges').insert([
        {
          hash: 'obsoleteHash',
          name: 'obsoleteEntity',
          namespace: 'default',
          kind: 'component',
        },
        {
          hash: entityHash,
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
      ]);

      await badgeStore.deleteObsoleteHashes(
        defaultEntityListResponse,
        config.getString('custom.badges-backend.salt'),
      );

      const storedBadges = await badgeStore.getAllBadges();

      expect(storedBadges).toEqual(
        expect.not.arrayContaining([
          {
            hash: 'obsoleteHash',
            name: 'obsoleteEntity',
            namespace: 'default',
            kind: 'component',
          },
        ]),
      );
      expect(storedBadges.length).toEqual(1);
      expect(storedBadges).toEqual(
        expect.arrayContaining([
          {
            hash: entityHash,
            name: 'test',
            namespace: 'default',
            kind: 'component',
          },
        ]),
      );
    });

    it('countAllBadges', async () => {
      await knex('badges').truncate();
      await knex('badges').insert([
        {
          hash: 'hash1',
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
        {
          hash: 'hash2',
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
        {
          hash: 'hash3',
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
        {
          hash: 'hash4',
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
      ]);

      const storedBadgesCount = await badgeStore.countAllBadges();
      expect(storedBadgesCount).toEqual(4);
    });

    it('getAllBadges', async () => {
      await knex('badges').truncate();
      await knex('badges').insert([
        {
          hash: 'hash1',
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
        {
          hash: 'hash2',
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
        {
          hash: 'hash3',
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
        {
          hash: 'hash4',
          name: 'test',
          namespace: 'default',
          kind: 'component',
        },
      ]);

      const storedBadgesCount = await badgeStore.countAllBadges();
      expect(storedBadgesCount).toEqual(4);
    });
  });
});
