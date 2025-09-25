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

import { mockServices, TestDatabases } from '@backstage/backend-test-utils';
import { DefaultProviderDatabase } from '../database/DefaultProviderDatabase';
import {
  evictEntitiesFromOrphanedProviders,
  getOrphanedEntityProviderNames,
} from './evictEntitiesFromOrphanedProviders';
import { applyDatabaseMigrations } from '../database/migrations';
import { Knex } from 'knex';

jest.setTimeout(60_000);

const databases = TestDatabases.create();
const logger = mockServices.logger.mock();

afterEach(() => {
  jest.resetAllMocks();
});

describe.each(databases.eachSupportedId())('%p', databaseId => {
  let knex: Knex;
  let db: DefaultProviderDatabase;

  beforeEach(async () => {
    knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    db = new DefaultProviderDatabase({ database: knex, logger });
  });

  afterEach(async () => {
    await knex.destroy();
  });

  describe('getOrphanedEntityProviderNames', () => {
    it('correctly locates and logs orphaned providers', async () => {
      const providers = [
        { getProviderName: () => 'provider1', connect: jest.fn() },
        { getProviderName: () => 'provider2', connect: jest.fn() },
      ];

      await knex('refresh_state').insert([
        {
          entity_id: 'x',
          entity_ref: 'x',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
      ]);
      await knex('refresh_state_references').insert([
        { source_key: 'provider2', target_entity_ref: 'x' },
        { source_key: 'provider3', target_entity_ref: 'x' },
      ]);

      await expect(
        getOrphanedEntityProviderNames({
          db,
          providers,
          logger,
        }),
      ).resolves.toEqual(['provider3']);

      expect(logger.warn).toHaveBeenCalledTimes(4);
      expect(logger.warn).toHaveBeenCalledWith(
        `Found 1 orphaned entity provider(s)`,
      );
      expect(logger.warn).toHaveBeenCalledWith(
        `Database contained providers: 'provider2', 'provider3'`,
      );
      expect(logger.warn).toHaveBeenCalledWith(
        `Installed providers were: 'provider1', 'provider2'`,
      );
      expect(logger.warn).toHaveBeenCalledWith(
        `Orphaned providers were thus: 'provider3'`,
      );
    });
  });

  describe('evictEntitiesFromOrphanedProviders', () => {
    it('replaces unprocessed entities for orphaned providers with empty items', async () => {
      jest.spyOn(db, 'replaceUnprocessedEntities');

      const providers = [
        { getProviderName: () => 'provider1', connect: jest.fn() },
        { getProviderName: () => 'provider2', connect: jest.fn() },
      ];

      await knex('refresh_state').insert([
        {
          entity_id: 'x',
          entity_ref: 'x',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
      ]);
      await knex('refresh_state_references').insert([
        { source_key: 'foo', target_entity_ref: 'x' },
        { source_key: 'bar', target_entity_ref: 'x' },
      ]);

      await evictEntitiesFromOrphanedProviders({ db, providers, logger });

      expect(db.replaceUnprocessedEntities).toHaveBeenCalledTimes(2);
      expect(db.replaceUnprocessedEntities).toHaveBeenCalledWith(
        expect.anything(),
        {
          sourceKey: 'foo',
          type: 'full',
          items: [],
        },
      );
      expect(db.replaceUnprocessedEntities).toHaveBeenCalledWith(
        expect.anything(),
        {
          sourceKey: 'bar',
          type: 'full',
          items: [],
        },
      );
    });

    it('does not replace unprocessed entities for providers that are not orphaned', async () => {
      jest.spyOn(db, 'replaceUnprocessedEntities');

      const providers = [
        { getProviderName: () => 'provider1', connect: jest.fn() },
        { getProviderName: () => 'provider2', connect: jest.fn() },
      ];

      await knex('refresh_state').insert([
        {
          entity_id: 'x',
          entity_ref: 'x',
          unprocessed_entity: '{}',
          processed_entity: '{}',
          errors: '[]',
          next_update_at: knex.fn.now(),
          last_discovery_at: knex.fn.now(),
        },
      ]);
      await knex('refresh_state_references').insert([
        { source_key: 'foo', target_entity_ref: 'x' },
        { source_key: 'provider1', target_entity_ref: 'x' },
      ]);

      await evictEntitiesFromOrphanedProviders({ db, providers, logger });

      expect(db.replaceUnprocessedEntities).not.toHaveBeenCalledWith(
        expect.anything(),
        {
          sourceKey: 'provider1',
          type: 'full',
          items: [],
        },
      );
    });
  });
});
