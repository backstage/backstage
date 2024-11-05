/*
 * Copyright 2024 The Backstage Authors
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

import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  TestDatabases,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { CatalogClient } from '@backstage/catalog-client';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { Knex } from 'knex';
import { applyDatabaseMigrations } from '../../database/migrations';
import {
  SyntheticLoadEntitiesProcessor,
  SyntheticLoadEntitiesProvider,
  SyntheticLoadOptions,
} from './lib/catalogModuleSyntheticLoadEntities';
import { describePerformanceTest, performanceTraceEnabled } from './lib/env';

jest.setTimeout(600_000);

const traceLog: typeof console.log = performanceTraceEnabled
  ? console.log
  : () => {};

const completionPolling = async (load: SyntheticLoadOptions, knex: Knex) => {
  const { baseEntitiesCount, childrenCount } = load;
  const expectedTotal = baseEntitiesCount + baseEntitiesCount * childrenCount;

  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(async () => {
      try {
        const stitchedCount = await knex('final_entities')
          .count({ count: '*' })
          .whereNotNull('final_entity')
          .then(rows => Number(rows[0].count));

        if (stitchedCount === expectedTotal) {
          clearInterval(interval);
          resolve();
        }
      } catch (error) {
        clearInterval(interval);
        reject(error);
      }
    }, 1000);
  });
};

describePerformanceTest('getEntitiesPerformanceTest', () => {
  const databases = TestDatabases.create({
    ids: [/* 'MYSQL_8', */ 'POSTGRES_16', /* 'POSTGRES_12',*/ 'SQLITE_3'],
    disableDocker: false,
  });

  it.each(databases.eachSupportedId())(
    'fetch entities, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      const load: SyntheticLoadOptions = {
        baseEntitiesCount: 2000,
        baseRelationsCount: 3,
        baseRelationsSkew: 0.3,
        childrenCount: 3,
      };

      traceLog('Starting test backend');

      const backend = await startTestBackend({
        features: [
          import('@backstage/plugin-catalog-backend/alpha'),
          mockServices.database.factory({ knex }),
          createBackendModule({
            pluginId: 'catalog',
            moduleId: 'synthetic-load-entities',
            register(reg) {
              reg.registerInit({
                deps: {
                  catalog: catalogProcessingExtensionPoint,
                },
                async init({ catalog }) {
                  catalog.addEntityProvider(
                    new SyntheticLoadEntitiesProvider(load, {}),
                  );
                  catalog.addProcessor(
                    new SyntheticLoadEntitiesProcessor(load),
                  );
                },
              });
            },
          }),
        ],
      });

      const expectedTotal =
        load.baseEntitiesCount + load.baseEntitiesCount * load.childrenCount;
      traceLog(`Waiting for completion polling of ${expectedTotal} entities`);

      await expect(completionPolling(load, knex)).resolves.toBeUndefined();

      const client = new CatalogClient({
        discoveryApi: {
          getBaseUrl: jest
            .fn()
            .mockResolvedValue(
              `http://localhost:${backend.server.port()}/api/catalog`,
            ),
        },
      });
      const start = Date.now();
      traceLog(`[${databaseId}] Starting to fetch ${expectedTotal} entities`);

      // Fetch all entities
      const response = await client.getEntities();
      expect(response.items).toHaveLength(expectedTotal);

      const fetchDuration = Date.now() - start;
      traceLog(
        `[${databaseId}] Fetched ${expectedTotal} entities in ${fetchDuration}ms`,
      );

      await backend.stop();
      await knex.destroy();
    },
  );
});
