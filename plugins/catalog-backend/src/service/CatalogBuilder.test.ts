/*
 * Copyright 2023 The Backstage Authors
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
import { UrlReaderService } from '@backstage/backend-plugin-api';
import { CatalogProcessingEngine } from '../processing';
import { CatalogBuilder } from './CatalogBuilder';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { ConfigReader } from '@backstage/config';
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import { applyDatabaseMigrations } from '../database/migrations';
import { getVoidLogger } from '@backstage/backend-common';

describe('CatalogBuilder', () => {
  let knex: Knex;

  afterEach(async () => {
    await knex.destroy();
  });

  const databases = TestDatabases.create({
    ids: ['SQLITE_3'],
  });

  async function createDatabase(databaseId: TestDatabaseId) {
    knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
  }

  it.each(databases.eachSupportedId())(
    'processingEngine can be replaced',
    async databaseId => {
      await createDatabase(databaseId);

      const fakeEngine: CatalogProcessingEngine = {
        start: async () => {},
        stop: async () => {},
      };
      const builder = CatalogBuilder.create({
        database: { getClient: async () => knex },
        config: ConfigReader.fromConfigs([]),
        logger: getVoidLogger(),
        permissions: jest.fn() as unknown as PermissionEvaluator,
        reader: jest.fn() as unknown as UrlReaderService,
      });
      builder.setProcessingEngine(fakeEngine);

      const { processingEngine } = await builder.build();

      expect(processingEngine).toBe(fakeEngine);
    },
  );
});
