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

import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  TestDatabases,
  mockServices,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { createDeferred } from '@backstage/types';
import { Knex } from 'knex';
import { default as catalogPlugin } from '../..';
import { applyDatabaseMigrations } from '../../database/migrations';
import {
  SyntheticLoadEntitiesProcessor,
  SyntheticLoadEntitiesProvider,
  SyntheticLoadEvents,
  SyntheticLoadOptions,
} from './lib/catalogModuleSyntheticLoadEntities';
import { describePerformanceTest, performanceTraceEnabled } from './lib/env';

jest.setTimeout(600_000);

const traceLog: typeof console.log = performanceTraceEnabled
  ? console.log
  : () => {};

class Tracker {
  private insertBaseEntitiesStart: number | undefined;
  private insertBaseEntitiesEnd: number | undefined;
  private readonly deferred = createDeferred();

  constructor(
    private readonly knex: Knex,
    private readonly load: SyntheticLoadOptions,
  ) {}

  events(): SyntheticLoadEvents {
    return {
      onBeforeInsertBaseEntities: () => {
        this.insertBaseEntitiesStart = Date.now();
        traceLog(`Inserting ${this.load.baseEntitiesCount} base entities`);
      },
      onAfterInsertBaseEntities: async () => {
        this.insertBaseEntitiesEnd = Date.now();

        const insertDuration = (
          (this.insertBaseEntitiesEnd - this.insertBaseEntitiesStart!) /
          1000
        ).toFixed(1);
        traceLog(
          `Inserted ${this.load.baseEntitiesCount} base entities in ${insertDuration} seconds`,
        );

        await this.completionPolling();

        const processingDuration = (
          (Date.now() - this.insertBaseEntitiesEnd) /
          1000
        ).toFixed(1);
        traceLog(
          `Stitched ${this.load.baseEntitiesCount} entities in ${processingDuration} seconds`,
        );

        this.deferred.resolve();
      },
      onError: error => {
        this.deferred.reject(error);
      },
    };
  }

  async completion(): Promise<void> {
    return this.deferred;
  }

  private completionPolling() {
    const { baseEntitiesCount, childrenCount } = this.load;
    const expectedTotal = baseEntitiesCount + baseEntitiesCount * childrenCount;

    let processedTotal = 0;
    let stitchedTotal = 0;

    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const processedCount = await this.knex('refresh_state')
            .count({ count: '*' })
            .whereNotNull('processed_entity')
            .then(rows => Number(rows[0].count));

          const stitchedCount = await this.knex('final_entities')
            .count({ count: '*' })
            .whereNotNull('final_entity')
            .then(rows => Number(rows[0].count));

          const processedDelta = processedCount - processedTotal;
          const processedPercent = (
            (processedCount / expectedTotal) *
            100
          ).toFixed(1);
          const stitchedDelta = stitchedCount - stitchedTotal;
          const stitchedPercent = (
            (stitchedCount / expectedTotal) *
            100
          ).toFixed(1);

          const processedSummary = `${processedCount} (${processedPercent}%, ${processedDelta}/s)`;
          const stitchedSummary = `${stitchedCount} (${stitchedPercent}%, ${stitchedDelta}/s)`;
          traceLog(
            `Processed: ${processedSummary}\nStitched:  ${stitchedSummary}`,
          );

          processedTotal = processedCount;
          stitchedTotal = stitchedCount;

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
  }
}

describePerformanceTest('stitchingPerformance', () => {
  const databases = TestDatabases.create({
    ids: [/* 'MYSQL_8', */ 'POSTGRES_17', 'POSTGRES_13', 'SQLITE_3'],
  });

  it.each(databases.eachSupportedId())(
    'runs stitching in immediate mode, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      const load: SyntheticLoadOptions = {
        baseEntitiesCount: 1000,
        baseRelationsCount: 3,
        baseRelationsSkew: 0.3,
        childrenCount: 3,
      };

      const config = {
        backend: { baseUrl: 'http://localhost:7007' },
        catalog: { stitchingStrategy: { mode: 'immediate' } },
      };

      const tracker = new Tracker(knex, load);

      const backend = await startTestBackend({
        features: [
          catalogPlugin,
          mockServices.rootConfig.factory({ data: config }),
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
                    new SyntheticLoadEntitiesProvider(load, tracker.events()),
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

      await expect(tracker.completion()).resolves.toBeUndefined();
      await backend.stop();
      await knex.destroy();
    },
  );

  it.each(databases.eachSupportedId())(
    'runs stitching in deferred mode, %p',
    async databaseId => {
      const knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);

      const load: SyntheticLoadOptions = {
        baseEntitiesCount: 1000,
        baseRelationsCount: 3,
        baseRelationsSkew: 0.3,
        childrenCount: 3,
      };

      const config = {
        backend: { baseUrl: 'http://localhost:7007' },
        catalog: { stitchingStrategy: { mode: 'deferred' } },
      };

      const tracker = new Tracker(knex, load);

      const backend = await startTestBackend({
        features: [
          import('@backstage/plugin-catalog-backend'),
          mockServices.rootConfig.factory({ data: config }),
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
                    new SyntheticLoadEntitiesProvider(load, tracker.events()),
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

      await expect(tracker.completion()).resolves.toBeUndefined();
      await backend.stop();
      await knex.destroy();
    },
  );
});
