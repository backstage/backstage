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

import { TestDatabases, mockServices } from '@backstage/backend-test-utils';
import { Knex } from 'knex';
import { applyDatabaseMigrations } from '../../database/migrations';
import { describePerformanceTest, performanceTraceEnabled } from './lib/env';
import { DefaultProviderDatabase } from '../../database/DefaultProviderDatabase';
import { DeferredEntity } from '@backstage/plugin-catalog-node';

// #region Helpers

jest.setTimeout(600_000);

const databases = TestDatabases.create({
  ids: [/* 'MYSQL_8', */ 'POSTGRES_17', /* 'POSTGRES_13',*/ 'SQLITE_3'],
  disableDocker: false,
});

const traceLog: typeof console.log = performanceTraceEnabled
  ? console.log
  : () => {};

// #endregion
// #region Tests

describePerformanceTest('providerDeltaMutations', () => {
  let knex: Knex;

  describe.each(databases.eachSupportedId())('%p', databaseId => {
    beforeAll(async () => {
      knex = await databases.init(databaseId);
      await applyDatabaseMigrations(knex);
    });

    afterAll(async () => {
      await knex.destroy();
    });

    it.each([200, 50_000])(
      'inserts and then overwrites identical sets using delta mutations, batch size %p',
      async batchSize => {
        const sut = new DefaultProviderDatabase({
          database: knex,
          logger: mockServices.logger.mock(),
        });

        const sourceKey = 'source-key';
        const entities: DeferredEntity[] = Array.from(
          { length: batchSize },
          (_, i) => ({
            entity: {
              apiVersion: 'backstage.io/v1alpha1',
              kind: 'Component',
              metadata: {
                name: `component-${i}`,
                namespace: 'default',
              },
              spec: {
                type: 'service',
                lifecycle: 'production',
              },
            },
          }),
        );

        let start = Date.now();
        await sut.replaceUnprocessedEntities(knex, {
          type: 'delta',
          sourceKey,
          added: entities,
          removed: [],
        });
        let perSecond = Math.round(batchSize / ((Date.now() - start) / 1000));
        traceLog(
          `${databaseId} inserted ${perSecond} entities per second at a batch size of ${batchSize}`,
        );

        start = Date.now();
        const rounds = 20;
        for (let i = 0; i < rounds; i++) {
          await sut.replaceUnprocessedEntities(knex, {
            type: 'delta',
            sourceKey,
            added: entities,
            removed: [],
          });
        }
        perSecond = Math.round(
          (batchSize * rounds) / ((Date.now() - start) / 1000),
        );
        traceLog(
          `${databaseId} updated ${perSecond} entities per second at a batch size of ${batchSize}`,
        );

        expect(true).toBe(true);
      },
    );
  });
});

// #endregion
