/*
 * Copyright 2025 The Backstage Authors
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
import {
  ANNOTATION_LOCATION,
  ANNOTATION_ORIGIN_LOCATION,
} from '@backstage/catalog-model';
import { CatalogScmEventsServiceSubscriber } from '@backstage/plugin-catalog-node/alpha';
import { Knex } from 'knex';
import { applyDatabaseMigrations } from '../database/migrations';
import {
  DbFinalEntitiesRow,
  DbRefreshKeysRow,
  DbRefreshStateRow,
  DbSearchRow,
} from '../database/tables';
import { GenericScmEventRefreshProvider } from './GenericScmEventRefreshProvider';

jest.setTimeout(60_000);

describe('GenericScmEventRefreshProvider', () => {
  const databases = TestDatabases.create();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  async function initialize(databaseId: TestDatabaseId) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);

    let subscriber: CatalogScmEventsServiceSubscriber | undefined;
    const scmEvents = {
      subscribe: jest.fn().mockImplementation(sub => {
        subscriber = sub;
        return { unsubscribe: () => {} };
      }),
      publish: jest.fn(),
      markEventActionTaken: jest.fn(),
    };

    const store = new GenericScmEventRefreshProvider(knex, scmEvents, {
      refresh: true,
      unregister: true,
      move: true,
    });

    const connection = {
      applyMutation: jest.fn(),
      refresh: jest.fn(),
    };
    await store.connect(connection);

    return { store, connection, knex, subscriber: subscriber!, scmEvents };
  }

  async function insertRefreshState(knex: Knex, id: string) {
    await knex<DbRefreshStateRow>('refresh_state').insert({
      entity_id: id,
      entity_ref: `k:ns/${id}`,
      unprocessed_entity: '{}',
      processed_entity: '{}',
      errors: '[]',
      next_update_at: new Date('1980-01-01T00:00:00Z'),
      last_discovery_at: new Date('1980-01-01T00:00:00Z'),
      result_hash: 'h',
    });
  }

  async function insertFinalEntity(knex: Knex, id: string) {
    await knex<DbFinalEntitiesRow>('final_entities').insert({
      entity_id: id,
      entity_ref: `k:ns/${id}`,
      hash: 'h',
      stitch_ticket: '',
      final_entity: '{}',
    });
  }

  describe.each(databases.eachSupportedId())('%p', databaseId => {
    it('handles location.updated', async () => {
      const { knex, subscriber } = await initialize(databaseId);

      // Prepare
      await insertRefreshState(knex, '1');
      await insertRefreshState(knex, '2');
      await insertRefreshState(knex, '3');
      await insertRefreshState(knex, '4');
      await insertRefreshState(knex, '5');
      await insertRefreshState(knex, '6');

      await knex<DbRefreshKeysRow>('refresh_keys').insert([
        // match exact blob
        {
          entity_id: '1',
          key: 'url:https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml',
        },
        // match tree
        {
          entity_id: '2',
          key: 'url:https://github.com/backstage/demo/tree/master/folder/catalog-info.yaml',
        },
        // skip
        {
          entity_id: '3',
          key: 'url:https://github.com/backstage/demo/tree/master/folder/catalog-info.yaml2',
        },
      ]);

      // Insert final_entities for entities that will have search rows
      await insertFinalEntity(knex, '4');
      await insertFinalEntity(knex, '5');
      await insertFinalEntity(knex, '6');

      await knex<DbSearchRow>('search').insert([
        // match exact blob in location
        {
          entity_id: '4',
          key: `metadata.annotations.${ANNOTATION_LOCATION}`,
          original_value: 'ignored',
          value:
            'url:https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml',
        },
        // match exact blob in origin location
        {
          entity_id: '5',
          key: `metadata.annotations.${ANNOTATION_ORIGIN_LOCATION}`,
          original_value: 'ignored',
          value:
            'url:https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml',
        },
        // skip
        {
          entity_id: '6',
          key: `some-other-key`,
          original_value: 'ignored',
          value:
            'url:https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml',
        },
      ]);

      // Act
      await subscriber!.onEvents([
        {
          type: 'location.updated',
          url: 'https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml',
        },
      ]);

      // Verify
      await expect(
        knex<DbRefreshStateRow>('refresh_state')
          .select('entity_id')
          .where('next_update_at', '>', new Date('1981-01-01T00:00:00Z'))
          .orderBy('entity_id', 'asc'),
      ).resolves.toEqual([
        { entity_id: '1' },
        { entity_id: '2' },
        { entity_id: '4' },
        { entity_id: '5' },
      ]);
    });

    it('handles repository.updated', async () => {
      const { knex, subscriber } = await initialize(databaseId);

      await insertRefreshState(knex, '1');
      await insertRefreshState(knex, '2');
      await insertRefreshState(knex, '3');
      await insertRefreshState(knex, '4');
      await insertRefreshState(knex, '5');
      await insertRefreshState(knex, '6');
      await insertRefreshState(knex, '7');
      await insertRefreshState(knex, '8');

      await knex<DbRefreshKeysRow>('refresh_keys').insert([
        // match blob
        {
          entity_id: '1',
          key: 'url:https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml',
        },
        // match tree
        {
          entity_id: '2',
          key: 'url:https://github.com/backstage/demo/tree/master/folder/catalog-info.yaml',
        },
        // skip different but similar repo
        {
          entity_id: '3',
          key: 'url:https://github.com/backstage/demo2/tree/master/folder/catalog-info.yaml',
        },
      ]);

      // Insert final_entities for entities that will have search rows
      await insertFinalEntity(knex, '4');
      await insertFinalEntity(knex, '5');
      await insertFinalEntity(knex, '6');
      await insertFinalEntity(knex, '7');
      await insertFinalEntity(knex, '8');

      await knex<DbSearchRow>('search').insert([
        // match blob in location
        {
          entity_id: '4',
          key: `metadata.annotations.${ANNOTATION_LOCATION}`,
          original_value: 'ignored',
          value:
            'url:https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml',
        },
        // match tree in location
        {
          entity_id: '5',
          key: `metadata.annotations.${ANNOTATION_LOCATION}`,
          original_value: 'ignored',
          value:
            'url:https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml',
        },
        // match blob in origin location
        {
          entity_id: '6',
          key: `metadata.annotations.${ANNOTATION_ORIGIN_LOCATION}`,
          original_value: 'ignored',
          value:
            'url:https://github.com/backstage/demo/blob/master/folder/catalog-info.yaml',
        },
        // match tree in origin location
        {
          entity_id: '7',
          key: `metadata.annotations.${ANNOTATION_ORIGIN_LOCATION}`,
          original_value: 'ignored',
          value:
            'url:https://github.com/backstage/demo/tree/master/folder/catalog-info.yaml',
        },
        // skip different but similar repo
        {
          entity_id: '8',
          key: `metadata.annotations.${ANNOTATION_LOCATION}`,
          original_value: 'ignored',
          value:
            'url:https://github.com/backstage/demo2/tree/master/folder/catalog-info.yaml',
        },
      ]);

      // Act
      await subscriber!.onEvents([
        {
          type: 'repository.updated',
          url: 'https://github.com/backstage/demo',
        },
      ]);

      // Verify
      await expect(
        knex<DbRefreshStateRow>('refresh_state')
          .select('entity_id')
          .where('next_update_at', '>', new Date('1981-01-01T00:00:00Z'))
          .orderBy('entity_id', 'asc'),
      ).resolves.toEqual([
        { entity_id: '1' },
        { entity_id: '2' },
        { entity_id: '4' },
        { entity_id: '5' },
        { entity_id: '6' },
        { entity_id: '7' },
      ]);
    });
  });
});
