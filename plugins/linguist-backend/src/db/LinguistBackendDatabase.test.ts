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

import { Knex as KnexType, Knex } from 'knex';
import { TestDatabases } from '@backstage/backend-test-utils';
import {
  LinguistBackendDatabase,
  LinguistBackendStore,
} from './LinguistBackendDatabase';
import { Languages, ProcessedEntity } from '@backstage/plugin-linguist-common';

function createDatabaseManager(
  client: KnexType,
  skipMigrations: boolean = false,
) {
  return {
    getClient: async () => client,
    migrations: {
      skip: skipMigrations,
    },
  };
}

const rawDbEntityResultRows = [
  {
    id: '14b32439-848a-49b2-92a4-98753f932606',
    entity_ref: 'template:default/create-react-app-template',
    languages: undefined,
    processed_date: undefined,
  },
  {
    id: '8c85d3ec-ccea-4b29-9de9-ccdd7e5ba452',
    entity_ref: 'template:default/docs-template',
    languages: undefined,
    processed_date: undefined,
  },
  {
    id: 'b922c87b-37bc-4505-b4af-70a1438decda',
    entity_ref: 'template:default/pull-request',
    languages:
      '{"languageCount":1,"totalBytes":2205,"processedDate":"2023-02-15T20:10:21.378Z","breakdown":[{"name":"YAML","percentage":100,"bytes":2205,"type":"data","color":"#cb171e"}]}',
    processed_date: new Date('2023-02-15 20:10:21.378Z'),
  },
  {
    id: 'bd555e6d-a3d0-4b48-a930-194db8f80db7',
    entity_ref: 'template:default/react-ssr-template',
    languages:
      '{"languageCount":8,"totalBytes":8988,"processedDate":"2023-02-15T20:10:21.388Z","breakdown":[{"name":"INI","percentage":2.26,"bytes":203,"type":"data","color":"#d1dbe0"},{"name":"JavaScript","percentage":5.94,"bytes":534,"type":"programming","color":"#f1e05a"},{"name":"YAML","percentage":31.09,"bytes":2794,"type":"data","color":"#cb171e"},{"name":"Markdown","percentage":11.79,"bytes":1060,"type":"prose","color":"#083fa1"},{"name":"JSON","percentage":21.09,"bytes":1896,"type":"data","color":"#292929"},{"name":"CSS","percentage":0,"bytes":0,"type":"markup","color":"#563d7c"},{"name":"TSX","percentage":26.01,"bytes":2338,"type":"programming","color":"#3178c6"},{"name":"TypeScript","percentage":1.81,"bytes":163,"type":"programming","color":"#3178c6"}]}',
    processed_date: new Date('2023-02-15 20:10:21.388Z'),
  },
  {
    id: '4145c0cf-44e9-4e95-9d57-781af4685b28',
    entity_ref: 'template:default/springboot-template',
    languages:
      '{"languageCount":9,"totalBytes":80986,"processedDate":"2023-02-15T20:10:21.419Z","breakdown":[{"name":"Shell","percentage":0.16,"bytes":130,"type":"programming","color":"#89e051"},{"name":"INI","percentage":0.35,"bytes":286,"type":"data","color":"#d1dbe0"},{"name":"Dockerfile","percentage":0.3,"bytes":246,"type":"programming","color":"#384d54"},{"name":"YAML","percentage":3.92,"bytes":3171,"type":"data","color":"#cb171e"},{"name":"Markdown","percentage":1.31,"bytes":1059,"type":"prose","color":"#083fa1"},{"name":"XML","percentage":10.48,"bytes":8491,"type":"data","color":"#0060ac"},{"name":"Java","percentage":1.8,"bytes":1455,"type":"programming","color":"#b07219"},{"name":"Text","percentage":81.22,"bytes":65780,"type":"prose"},{"name":"Protocol Buffer","percentage":0.45,"bytes":368,"type":"data"}]}',
    processed_date: new Date('2023-02-15 20:10:21.419Z'),
  },
];

describe('Linguist database', () => {
  const databases = TestDatabases.create();
  let store: LinguistBackendStore;
  let testDbClient: Knex<any, unknown[]>;
  beforeAll(async () => {
    testDbClient = await databases.init('SQLITE_3');
    const database = createDatabaseManager(testDbClient);

    store = await LinguistBackendDatabase.create(await database.getClient());
  });
  beforeEach(async () => {
    await testDbClient.batchInsert('entity_result', rawDbEntityResultRows);
  });
  afterEach(async () => {
    await testDbClient('entity_result').delete();
  });

  it('should be able to return entity results', async () => {
    const validLanguagesResult: Languages = {
      languageCount: 1,
      totalBytes: 2205,
      processedDate: '2023-02-15T20:10:21.378Z',
      breakdown: [
        {
          name: 'YAML',
          percentage: 100,
          bytes: 2205,
          type: 'data',
          color: '#cb171e',
        },
      ],
    };

    const entityResult = await store.getEntityResults(
      'template:default/pull-request',
    );
    expect(entityResult).toMatchObject(validLanguagesResult);
  });

  it('should return empty entity results when not found', async () => {
    const validEmptyLanguagesResult: Languages = {
      languageCount: 0,
      totalBytes: 0,
      processedDate: 'undefined',
      breakdown: [],
    };

    const entityResult = await store.getEntityResults(
      'template:default/create-react-app-template',
    );
    expect(entityResult).toMatchObject(validEmptyLanguagesResult);
  });

  it('should be able to return unprocessed entities', async () => {
    const validUnprocessedEntities: string[] = [
      'template:default/create-react-app-template',
      'template:default/docs-template',
    ];

    const unprocessedEntities = await store.getUnprocessedEntities();

    expect(unprocessedEntities).toMatchObject(validUnprocessedEntities);
  });

  it('should be able to return processed entities', async () => {
    const validProcessedEntities: ProcessedEntity[] = [
      {
        entityRef: 'template:default/pull-request',
        processedDate: new Date('2023-02-15 20:10:21.378Z'),
      },
      {
        entityRef: 'template:default/react-ssr-template',
        processedDate: new Date('2023-02-15 20:10:21.388Z'),
      },
      {
        entityRef: 'template:default/springboot-template',
        processedDate: new Date('2023-02-15 20:10:21.419Z'),
      },
    ];

    const processedEntities = await store.getProcessedEntities();

    expect(processedEntities).toMatchObject(validProcessedEntities);
  });

  it('should insert new entities and ignore duplicates', async () => {
    const before = testDbClient.count('entity_result');

    await store.insertNewEntity('component:/default/new-entity-one');
    await store.insertNewEntity('component:/default/new-entity-two');
    await store.insertNewEntity('template:default/pull-request');

    const after = testDbClient.count('entity_result');

    expect(before).toEqual(after);
  });
});
