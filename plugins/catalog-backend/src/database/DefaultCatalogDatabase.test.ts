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

import { getVoidLogger } from '@backstage/backend-common';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Logger } from 'winston';
import { DefaultCatalogDatabase } from './DefaultCatalogDatabase';
import { applyDatabaseMigrations } from './migrations';
import { DbRefreshStateReferencesRow, DbRefreshStateRow } from './tables';

describe('DefaultCatalogDatabase', () => {
  const defaultLogger = getVoidLogger();
  const databases = TestDatabases.create({
    ids: ['MYSQL_8', 'POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createDatabase(
    databaseId: TestDatabaseId,
    logger: Logger = defaultLogger,
  ) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return {
      knex,
      db: new DefaultCatalogDatabase({
        database: knex,
        logger,
      }),
    };
  }

  describe('listAncestors', () => {
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
      'should return ancestors, %p',
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

        await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).insert({
          source_key: 'source',
          target_entity_ref: 'location:default/root-2',
        });
        await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).insert({
          source_entity_ref: 'location:default/root-2',
          target_entity_ref: 'location:default/root-1',
        });
        await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).insert({
          source_entity_ref: 'location:default/root-1',
          target_entity_ref: 'component:default/foobar',
        });

        const result = await db.transaction(tx =>
          db.listAncestors(tx, {
            entityRef: 'component:default/foobar',
          }),
        );
        expect(result.entityRefs).toEqual([
          'location:default/root-1',
          'location:default/root-2',
        ]);
      },
    );
  });
});
