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
import {
  CatalogApi,
  CatalogClient,
  GetEntitiesResponse,
} from '@backstage/catalog-client';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { Knex } from 'knex';
import { default as catalogPlugin } from '../..';
import {
  SyntheticLoadEntitiesProcessor,
  SyntheticLoadEntitiesProvider,
  SyntheticLoadOptions,
} from './lib/catalogModuleSyntheticLoadEntities';
import { describePerformanceTest, performanceTraceEnabled } from './lib/env';

// #region Helpers

jest.setTimeout(600_000);

const databases = TestDatabases.create({
  ids: [/* 'MYSQL_8', */ 'POSTGRES_17', /* 'POSTGRES_13',*/ 'SQLITE_3'],
  disableDocker: false,
});

const traceLog: typeof console.log = performanceTraceEnabled
  ? console.log
  : () => {};

async function createBackend(
  knex: Knex,
  load: SyntheticLoadOptions,
): Promise<{
  client: CatalogApi;
  numberOfEntities: number;
  stop: () => Promise<void>;
}> {
  const numberOfEntities =
    load.baseEntitiesCount + load.baseEntitiesCount * load.childrenCount;

  traceLog(`Creating test backend with ${numberOfEntities} entities`);

  const backend = await startTestBackend({
    features: [
      catalogPlugin,
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
              catalog.addProcessor(new SyntheticLoadEntitiesProcessor(load));
            },
          });
        },
      }),
    ],
  });

  while (
    (await knex('final_entities')
      .count({ count: '*' })
      .whereNotNull('final_entity')
      .then(rows => Number(rows[0].count))) !== numberOfEntities
  ) {
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  const client = new CatalogClient({
    discoveryApi: {
      getBaseUrl: jest
        .fn()
        .mockResolvedValue(
          `http://localhost:${backend.server.port()}/api/catalog`,
        ),
    },
  });

  return {
    client,
    numberOfEntities,
    stop: backend.stop.bind(backend),
  };
}

// #endregion
// #region Tests

describePerformanceTest('getEntities', () => {
  let knex: Knex;
  let backend: Awaited<ReturnType<typeof createBackend>>;

  describe.each(databases.eachSupportedId())('burst reads, %p', databaseId => {
    beforeAll(async () => {
      knex = await databases.init(databaseId);
      backend = await createBackend(knex, {
        baseEntitiesCount: 2000,
        baseRelationsCount: 3,
        baseRelationsSkew: 0.3,
        childrenCount: 3,
      });
    });

    afterAll(async () => {
      await backend.stop();
      await knex.destroy();
    });

    it('does a large burst read', async () => {
      let response;
      for (let i = 0; i < 10; ++i) {
        response = await backend.client.getEntities();
      }
      expect(response!.items).toHaveLength(backend.numberOfEntities);
    });
  });

  describe.each(databases.eachSupportedId())('filtering, %p', databaseId => {
    beforeAll(async () => {
      knex = await databases.init(databaseId);
      backend = await createBackend(knex, {
        baseEntitiesCount: 20000,
        baseRelationsCount: 0,
        baseRelationsSkew: 0,
        childrenCount: 0,
      });
    });

    afterAll(async () => {
      await backend.stop();
      await knex.destroy();
    });

    it('single matching filter, all fields', async () => {
      let response: GetEntitiesResponse;
      for (let i = 0; i < 20; ++i) {
        response = await backend.client.getEntities({
          filter: { kind: 'Location' },
        });
      }
      expect(response!.items).toHaveLength(backend.numberOfEntities);
    });

    it('single matching filter, one field', async () => {
      let response: GetEntitiesResponse;
      for (let i = 0; i < 20; ++i) {
        response = await backend.client.getEntities({
          filter: { kind: 'Location' },
          fields: ['kind'],
        });
      }
      expect(response!.items).toHaveLength(backend.numberOfEntities);
    });

    it('single non-matching filter', async () => {
      let response: GetEntitiesResponse;
      for (let i = 0; i < 20; ++i) {
        response = await backend.client.getEntities({
          filter: { kind: 'NotALocation' },
        });
      }
      expect(response!.items).toHaveLength(0);
    });

    it('complex filter, all fields', async () => {
      let response: GetEntitiesResponse;
      for (let i = 0; i < 20; ++i) {
        response = await backend.client.getEntities({
          filter: [
            {
              kind: 'Location',
            },
            {
              kind: 'Location',
              'metadata.name': new Array(100)
                .fill(0)
                .map((_, j) => `synthetic-${j}`),
            },
            ...new Array(10).fill(0).map((_, j) => ({
              kind: 'NotALocation',
              'metadata.name': new Array(10)
                .fill(0)
                .map((__, k) => `no-match-${i}-${j}-${k}`),
            })),
          ],
        });
      }
      expect(response!.items).toHaveLength(backend.numberOfEntities);
    });
  });
});

// #endregion
